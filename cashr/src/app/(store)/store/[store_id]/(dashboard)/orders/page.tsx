"use client";

import { use, useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Order {
  order_id: string;
  user: string;
  buyer_name: string | null;
  buyer_phone: string | null;
  total_amount: number;
  payment_method: string;
  status: "pending" | "paid" | "cancelled";
  note: string;
  created_at: string;
}

const STATUS_MAP = {
  paid:      { label: "Paid",      cls: "bg-emerald-50 text-emerald-700" },
  pending:   { label: "Pending",   cls: "bg-amber-50 text-amber-700" },
  cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-700" },
};

function initials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-slate-50">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-5 py-3.5">
              <div className="h-4 bg-slate-100 rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function OrdersPage({ params }: { params: Promise<{ store_id: string }> }) {
  const { store_id } = use(params);

  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchOrders = () => {
      fetch(`${API_URL}/pay2s/store/${store_id}/orders?per_page=100`, {
        headers: { Authorization: token },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            setOrders(data.orders);
            setTotal(data.pagination.total);
          }
        })
        .finally(() => setLoading(false));
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 15_000);
    return () => clearInterval(interval);
  }, [store_id]);

  const pending   = orders.filter((o) => o.status === "pending");
  const paid      = orders.filter((o) => o.status === "paid");
  const netRevenue = paid.reduce((s, o) => s + o.total_amount, 0);

  return (
    <>
      {/* Header */}
      <section className="mb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Executive Overview</p>
            <h2 className="text-2xl font-bold text-on-surface">Orders & Transactions</h2>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-container transition-colors text-sm">
            <span className="material-symbols-outlined text-lg">download</span>
            Export Report
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-5 rounded-lg bg-white border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/5 text-primary">
                <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
              </div>
              <p className="text-xs font-medium text-slate-500">Total Revenue</p>
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-1">
              {loading ? <span className="inline-block h-7 w-32 bg-slate-100 rounded animate-pulse" /> : `₫${netRevenue.toLocaleString("vi-VN")}`}
            </h3>
            <p className="text-xs text-slate-400">{paid.length} paid orders</p>
          </div>
          <div className="p-5 rounded-lg bg-white border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <span className="material-symbols-outlined text-xl">pending</span>
              </div>
              <p className="text-xs font-medium text-slate-500">Awaiting Payment</p>
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-1">
              {loading ? <span className="inline-block h-7 w-20 bg-slate-100 rounded animate-pulse" /> : pending.length}
            </h3>
            <p className="text-xs text-slate-400">
              ₫{loading ? "—" : pending.reduce((s, o) => s + o.total_amount, 0).toLocaleString("vi-VN")} outstanding
            </p>
          </div>
          <div className="p-5 rounded-lg bg-white border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-slate-50 text-slate-500">
                <span className="material-symbols-outlined text-xl">receipt_long</span>
              </div>
              <p className="text-xs font-medium text-slate-500">Total Orders</p>
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-1">
              {loading ? <span className="inline-block h-7 w-16 bg-slate-100 rounded animate-pulse" /> : total}
            </h3>
            <p className="text-xs text-slate-400">All time</p>
          </div>
        </div>
      </section>

      {/* Live / Pending Orders */}
      <div className="bg-white rounded-lg overflow-hidden border border-slate-200 mb-6">
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h4 className="text-sm font-semibold">Live Orders</h4>
            {!loading && (
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-semibold rounded">
                {pending.length} PENDING
              </span>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-100">
              <tr>
                {["Order ID", "Customer", "Date", "Amount", "Status"].map((h) => (
                  <th key={h} className={`px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider ${h === "Status" ? "text-right" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <SkeletonRows cols={5} />
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-400 text-sm">No orders yet.</td>
                </tr>
              ) : (
                orders.slice(0, 10).map((order) => {
                  const status = STATUS_MAP[order.status] ?? STATUS_MAP.pending;
                  return (
                    <tr key={order.order_id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                      <td className="px-5 py-3.5 font-mono text-xs text-primary font-medium">{order.order_id}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-500">
                            {initials(order.buyer_name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{order.buyer_name ?? "Unknown"}</p>
                            {order.buyer_phone && <p className="text-[10px] text-slate-400">{order.buyer_phone}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">{formatDate(order.created_at)}</td>
                      <td className="px-5 py-3.5 text-sm font-medium">₫{order.total_amount.toLocaleString("vi-VN")}</td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${status.cls} text-[10px] font-semibold`}>
                          <span className="w-1 h-1 rounded-full bg-current" />
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">Showing {Math.min(orders.length, 10)} of {total} orders</p>
        </div>
      </div>
    </>
  );
}
