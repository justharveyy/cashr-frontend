"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface StoreDetails {
  store_id: string;
  store_name: string;
  zalo_bot_id: string;
  zalo_bot_token: string;
}

type ToastType = "success" | "error";

interface ToastState {
  message: string;
  type: ToastType;
}

export default function DashboardPage({ params }: { params: Promise<{ store_id: string }> }) {
  const { store_id } = use(params);

  const [storeName, setStoreName] = useState("Your Store");
  const [zaloToken, setZaloToken] = useState("");
  const [botId, setBotId] = useState("");
  const [loadingStore, setLoadingStore] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((type: ToastType, message: string) => {
    setToast({ type, message });

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  const fetchStoreDetails = useCallback(async () => {
    const token = localStorage.getItem("token") || "";
    if (!token) {
      setLoadingStore(false);
      setInlineError("Missing auth token. Please log in again.");
      return;
    }

    setLoadingStore(true);
    setInlineError(null);

    try {
      const res = await fetch(`${API_URL}/store/manage/${store_id}/get`, {
        headers: { Authorization: token },
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load store settings.");
      }

      const store = data.store as Partial<StoreDetails>;
      setStoreName(store.store_name || "Your Store");
      setZaloToken(store.zalo_bot_token || "");
      setBotId(store.zalo_bot_id || "");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load store settings.";
      setInlineError(message);
    } finally {
      setLoadingStore(false);
    }
  }, [store_id]);

  useEffect(() => {
    fetchStoreDetails();
  }, [fetchStoreDetails]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || "";
    const trimmedToken = zaloToken.trim();

    if (!token) {
      const message = "Missing auth token. Please log in again.";
      setInlineError(message);
      showToast("error", message);
      return;
    }

    if (!trimmedToken || connecting) return;

    setConnecting(true);
    setInlineError(null);

    try {
      const res = await fetch(`${API_URL}/store/manage/${store_id}/zalobot-key`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ zalo_bot_token: trimmedToken }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to connect Zalo bot.");
      }

      showToast("success", "Zalo Bot configured successfully.");
      await fetchStoreDetails();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to connect Zalo bot.";
      setInlineError(message);
      showToast("error", message);
    } finally {
      setConnecting(false);
    }
  };

  const botConnected = !!botId;

  return (
    <>
      {toast && (
        <div className="fixed top-20 right-8 z-[60]">
          <div
            className={`min-w-[280px] max-w-sm rounded-lg border px-4 py-3 shadow-lg ${
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] mt-0.5">
                {toast.type === "success" ? "check_circle" : "error"}
              </span>
              <p className="text-sm font-medium leading-snug">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-on-surface mb-1">{storeName} Dashboard</h2>
        <p className="text-slate-500 text-sm">
          Your business performance is up by{" "}
          <span className="text-emerald-600 font-medium">12.4%</span> this week.
        </p>
      </div>

      {/* Zalo Bot Configuration */}
      <section className="mb-6 bg-white rounded-lg p-6 border border-slate-200">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-on-surface">Zalo Bot Configuration</h3>
            <p className="text-sm text-slate-500 mt-1">
              Paste your Zalo bot token and connect it to this store.
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
              botConnected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${botConnected ? "bg-emerald-500" : "bg-slate-400"}`} />
            <span>{botConnected ? "Connected" : "Not connected"}</span>
          </span>
        </div>

        <form onSubmit={handleConnect} className="space-y-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              key
            </span>
            <input
              type="text"
              value={zaloToken}
              onChange={(e) => setZaloToken(e.target.value)}
              placeholder="AABBCCDD:xxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
              disabled={loadingStore || connecting}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-slate-600">
              {botConnected ? (
                <span>
                  Bot ID: <span className="font-mono text-xs text-slate-500">{botId}</span>
                </span>
              ) : (
                <span>No bot connected yet.</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loadingStore || connecting || !zaloToken.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {connecting && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{connecting ? "Connecting..." : "Connect"}</span>
            </button>
          </div>

          {inlineError && <p className="text-sm text-red-600">{inlineError}</p>}
        </form>
      </section>

      {/* Stats Row */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Daily Sales Chart */}
        <div className="col-span-8 bg-white rounded-lg p-6 border border-slate-200">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-sm font-semibold text-on-surface mb-1">
                Daily Sales
              </h3>
              <p className="text-xs text-slate-400">
                Transaction volume per day
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-xs font-medium text-slate-400">
                This Week
              </span>
            </div>
          </div>
          {/* Bar Chart */}
          <div className="flex items-end justify-between h-48 gap-3 px-2">
            {[40, 65, 45, 90, 55, 70, 30].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t transition-colors ${i === 3 ? "bg-primary" : "bg-slate-100 hover:bg-slate-200"}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-3 text-[11px] font-medium text-slate-400 px-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Active Chats Card */}
        <div className="col-span-4 bg-white rounded-lg p-6 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="material-symbols-outlined text-primary text-xl">
                chat
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Chats
              </span>
            </div>
            <h4 className="text-3xl font-bold text-on-surface mb-1">14</h4>
            <p className="text-slate-500 text-sm">
              Customers waiting for reply
            </p>
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex -space-x-2 overflow-hidden">
              {["NL", "TH", "LA"].map((initials) => (
                <div
                  key={initials}
                  className="inline-flex h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 items-center justify-center text-[10px] font-semibold text-slate-600"
                >
                  {initials}
                </div>
              ))}
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-white bg-slate-200 text-[10px] font-semibold text-slate-600">
                +11
              </div>
            </div>
            <button className="w-full py-2 bg-primary text-on-primary rounded-lg font-medium text-sm flex items-center justify-center space-x-1 hover:bg-primary-container transition-colors">
              <span>Open Inbox</span>
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Inventory Health */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-lg p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold text-on-surface">
              Inventory Health
            </h3>
            <button className="text-slate-400 hover:text-slate-600">
              <span className="material-symbols-outlined text-xl">
                more_horiz
              </span>
            </button>
          </div>
          <div className="space-y-5">
            {[
              {
                icon: "devices",
                name: "Electronics",
                units: "1,240 SKU units",
                status: "Optimal",
                statusColor: "bg-emerald-50 text-emerald-700",
                percent: "88%",
              },
              {
                icon: "chair",
                name: "Home & Decor",
                units: "432 SKU units",
                status: "Low Stock",
                statusColor: "bg-red-50 text-red-700",
                percent: "32%",
              },
              {
                icon: "apparel",
                name: "Fashion",
                units: "890 SKU units",
                status: "Restocking",
                statusColor: "bg-amber-50 text-amber-700",
                percent: "65%",
              },
            ].map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500 border border-slate-100">
                    <span className="material-symbols-outlined text-xl">
                      {cat.icon}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-on-surface">{cat.name}</p>
                    <p className="text-xs text-slate-400">{cat.units}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 ${cat.statusColor} rounded text-[10px] font-semibold`}
                  >
                    {cat.status}
                  </span>
                  <p className="text-xs font-medium mt-1 text-slate-500">
                    {cat.percent}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Orders Table */}
        <div className="col-span-12 lg:col-span-7 bg-white rounded-lg border border-slate-200">
          <div className="flex justify-between items-center p-6 pb-4">
            <h3 className="text-sm font-semibold text-on-surface">New Orders</h3>
            <a className="text-primary text-xs font-medium flex items-center space-x-1 hover:underline cursor-pointer">
              <span>View All</span>
              <span className="material-symbols-outlined text-sm">
                open_in_new
              </span>
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-6 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  {
                    id: "#ORD-9921",
                    customer: "Le Minh Hoang",
                    product: "iPhone 15 Pro Max",
                    status: "Processing",
                    statusClass: "bg-blue-50 text-blue-700",
                    amount: "32.990.000₫",
                  },
                  {
                    id: "#ORD-9920",
                    customer: "Tran Thi An",
                    product: "Ergonomic Chair Pro",
                    status: "Processing",
                    statusClass: "bg-blue-50 text-blue-700",
                    amount: "4.500.000₫",
                  },
                  {
                    id: "#ORD-9919",
                    customer: "Nguyen Van Binh",
                    product: "MacBook Air M2",
                    status: "Delayed",
                    statusClass: "bg-red-50 text-red-700",
                    amount: "28.400.000₫",
                  },
                  {
                    id: "#ORD-9918",
                    customer: "Phan My Linh",
                    product: "Wireless Headphones",
                    status: "Shipped",
                    statusClass: "bg-emerald-50 text-emerald-700",
                    amount: "1.250.000₫",
                  },
                ].map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-3.5 font-mono text-xs text-primary font-medium">
                      {order.id}
                    </td>
                    <td className="py-3.5 text-sm text-on-surface">
                      {order.customer}
                    </td>
                    <td className="py-3.5 text-sm text-slate-500">
                      {order.product}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 ${order.statusClass} rounded text-[10px] font-semibold`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-6 text-right text-sm font-medium text-on-surface">
                      {order.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 flex justify-between items-center text-slate-400 text-xs">
        <p>&copy; 2024 CashR. All rights reserved.</p>
        <div className="flex space-x-6">
          <a className="hover:text-slate-600 cursor-pointer">System Status</a>
          <a className="hover:text-slate-600 cursor-pointer">Documentation</a>
          <a className="hover:text-slate-600 cursor-pointer">API Reference</a>
        </div>
      </footer>
    </>
  );
}
