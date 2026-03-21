"use client";

import { useEffect, useState, use, useMemo } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const LOW_STOCK_THRESHOLD = 5;
const PER_PAGE = 20;

interface Item {
  item_id: string;
  item_name: string;
  item_icon: string;
  sku: string;
  price: number;
  stock: number;
  item_description: string;
}

function stockStatus(stock: number): { label: string; className: string } {
  if (stock === 0) return { label: "Out of Stock", className: "bg-red-50 text-red-700" };
  if (stock <= LOW_STOCK_THRESHOLD) return { label: "Low Stock", className: "bg-amber-50 text-amber-700" };
  return { label: "In Stock", className: "bg-emerald-50 text-emerald-700" };
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
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

export default function ProductsPage({ params }: { params: Promise<{ store_id: string }> }) {
  const { store_id } = use(params);
  const router = useRouter();

  const [allItems, setAllItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Debounce search — reset to page 1 on new query
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch all items once (backend returns full list)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    fetch(`${API_URL}/store/manage/${store_id}/items`, {
      headers: { Authorization: token },
    })
      .then((r) => r.json())
      .then((data) => { if (data.success) setAllItems(data.items); })
      .finally(() => setLoading(false));
  }, [store_id]);

  // Client-side filtering
  const filtered = useMemo(() => {
    if (!debouncedSearch) return allItems;
    const q = debouncedSearch.toLowerCase();
    return allItems.filter(
      (i) => i.item_name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q)
    );
  }, [allItems, debouncedSearch]);

  // Client-side pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Stats computed from full list (not filtered)
  const stats = useMemo(() => ({
    total_products: allItems.length,
    in_stock: allItems.filter((i) => i.stock > LOW_STOCK_THRESHOLD).length,
    low_stock: allItems.filter((i) => i.stock > 0 && i.stock <= LOW_STOCK_THRESHOLD).length,
    out_of_stock: allItems.filter((i) => i.stock === 0).length,
  }), [allItems]);

  const statCards = [
    { label: "Total Products", value: stats.total_products, icon: "inventory_2", color: "text-primary" },
    { label: "In Stock", value: stats.in_stock, icon: "check_circle", color: "text-emerald-600" },
    { label: "Low Stock", value: stats.low_stock, icon: "warning", color: "text-amber-600" },
    { label: "Out of Stock", value: stats.out_of_stock, icon: "error", color: "text-red-600" },
  ];

  return (
    <>
      {/* Header */}
      <section className="mb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
              Inventory Management
            </p>
            <h2 className="text-2xl font-bold text-on-surface">Products & Stock</h2>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm">
              <span className="material-symbols-outlined text-lg">filter_list</span>
              Filter
            </button>
            <button
              onClick={() => router.push(`/store/${store_id}/products/new`)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-container transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Add Product
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          {statCards.map((stat) => (
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

      {/* Search */}
      <section className="bg-white p-4 rounded-lg flex items-center gap-3 mb-6 border border-slate-200">
        <div className="relative flex-grow max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 placeholder:text-slate-400 outline-none"
            placeholder="Search product name, SKU..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* Product Table */}
      <section className="bg-white rounded-lg overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Price</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <SkeletonRows />
              ) : pageItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-sm">
                    {debouncedSearch ? `No products found for "${debouncedSearch}"` : "No products yet."}
                  </td>
                </tr>
              ) : (
                pageItems.map((item) => {
                  const status = stockStatus(item.stock);
                  return (
                    <tr key={item.item_id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                            <span className="material-symbols-outlined text-lg">{item.item_icon}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.item_name}</p>
                            <p className="text-[10px] text-slate-400">{item.item_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{item.sku}</td>
                      <td className="px-5 py-3.5 font-medium text-sm">{item.stock}</td>
                      <td className="px-5 py-3.5">
                        <span className={`${status.className} px-2 py-0.5 rounded text-[10px] font-semibold`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-medium text-sm text-on-surface">
                        {item.price.toLocaleString("vi-VN")}₫
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button className="text-slate-300 hover:text-slate-500 transition-colors">
                          <span className="material-symbols-outlined text-xl">more_vert</span>
                        </button>
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
          <div>
            Showing {pageItems.length} of {filtered.length} products
            {debouncedSearch && allItems.length !== filtered.length && ` (filtered from ${allItems.length})`}
          </div>
          {totalPages > 1 && (
            <div className="flex gap-1">
              <button
                className="px-2.5 py-1 border border-slate-200 rounded disabled:text-slate-300"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
                disabled={page === totalPages}
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
