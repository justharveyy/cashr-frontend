"use client";

import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface CustomerItem {
  customer_id: string;
  user_id: string;
  fullname: string | null;
  avatar: string | null;
  phone_number: string | null;
  email: string | null;
  last_message: string | null;
  last_message_at: string | null;
  needs_human_in_loop: boolean;
}

interface SessionItem {
  session_id: string;
  created_at: string | null;
  last_updated: string | null;
  message_count: number;
}

interface ChatItem {
  chat_id: string;
  session: string;
  role: "user" | "assistant";
  content: string;
  created_at: string | null;
}

function initials(name: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function formatTime(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDay(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function MessagesPage({ params }: { params: Promise<{ store_id: string }> }) {
  const { store_id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCustomerId = searchParams.get("customer_id") || null;
  const [hasAppliedPreselected, setHasAppliedPreselected] = useState(false);

  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
  const activeCustomer = useMemo(
    () => customers.find((c) => c.user_id === activeCustomerId) ?? null,
    [customers, activeCustomerId]
  );

  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);

  const [messageText, setMessageText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [togglingHandoff, setTogglingHandoff] = useState(false);

  const getToken = () => localStorage.getItem("token") || "";

  useEffect(() => {
    setHasAppliedPreselected(false);
  }, [preselectedCustomerId, store_id]);

  const sameChats = (a: ChatItem[], b: ChatItem[]) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
      const left = a[i];
      const right = b[i];
      if (
        left.chat_id !== right.chat_id ||
        left.role !== right.role ||
        left.content !== right.content ||
        left.created_at !== right.created_at
      ) {
        return false;
      }
    }
    return true;
  };

  const loadCustomers = useCallback(async (showLoader = false) => {
    const token = getToken();
    if (!token) {
      setLoadingCustomers(false);
      return;
    }

    if (showLoader) setLoadingCustomers(true);
    try {
      const res = await fetch(`${API_URL}/store/manage/${store_id}/customers?page=1&per_page=50`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (!data.success) return;

      const rows: CustomerItem[] = [...(data.items ?? [])].sort((a, b) => {
        const left = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
        const right = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
        return right - left;
      });
      setCustomers(rows);
      if (rows.length === 0) {
        setActiveCustomerId(null);
        return;
      }

      if (!hasAppliedPreselected && preselectedCustomerId && rows.some((row) => row.user_id === preselectedCustomerId)) {
        setActiveCustomerId(preselectedCustomerId);
        setHasAppliedPreselected(true);
        return;
      }

      if (!hasAppliedPreselected) {
        setHasAppliedPreselected(true);
      }

      setActiveCustomerId((prev) => {
        if (prev && rows.some((row) => row.user_id === prev)) return prev;
        return rows[0].user_id;
      });
    } finally {
      if (showLoader) setLoadingCustomers(false);
    }
  }, [hasAppliedPreselected, preselectedCustomerId, store_id]);

  const loadSessions = useCallback(async (customerId: string | null, keepCurrentSelection = false) => {
    const token = getToken();
    if (!token || !customerId) {
      setSessions([]);
      setActiveSessionId(null);
      return;
    }

    const res = await fetch(`${API_URL}/store/manage/${store_id}/customers/${customerId}/sessions?page=1&per_page=20`, {
      headers: { Authorization: token },
    });
    const data = await res.json();
    if (!data.success) return;

    const rows: SessionItem[] = data.items ?? [];
    setSessions(rows);
    setActiveSessionId((prev) => {
      if (keepCurrentSelection && prev && rows.some((s) => s.session_id === prev)) return prev;
      return rows.length > 0 ? rows[0].session_id : null;
    });
  }, [store_id]);

  const loadChats = useCallback(async (showLoader = false) => {
    const token = getToken();
    if (!token || !activeSessionId) {
      setChats([]);
      return;
    }

    if (showLoader) setLoadingChats(true);
    try {
      const res = await fetch(`${API_URL}/store/manage/${store_id}/sessions/${activeSessionId}/chats?page=1&per_page=100`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (data.success) {
        const rows: ChatItem[] = data.items ?? [];
        setChats((prev) => (sameChats(prev, rows) ? prev : rows));
      }
    } finally {
      if (showLoader) setLoadingChats(false);
    }
  }, [activeSessionId, store_id]);

  const markNotificationsReadForCustomer = useCallback(async (customerId: string) => {
    const token = getToken();
    if (!token) return;
    try {
      await fetch(`${API_URL}/store/manage/${store_id}/notifications/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ customer_id: customerId }),
      });
    } catch {
      // no-op
    }
  }, [store_id]);

  useEffect(() => {
    loadCustomers(true);
  }, [loadCustomers]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadCustomers(false);
    }, 6000);
    return () => clearInterval(interval);
  }, [loadCustomers]);

  useEffect(() => {
    loadSessions(activeCustomerId, true);
  }, [activeCustomerId, loadSessions]);

  useEffect(() => {
    if (!activeCustomerId) return;
    const interval = setInterval(() => {
      loadSessions(activeCustomerId, true);
    }, 7000);
    return () => clearInterval(interval);
  }, [activeCustomerId, loadSessions]);

  useEffect(() => {
    loadChats(true);
  }, [loadChats]);

  useEffect(() => {
    if (!activeSessionId) return;
    const interval = setInterval(() => {
      loadChats(false);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeSessionId, loadChats]);

  useEffect(() => {
    if (!activeCustomerId) return;
    markNotificationsReadForCustomer(activeCustomerId);
  }, [activeCustomerId, markNotificationsReadForCustomer]);

  useEffect(() => {
    const node = chatScrollRef.current;
    if (!node) return;
    if (shouldAutoScrollRef.current) {
      node.scrollTo({ top: node.scrollHeight, behavior: "auto" });
    }
  }, [chats]);

  const onChatScroll = () => {
    const node = chatScrollRef.current;
    if (!node) return;
    const distanceFromBottom = node.scrollHeight - node.scrollTop - node.clientHeight;
    shouldAutoScrollRef.current = distanceFromBottom < 80;
  };

  const sendMessage = async () => {
    const token = getToken();
    if (!token || !activeCustomerId || sending) return;
    if (!messageText.trim() && !imageFile) return;

    const form = new FormData();
    if (messageText.trim()) form.append("text", messageText.trim());
    if (imageFile) form.append("image", imageFile);

    setSending(true);
    try {
      const res = await fetch(`${API_URL}/store/manage/${store_id}/customers/${activeCustomerId}/message`, {
        method: "POST",
        headers: { Authorization: token },
        body: form,
      });
      const data = await res.json();
      if (data.success) {
        setMessageText("");
        setImageFile(null);
        await loadCustomers(false);
        await loadSessions(activeCustomerId, true);
        await loadChats(false);
      }
    } finally {
      setSending(false);
    }
  };

  const toggleHumanInLoop = async () => {
    if (!activeCustomer || togglingHandoff) return;
    const token = getToken();
    if (!token) return;

    const nextEnabled = !activeCustomer.needs_human_in_loop;
    setTogglingHandoff(true);
    try {
      const res = await fetch(`${API_URL}/store/manage/${store_id}/customers/${activeCustomer.user_id}/human-in-loop`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ enabled: nextEnabled }),
      });
      const data = await res.json();
      if (!data.success) return;

      setCustomers((prev) =>
        prev.map((customer) =>
          customer.user_id === activeCustomer.user_id
            ? { ...customer, needs_human_in_loop: nextEnabled }
            : customer
        )
      );
    } finally {
      setTogglingHandoff(false);
    }
  };

  return (
    <div className="-mx-8 -mt-20 -mb-8">
      <div className="flex h-screen pt-14">
        <section className="w-80 flex flex-col border-r border-slate-200 bg-white">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-on-surface mb-1">CRM Inbox</h2>
            <p className="text-xs text-slate-400">Customers with recent conversations</p>
          </div>

          <div className="flex-grow overflow-y-auto">
            {loadingCustomers ? (
              <div className="p-4 text-sm text-slate-400">Loading conversations...</div>
            ) : customers.length === 0 ? (
              <div className="p-4 text-sm text-slate-400">No customers found.</div>
            ) : (
              customers.map((c) => {
                const active = c.user_id === activeCustomerId;
                return (
                  <button
                    key={c.customer_id}
                    onClick={() => setActiveCustomerId(c.user_id)}
                    className={`w-full text-left p-4 border-b border-slate-50 transition-colors ${
                      active ? "bg-blue-50/50 border-l-3 border-l-primary" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm text-on-surface">{c.fullname || "Unknown"}</span>
                      <span className="text-[10px] text-slate-400">{formatTime(c.last_message_at)}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mb-1">{c.last_message || "No messages yet"}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">{c.phone_number || c.user_id}</span>
                      {c.needs_human_in_loop && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">
                          Human-in-loop
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        <section className="flex-grow flex flex-col bg-slate-50 relative">
          <div className="px-6 py-3 bg-white border-b border-slate-200 sticky top-14 z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-sm text-slate-600">
                {initials(activeCustomer?.fullname || null)}
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight">{activeCustomer?.fullname || "Select a customer"}</h3>
                <div className="text-[10px] text-slate-400">{activeCustomer?.phone_number || activeCustomer?.user_id || ""}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {activeCustomer && (
                <button
                  onClick={toggleHumanInLoop}
                  disabled={togglingHandoff}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    activeCustomer.needs_human_in_loop
                      ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {togglingHandoff
                    ? "Updating..."
                    : activeCustomer.needs_human_in_loop
                      ? "Human-in-loop ON"
                      : "AI Auto-reply ON"}
                </button>
              )}
              <div className="text-[10px] text-slate-400">{sessions.length} session(s)</div>
            </div>
          </div>

          <div ref={chatScrollRef} onScroll={onChatScroll} className="flex-grow overflow-y-auto p-6 space-y-4">
            {activeSessionId && (
              <div className="flex justify-center">
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-medium text-slate-400">
                  Session started {formatDay(sessions.find((s) => s.session_id === activeSessionId)?.created_at || null)}
                </span>
              </div>
            )}

            {loadingChats ? (
              <div className="text-sm text-slate-400">Loading messages...</div>
            ) : chats.length === 0 ? (
              <div className="text-sm text-slate-400">No messages in this session.</div>
            ) : (
              chats.map((chat, index) => {
                const mine = chat.role === "assistant";
                return (
                  <div
                    key={`${chat.chat_id}-${chat.created_at || "no-time"}-${index}`}
                    className={`flex max-w-lg ${mine ? "ml-auto justify-end" : ""}`}
                  >
                    <div className={`p-3.5 rounded-lg text-sm leading-relaxed ${mine ? "bg-primary text-white rounded-tr-none" : "bg-white border border-slate-200 rounded-tl-none text-on-surface"}`}>
                      <div className="whitespace-pre-wrap">{chat.content}</div>
                      <span className={`text-[10px] mt-1.5 block ${mine ? "text-white/70" : "text-slate-400"}`}>
                        {formatTime(chat.created_at)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-5 bg-white border-t border-slate-200">
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all">
              <textarea
                className="w-full bg-transparent border-none focus:ring-0 text-sm p-2 resize-none h-16 outline-none placeholder:text-slate-400"
                placeholder="Type your message here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <div className="flex items-center justify-between px-2 pb-1">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer p-1.5 text-slate-400 hover:text-slate-600 transition-colors" title="Attach image">
                    <span className="material-symbols-outlined text-lg">image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  {imageFile && (
                    <span className="text-[10px] text-slate-500 max-w-[220px] truncate">{imageFile.name}</span>
                  )}
                </div>
                <button
                  onClick={sendMessage}
                  disabled={sending || (!messageText.trim() && !imageFile) || !activeCustomerId}
                  className="bg-primary text-white px-4 py-1.5 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending..." : "Send"}
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-80 bg-white overflow-y-auto border-l border-slate-200">
          <div className="p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-5">Customer Profile</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Name</p>
                <p className="font-medium text-on-surface">{activeCustomer?.fullname || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Phone</p>
                <p className="font-medium text-on-surface">{activeCustomer?.phone_number || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Email</p>
                <p className="font-medium text-on-surface">{activeCustomer?.email || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">User ID</p>
                <p className="font-mono text-xs text-slate-600">{activeCustomer?.user_id || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Support Mode</p>
                <p className="font-medium text-on-surface">
                  {activeCustomer
                    ? activeCustomer.needs_human_in_loop
                      ? "Human-in-loop"
                      : "AI auto-reply"
                    : "-"}
                </p>
              </div>
            </div>

            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-8 mb-3">Sessions</h4>
            <div className="space-y-2">
              {sessions.length === 0 ? (
                <p className="text-xs text-slate-400">No sessions found.</p>
              ) : (
                sessions.map((session) => (
                  <button
                    key={session.session_id}
                    onClick={() => setActiveSessionId(session.session_id)}
                    className={`w-full text-left border rounded-lg p-3 transition-colors ${
                      activeSessionId === session.session_id
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <p className="text-xs font-mono text-slate-600 truncate">{session.session_id}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{session.message_count} messages</p>
                    <p className="text-[10px] text-slate-400">Updated {formatTime(session.last_updated)}</p>
                  </button>
                ))
              )}
            </div>

            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-8 mb-3">Create Order</h4>
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2.5">
              <p className="text-xs text-slate-500">
                Open full order flow with this customer preselected.
              </p>
              <button
                onClick={() => {
                  if (!activeCustomerId) return;
                  router.push(`/store/${store_id}/new-transaction?customer_id=${activeCustomerId}`);
                }}
                disabled={!activeCustomerId}
                className="w-full bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to New Order
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
