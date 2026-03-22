"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface NotificationItem {
  notification_id: string;
  customer_user_id: string;
  customer_fullname: string | null;
  message_preview: string;
  created_at: string | null;
  is_read: boolean;
}

interface NotificationResponse {
  success: boolean;
  items?: NotificationItem[];
  unread_count?: number;
}

function formatTime(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Header() {
  const router = useRouter();
  const { activeStoreId } = useAuth();

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const loadNotifications = async (showLoader = false) => {
    const token = localStorage.getItem("token") || "";
    if (!token || !activeStoreId) return;

    if (showLoader) setLoading(true);
    try {
      const res = await fetch(`${API_URL}/store/manage/${activeStoreId}/notifications?page=1&per_page=20&unread_only=true`, {
        headers: { Authorization: token },
      });
      const data: NotificationResponse = await res.json();
      if (data.success) {
        setNotifications(data.items ?? []);
        setUnreadCount(data.unread_count ?? 0);
      }
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    if (!activeStoreId) return;
    loadNotifications(true);
    const interval = setInterval(() => {
      loadNotifications(false);
    }, 8000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStoreId]);

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (!popoverRef.current) return;
      if (!popoverRef.current.contains(event.target as Node)) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const openNotification = (item: NotificationItem) => {
    if (!activeStoreId) return;
    setPopoverOpen(false);

    if (!item.is_read) {
      setNotifications((prev) =>
        prev.filter((notification) => notification.notification_id !== item.notification_id)
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      const token = localStorage.getItem("token") || "";
      if (token) {
        fetch(`${API_URL}/store/manage/${activeStoreId}/notifications/read`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ notification_ids: [item.notification_id] }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data?.success && typeof data.unread_count === "number") {
              setUnreadCount(data.unread_count);
            }
          })
          .catch(() => {
            // Keep optimistic UI and let next polling cycle reconcile.
          });
      }
    }

    router.push(`/store/${activeStoreId}/messages?customer_id=${encodeURIComponent(item.customer_user_id)}`);
  };

  return (
    <header className="fixed top-0 right-0 z-40 w-[calc(100%-280px)] bg-white flex items-center justify-between px-8 h-14 border-b border-slate-200 antialiased">
      <div className="flex items-center space-x-4">
        <div className="relative w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">
            search
          </span>
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
            placeholder="Search..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1 text-slate-500">
          <div className="relative" ref={popoverRef}>
            <button
              onClick={() => setPopoverOpen((v) => !v)}
              className="hover:bg-slate-100 transition-colors p-2 rounded-lg relative"
              aria-label="Notifications"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] leading-[18px] text-center font-semibold">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {popoverOpen && (
              <div className="absolute right-0 mt-2 w-[360px] max-h-[420px] overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg z-50">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-on-surface">Notifications</h3>
                  <span className="text-[11px] text-slate-500">{unreadCount} unread</span>
                </div>

                {loading ? (
                  <div className="p-4 text-sm text-slate-400">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-sm text-slate-400">No notifications.</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {notifications.map((item) => (
                      <button
                        key={item.notification_id}
                        onClick={() => openNotification(item)}
                        className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${item.is_read ? "opacity-70" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-medium text-on-surface">
                            {item.customer_fullname || item.customer_user_id}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">{formatTime(item.created_at)}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {item.message_preview || "(No message preview)"}
                        </p>
                        {!item.is_read && (
                          <span className="inline-block mt-1.5 text-[10px] font-medium text-red-600">Unread</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <button className="hover:bg-slate-100 transition-colors p-2 rounded-lg">
            <span className="material-symbols-outlined text-xl">help</span>
          </button>
          <button className="hover:bg-slate-100 transition-colors p-2 rounded-lg">
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </div>

        <div className="h-8 w-[1px] bg-slate-200" />

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-xs font-semibold text-on-surface">CashR Pro</p>
            <p className="text-[10px] text-slate-500">Premium Store</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary font-semibold text-xs border border-slate-200">
            TN
          </div>
        </div>
      </div>
    </header>
  );
}
