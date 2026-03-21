"use client";

import { use, useEffect, useState, useMemo } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PER_PAGE = 20;

interface TxOrder {
  order_id: string;
  total_amount: number;
  payment_method: string;
  status: string;
  note: string;
  created_at: string;
}

interface Transaction {
  tx_id: string;
  order_id: string;
  from_account: string;
  amount: number;
  created_at: string;
  order: TxOrder | null;
  buyer_name: string | null;
  buyer_phone: string | null;
}

interface Pagination {
  page: number;
  per_page: number;
  total: number;
  pages: number;
}

function initials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
  };
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} className="border-b border-slate-50">
          {Array.from({ length: 6 }).map((_, j) => (
            <td key={j} className="px-5 py-3.5">
              <div className="h-4 bg-slate-100 rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function TransactionsPage({ params }: { params: Promise<{ store_id: string }> }) {
  const { store_id } = use(params);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, per_page: PER_PAGE, total: 0, pages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchTransactions = () => {
      const qs = new URLSearchParams({ page: String(page), per_page: String(PER_PAGE) });
      fetch(`${API_URL}/pay2s/store/${store_id}/transactions?${qs}`, {
        headers: { Authorization: token },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            setTransactions(data.transactions);
            setPagination(data.pagination);
          }
        })
        .finally(() => setLoading(false));
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 15_000);
    return () => clearInterval(interval);
  }, [store_id, page]);

  const filtered = useMemo(() => {
    if (!search.trim()) return transactions;
    const q = search.toLowerCase();
    return transactions.filter(
      (t) =>
        t.tx_id.toLowerCase().includes(q) ||
        (t.order_id ?? "").toLowerCase().includes(q) ||
        (t.buyer_name ?? "").toLowerCase().includes(q) ||
        (t.from_account ?? "").toLowerCase().includes(q)
    );
  }, [transactions, search]);

  const totalSettled = transactions.reduce((s, t) => s + t.amount, 0);

  return (
    <>
      {/* Summary */}
      <section className="grid grid-cols-12 gap-4 items-end mb-6">
        <div className="col-span-12 lg:col-span-7 bg-white rounded-lg p-6 border border-slate-200">
          <p className="text-xs text-slate-400 font-medium mb-1">Total Settled (This Page)</p>
          <h3 className="text-3xl font-bold text-on-surface mb-3">
            {loading
              ? <span className="inline-block h-8 w-48 bg-slate-100 rounded animate-pulse" />
              : <>{totalSettled.toLocaleString("vi-VN")} <span className="text-lg font-normal text-slate-400">VND</span></>
            }
          </h3>
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            {pagination.total} confirmed bank payments
          </span>
        </div>
        <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">This Page</p>
            <p className="text-xl font-bold text-on-surface">{transactions.length}</p>
            <p className="text-[10px] text-slate-400 mt-1">transactions</p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">All Time</p>
            <p className="text-xl font-bold text-emerald-600">{pagination.total}</p>
            <p className="text-[10px] text-slate-400 mt-1">total settled</p>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="bg-white p-4 rounded-lg flex items-center gap-3 mb-6 border border-slate-200">
        <div className="relative flex-grow max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 outline-none"
            placeholder="Search TX ID, order ID, customer, account..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* Table */}
      <section className="bg-white rounded-lg overflow-hidden border border-slate-200 mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">TX ID</th>
                <th className="px-5 py-3">Date & Time</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">From Account</th>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3 text-right">Amount (VND)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <SkeletonRows />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-sm">
                    {search ? `No results for "${search}"` : "No transactions yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  const { date, time } = formatDate(tx.created_at);
                  return (
                    <tr key={tx.tx_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs text-primary font-medium">{tx.tx_id}</td>
                      <td className="px-5 py-3.5">
                        <div className="text-sm font-medium">{date}</div>
                        <div className="text-[10px] text-slate-400">{time}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-500">
                            {initials(tx.buyer_name)}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{tx.buyer_name ?? "Unknown"}</div>
                            {tx.buyer_phone && <div className="text-[10px] text-slate-400">{tx.buyer_phone}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{tx.from_account || "—"}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{tx.order_id ?? "—"}</td>
                      <td className="px-5 py-3.5 text-right font-semibold text-sm text-emerald-600">
                        +{tx.amount.toLocaleString("vi-VN")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
          <div>Showing {filtered.length} of {pagination.total} transactions</div>
          {pagination.pages > 1 && (
            <div className="flex gap-1">
              <button
                className="px-2.5 py-1 border border-slate-200 rounded disabled:text-slate-300"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-2.5 py-1 rounded text-xs font-medium ${p === page ? "bg-primary text-white" : "border border-slate-200 hover:bg-slate-50"}`}
                >
                  {p}
                </button>
              ))}
              <button
                className="px-2.5 py-1 border border-slate-200 rounded disabled:text-slate-300"
                disabled={page === pagination.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Export */}
      <section className="flex justify-end gap-2">
        <button className="bg-white text-slate-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-slate-200 hover:bg-slate-50 transition-colors">
          <span className="material-symbols-outlined text-sm">print</span>
          Print PDF
        </button>
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary-container transition-colors">
          <span className="material-symbols-outlined text-sm">download</span>
          Export CSV
        </button>
      </section>
    </>
  );
}
