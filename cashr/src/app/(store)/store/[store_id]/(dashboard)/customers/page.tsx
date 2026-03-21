"use client";

import { use, useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PER_PAGE = 20;

interface CustomerItem {
  customer_id: string;
  user_id: string;
  fullname: string | null;
  avatar: string | null;
  phone_number: string | null;
  email: string | null;
  is_blocked: boolean;
  created_at: string | null;
  last_session_id: string | null;
  last_message: string | null;
  last_message_at: string | null;
}

interface Pagination {
  page: number;
  per_page: number;
  total: number;
  pages: number;
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

function formatDate(iso: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} className="border-b border-slate-50">
          {Array.from({ length: 6 }).map((__, j) => (
            <td key={j} className="px-5 py-3.5">
              <div className="h-4 bg-slate-100 rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function CustomersPage({ params }: { params: Promise<{ store_id: string }> }) {
  const { store_id } = use(params);

  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    per_page: PER_PAGE,
    total: 0,
    pages: 1,
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const qs = new URLSearchParams({
      page: String(page),
      per_page: String(PER_PAGE),
    });

    if (debouncedSearch) {
      qs.set("q", debouncedSearch);
    }

    fetch(`${API_URL}/store/manage/${store_id}/customers?${qs.toString()}`, {
      headers: { Authorization: token },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setCustomers(data.items ?? []);
          setPagination(data.pagination ?? { page: 1, per_page: PER_PAGE, total: 0, pages: 1 });
        }
      })
      .finally(() => setLoading(false));
  }, [store_id, page, debouncedSearch]);

  const stats = useMemo(() => {
    const blocked = customers.filter((c) => c.is_blocked).length;
    const withConversation = customers.filter((c) => !!c.last_message).length;
    return {
      pageTotal: customers.length,
      blocked,
      activeChats: withConversation,
      allTotal: pagination.total,
    };
  }, [customers, pagination.total]);

  return (
    <>
      <section className="mb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Customer Relationship</p>
            <h2 className="text-2xl font-bold text-on-surface">Customers</h2>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Customers", value: stats.allTotal, icon: "group", color: "text-primary" },
            { label: "On This Page", value: stats.pageTotal, icon: "view_list", color: "text-blue-600" },
            { label: "Blocked", value: stats.blocked, icon: "block", color: "text-red-600" },
            { label: "Has Conversation", value: stats.activeChats, icon: "chat", color: "text-emerald-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-5 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <span className={`material-symbols-outlined ${stat.color} text-xl`}>{stat.icon}</span>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-4 rounded-lg flex items-center gap-3 mb-6 border border-slate-200">
        <div className="relative flex-grow max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 placeholder:text-slate-400 outline-none"
            placeholder="Search customer name, phone, user id..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <section className="bg-white rounded-lg overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Last Message</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">User ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <SkeletonRows />
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-sm">
                    {debouncedSearch ? `No customers found for "${debouncedSearch}"` : "No customers found."}
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.customer_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-500">
                          {initials(c.fullname)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{c.fullname || "Unknown"}</p>
                          <p className="text-[10px] text-slate-400">{c.email || "No email"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{c.phone_number || "-"}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          c.is_blocked ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {c.is_blocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 max-w-[300px] truncate" title={c.last_message || ""}>
                      {c.last_message || "No messages"}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{formatDate(c.created_at)}</td>
                    <td className="px-5 py-3.5 text-xs font-mono text-slate-500">{c.user_id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
          <div>
            Showing {customers.length} of {pagination.total} customers
          </div>
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
                  className={`px-2.5 py-1 rounded text-xs font-medium ${
                    p === page ? "bg-primary text-white" : "border border-slate-200 hover:bg-slate-50"
                  }`}
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
    </>
  );
}
