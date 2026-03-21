"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(
  "://localhost",
  "://127.0.0.1"
);

interface StoreDetails {
  store_id: string;
  store_name: string;
  zalo_bot_id: string;
  zalo_bot_token: string;
  bank?: string;
  bank_account_number?: string;
}

interface VietQrBank {
  bin: string;
  code: string;
  shortName: string;
  name: string;
}

type ToastType = "success" | "error";

interface ToastState {
  message: string;
  type: ToastType;
}

interface AnalyticsDailySalesItem {
  date: string;
  day: string;
  total: number;
}

interface AnalyticsInventoryItem {
  item_id: string;
  item_name: string;
  pct: number;
  status: string;
  stock: number;
}

interface AnalyticsOrderItem {
  order_id: string;
  customer: string;
  product: string;
  status: string;
  amount: number;
  created_at: string;
}

interface AnalyticsPayload {
  store_id: string;
  store_name: string;
  weekly_growth_pct: number | null;
  daily_sales: AnalyticsDailySalesItem[];
  active_chats: {
    waiting_for_reply: number;
    flagged_for_attention: number;
    recent_customer_initials: string[];
  };
  inventory_health: AnalyticsInventoryItem[];
  new_orders: AnalyticsOrderItem[];
}

export default function DashboardPage({ params }: { params: Promise<{ store_id: string }> }) {
  const { store_id } = use(params);
  const router = useRouter();

  const [storeName, setStoreName] = useState("Your Store");
  const [zaloToken, setZaloToken] = useState("");
  const [botId, setBotId] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankOptions, setBankOptions] = useState<VietQrBank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [loadingStore, setLoadingStore] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
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
      setBankCode(store.bank || "");
      setBankAccountNumber(store.bank_account_number || "");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load store settings.";
      setInlineError(message);
    } finally {
      setLoadingStore(false);
    }
  }, [store_id]);

  const fetchAnalytics = useCallback(async () => {
    const token = localStorage.getItem("token") || "";
    if (!token) return;

    setLoadingAnalytics(true);
    setAnalyticsError(null);
    try {
      const res = await fetch(`${API_URL}/analytics/store/${store_id}`, {
        headers: { Authorization: token },
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to load analytics.");
      }

      const payload = (data?.store_id ? data : data?.data) as AnalyticsPayload | undefined;
      if (!payload || !payload.store_id) {
        throw new Error("Analytics payload is invalid.");
      }

      setAnalytics(payload);
      if (payload.store_name) {
        setStoreName(payload.store_name);
      }
    } catch (err) {
      setAnalytics(null);
      const message = err instanceof Error ? err.message : "Failed to load analytics.";
      setAnalyticsError(message);
    } finally {
      setLoadingAnalytics(false);
    }
  }, [store_id]);

  useEffect(() => {
    fetchStoreDetails();
    fetchAnalytics();
  }, [fetchStoreDetails, fetchAnalytics]);

  useEffect(() => {
    let cancelled = false;
    const fetchBanks = async () => {
      setLoadingBanks(true);
      try {
        const res = await fetch("https://api.vietqr.io/v2/banks");
        const data = await res.json();
        if (cancelled) return;
        const rows = Array.isArray(data?.data) ? data.data : [];
        const normalized: VietQrBank[] = rows
          .map((b: any) => ({
            bin: String(b?.bin || ""),
            code: String(b?.code || ""),
            shortName: String(b?.shortName || b?.short_name || ""),
            name: String(b?.name || ""),
          }))
          .filter((b: VietQrBank) => b.bin && (b.shortName || b.name));
        setBankOptions(normalized);
      } catch {
        if (!cancelled) {
          setBankOptions([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingBanks(false);
        }
      }
    };
    fetchBanks();
    return () => {
      cancelled = true;
    };
  }, []);

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

  const handleSavePaymentQR = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || "";
    const cleanedAccountNumber = bankAccountNumber.replace(/\s+/g, "");
    const cleanedBankCode = bankCode.trim();

    if (!token) {
      const message = "Missing auth token. Please log in again.";
      setPaymentError(message);
      showToast("error", message);
      return;
    }

    if (!cleanedBankCode || !cleanedAccountNumber) {
      const message = "Bank and account number are required.";
      setPaymentError(message);
      showToast("error", message);
      return;
    }

    setSavingPayment(true);
    setPaymentError(null);

    try {
      const res = await fetch(`${API_URL}/store/manage/${store_id}/payment-qr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          bank: cleanedBankCode,
          bank_account_number: cleanedAccountNumber,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save payment QR settings.");
      }

      setBankCode(data.payment_qr?.bank || cleanedBankCode);
      setBankAccountNumber(data.payment_qr?.bank_account_number || cleanedAccountNumber);
      showToast("success", "Payment QR settings saved.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save payment QR settings.";
      setPaymentError(message);
      showToast("error", message);
    } finally {
      setSavingPayment(false);
    }
  };

  const botConnected = !!botId;
  const paymentQrConfigured = !!bankCode && !!bankAccountNumber;
  const growth = analytics?.weekly_growth_pct ?? null;
  const dailySales = analytics?.daily_sales || [];
  const maxDaily = Math.max(...dailySales.map((d) => d.total), 0);

  const orderStatusClass = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === "paid" || normalized === "shipped") return "bg-emerald-50 text-emerald-700";
    if (normalized === "pending" || normalized === "processing") return "bg-blue-50 text-blue-700";
    if (normalized === "cancelled" || normalized === "delayed") return "bg-red-50 text-red-700";
    return "bg-slate-100 text-slate-700";
  };

  const formatMoney = (value: number) => `${Math.round(value).toLocaleString("vi-VN")}₫`;

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
          Weekly growth:{" "}
          <span className={`font-medium ${growth !== null && growth >= 0 ? "text-emerald-600" : "text-slate-600"}`}>
            {growth === null ? "N/A" : `${growth.toFixed(1)}%`}
          </span>
        </p>
        {analyticsError && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <span className="material-symbols-outlined text-sm">warning</span>
            <span>{analyticsError}</span>
            <button
              onClick={fetchAnalytics}
              className="ml-1 font-semibold underline underline-offset-2 hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Daily Sales Chart */}
        <div className="col-span-12 xl:col-span-8 relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="absolute -top-10 -right-8 w-32 h-32 rounded-full bg-blue-100/40 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-8 w-32 h-32 rounded-full bg-sky-100/40 blur-2xl pointer-events-none" />
          <div className="relative flex justify-between items-start mb-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-1">
                Daily Sales
              </h3>
              <p className="text-xs text-slate-500">
                Transaction volume per day
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200/70">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-slate-500">
                This Week
              </span>
            </div>
          </div>
          {/* Bar Chart */}
          <div className="relative h-48">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3].map((line) => (
                <div key={line} className="border-t border-dashed border-slate-200/80" />
              ))}
            </div>
            <div className="relative flex items-end justify-between h-48 gap-3 px-2">
            {loadingAnalytics ? (
              <div className="text-sm text-slate-400">Loading chart...</div>
            ) : dailySales.length === 0 ? (
              <div className="text-sm text-slate-400">No sales data.</div>
            ) : (
              dailySales.map((entry) => {
                const pct = maxDaily > 0 ? Math.max(8, Math.round((entry.total / maxDaily) * 100)) : 8;
                const active = entry.total === maxDaily && maxDaily > 0;
                const shareOfPeak = maxDaily > 0 ? Math.round((entry.total / maxDaily) * 100) : 0;
                return (
                  <div
                    key={entry.date}
                    className="flex-1 group relative h-full flex items-end"
                  >
                    <div
                      className={`w-full rounded-t-xl transition-all duration-200 group-hover:-translate-y-1 ${
                        active
                          ? "bg-gradient-to-t from-primary to-blue-400 shadow-[0_8px_20px_rgba(59,130,246,0.35)]"
                          : "bg-gradient-to-t from-slate-300 to-slate-100 group-hover:from-slate-400 group-hover:to-slate-200"
                      }`}
                      style={{ height: `${pct}%` }}
                    />
                    <div className="pointer-events-none absolute -top-28 left-1/2 z-20 w-44 -translate-x-1/2 rounded-lg bg-slate-900/95 px-3 py-2 text-white opacity-0 shadow-xl transition-all duration-150 group-hover:opacity-100 group-hover:-translate-y-1">
                      <p className="text-[10px] uppercase tracking-wide text-slate-300">{entry.day}</p>
                      <p className="text-[11px] font-medium">{entry.date}</p>
                      <p className="mt-1 text-sm font-semibold">{formatMoney(entry.total)}</p>
                      <p className="text-[10px] text-slate-300">Peak share: {shareOfPeak}%</p>
                      {active && <p className="text-[10px] text-emerald-300 mt-0.5">Highest day this week</p>}
                      <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900/95" />
                    </div>
                  </div>
                );
              })
            )}
            </div>
          </div>
          <div className="flex justify-between mt-3 text-[11px] font-semibold text-slate-500 px-2">
            {(dailySales.length > 0 ? dailySales : []).map((entry) => (
              <span key={entry.date}>{entry.day}</span>
            ))}
          </div>
        </div>

        {/* Active Chats Card */}
        <div className="col-span-12 xl:col-span-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 flex flex-col justify-between text-white shadow-sm">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="material-symbols-outlined text-sky-300 text-xl">
                chat
              </span>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Active Chats
              </span>
            </div>
            <h4 className="text-4xl font-bold mb-1">
              {analytics?.active_chats.waiting_for_reply ?? 0}
            </h4>
            <p className="text-slate-300 text-sm">
              Customers waiting for reply · {analytics?.active_chats.flagged_for_attention ?? 0} flagged
            </p>
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex -space-x-2 overflow-hidden">
              {(analytics?.active_chats.recent_customer_initials || []).slice(0, 3).map((initials, index) => (
                <div
                  key={`${initials}-${index}`}
                  className="inline-flex h-8 w-8 rounded-full ring-2 ring-slate-800 bg-white/90 items-center justify-center text-[10px] font-semibold text-slate-700"
                >
                  {initials}
                </div>
              ))}
              {(analytics?.active_chats.recent_customer_initials || []).length > 3 && (
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-slate-800 bg-slate-600 text-[10px] font-semibold text-white">
                  +{(analytics?.active_chats.recent_customer_initials || []).length - 3}
                </div>
              )}
            </div>
            <button
              onClick={() => router.push(`/store/${store_id}/messages`)}
              className="w-full py-2.5 bg-white text-slate-900 rounded-xl font-semibold text-sm flex items-center justify-center space-x-1 hover:bg-slate-100 transition-colors"
            >
              <span>Open Inbox</span>
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-12 gap-6 mb-6">
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
            {(analytics?.inventory_health || []).map((item) => (
              <div key={item.item_id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500 border border-slate-100">
                    <span className="material-symbols-outlined text-xl">
                      inventory_2
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-on-surface">{item.item_name}</p>
                    <p className="text-xs text-slate-400">{item.stock} units left</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.status.toLowerCase() === "optimal"
                        ? "bg-emerald-50 text-emerald-700"
                        : item.status.toLowerCase() === "restocking"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                  <p className="text-xs font-medium mt-1 text-slate-500">
                    {item.pct}%
                  </p>
                </div>
              </div>
            ))}
            {(analytics?.inventory_health || []).length === 0 && (
              <p className="text-sm text-slate-400">No inventory health data.</p>
            )}
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
                {(analytics?.new_orders || []).map((order) => (
                  <tr
                    key={order.order_id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-3.5 font-mono text-xs text-primary font-medium">
                      {order.order_id}
                    </td>
                    <td className="py-3.5 text-sm text-on-surface">
                      {order.customer}
                    </td>
                    <td className="py-3.5 text-sm text-slate-500">
                      {order.product || "-"}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${orderStatusClass(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-6 text-right text-sm font-medium text-on-surface">
                      {formatMoney(order.amount)}
                    </td>
                  </tr>
                ))}
                {(analytics?.new_orders || []).length === 0 && (
                  <tr>
                    <td className="px-6 py-4 text-sm text-slate-400" colSpan={5}>
                      No recent orders.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium hover:bg-primary-container transition-colors ${(loadingStore || connecting || !zaloToken.trim()) ? "opacity-50 cursor-not-allowed" : ""}`}
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

      {/* Payment QR Configuration */}
      <section className="mb-6 bg-white rounded-lg p-6 border border-slate-200">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-on-surface">Payment QR Configuration</h3>
            <p className="text-sm text-slate-500 mt-1">
              Configure bank destination for VietQR. Customers will pay to this account.
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
              paymentQrConfigured ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${paymentQrConfigured ? "bg-emerald-500" : "bg-amber-500"}`} />
            <span>{paymentQrConfigured ? "Configured" : "Required"}</span>
          </span>
        </div>

        <form onSubmit={handleSavePaymentQR} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                account_balance
              </span>
              <select
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 appearance-none"
              >
                <option value="">{loadingBanks ? "Loading banks..." : "Select bank from VietQR"}</option>
                {bankOptions.map((bank) => (
                  <option key={bank.bin} value={bank.bin}>
                    {bank.shortName || bank.name} ({bank.bin})
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                credit_card
              </span>
              <input
                type="text"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                placeholder="0904..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
              />
            </div>

          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">Bank list is loaded from VietQR.</p>

            <button
              type="submit"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium hover:bg-primary-container transition-colors ${(loadingStore || savingPayment || !bankCode.trim() || !bankAccountNumber.trim()) ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {savingPayment && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{savingPayment ? "Saving..." : "Save Payment QR"}</span>
            </button>
          </div>

          {paymentError && <p className="text-sm text-red-600">{paymentError}</p>}
        </form>
      </section>


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
