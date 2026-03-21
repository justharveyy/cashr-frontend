"use client";

import { useEffect, useState, use, useMemo, useRef } from "react";
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
  const [busyItemId, setBusyItemId] = useState<string | null>(null);

  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editSku, setEditSku] = useState("");
  const [editStock, setEditStock] = useState(0);
  const [editDescription, setEditDescription] = useState("");
  const [editIconFile, setEditIconFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const editFileRef = useRef<HTMLInputElement>(null);

  const fetchItems = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    fetch(`${API_URL}/store/manage/${store_id}/items`, {
      headers: { Authorization: token },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setAllItems(data.items);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store_id]);

  const filtered = useMemo(() => {
    if (!debouncedSearch) return allItems;
    const q = debouncedSearch.toLowerCase();
    return allItems.filter((i) => i.item_name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
  }, [allItems, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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

  const openEditModal = (item: Item) => {
    setEditingItem(item);
    setEditName(item.item_name);
    setEditPrice(item.price);
    setEditSku(item.sku || "");
    setEditStock(item.stock);
    setEditDescription(item.item_description || "");
    setEditIconFile(null);
    setEditPreview(item.item_icon || null);
    setEditError(null);
  };

  const closeEditModal = () => {
    setEditingItem(null);
    setEditIconFile(null);
    setEditPreview(null);
    setEditError(null);
  };

  const handleEditImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditIconFile(file);
    setEditPreview(URL.createObjectURL(file));
  };

  const saveEdit = async () => {
    if (!editingItem) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!editName.trim() || !editDescription.trim()) {
      setEditError("Item name and description are required.");
      return;
    }

    setSavingEdit(true);
    setEditError(null);

    const formData = new FormData();
    formData.append("item_name", editName.trim());
    formData.append("price", String(Math.max(0, editPrice)));
    formData.append("sku", editSku);
    formData.append("stock", String(Math.max(0, Math.floor(editStock))));
    formData.append("item_description", editDescription.trim());
    if (editIconFile) formData.append("icon", editIconFile);

    try {
      const res = await fetch(`${API_URL}/store/manage/${store_id}/items/${editingItem.item_id}/edit`, {
        method: "PATCH",
        headers: { Authorization: token },
        body: formData,
      });
      const data = await res.json();
      if (!data.success) {
        setEditError(data.message || "Failed to update product.");
        return;
      }
      closeEditModal();
      fetchItems();
    } catch {
      setEditError("Failed to update product.");
    } finally {
      setSavingEdit(false);
    }
  };

  const deleteItem = async (item: Item) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const ok = window.confirm(`Delete '${item.item_name}'? This action cannot be undone.`);
    if (!ok) return;

    setBusyItemId(item.item_id);
    try {
      const res = await fetch(`${API_URL}/store/manage/${store_id}/items/${item.item_id}/delete`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (!data.success) return;
      fetchItems();
    } finally {
      setBusyItemId(null);
    }
  };

  return (
    <>
      <section className="mb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Inventory Management</p>
            <h2 className="text-2xl font-bold text-on-surface">Products & Stock</h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/store/${store_id}/products/new`)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-container transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Add Product
            </button>
          </div>
        </div>

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
                <th className="px-5 py-3 text-right">Actions</th>
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
                  const iconIsUrl = item.item_icon?.startsWith("http");
                  return (
                    <tr key={item.item_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                            {iconIsUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={item.item_icon} alt={item.item_name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="material-symbols-outlined text-lg text-slate-500">inventory_2</span>
                            )}
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
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteItem(item)}
                            disabled={busyItemId === item.item_id}
                            className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 disabled:opacity-50"
                          >
                            {busyItemId === item.item_id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

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

      {editingItem && (
        <div className="fixed inset-0 z-[80] bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={closeEditModal} className="text-primary active:scale-95 transition-transform">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <div>
                <h3 className="font-bold text-2xl tracking-tight text-on-surface">Edit Inventory Entry</h3>
                <p className="text-sm text-on-surface-variant mt-0.5">
                  Update product details with the same form style as Add Product.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="bg-white p-6 rounded-xl shadow-[0_24px_24px_-4px_rgba(25,28,30,0.06)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none" />
                <input ref={editFileRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleEditImage} />
                <div
                  onClick={() => editFileRef.current?.click()}
                  className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg py-12 px-4 bg-slate-50/50 hover:bg-slate-100/50 transition-colors cursor-pointer overflow-hidden"
                >
                  {editPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={editPreview} alt="Preview" className="max-h-48 object-contain rounded-lg" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-primary mb-3 text-4xl">add_a_photo</span>
                      <span className="font-bold text-primary text-sm">Upload Item Image</span>
                      <span className="text-on-surface-variant text-[11px] mt-1">Supports JPG, PNG (Max 5MB)</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-7">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-on-surface uppercase tracking-wider text-[11px]">Item Name</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3.5 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/30 transition-all outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-on-surface uppercase tracking-wider text-[11px]">Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary text-sm">₫</span>
                      <input
                        type="number"
                        min="0"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Math.max(0, Number(e.target.value) || 0))}
                        className="w-full bg-surface-container-low border-none rounded-lg pl-9 pr-4 py-3.5 text-on-surface placeholder:text-outline font-bold text-lg focus:ring-2 focus:ring-primary/30 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-on-surface uppercase tracking-wider text-[11px]">SKU</label>
                    <input
                      value={editSku}
                      onChange={(e) => setEditSku(e.target.value)}
                      className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3.5 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/30 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-bold text-on-surface uppercase tracking-wider text-[11px]">Stock Level</label>
                  <div className="flex items-center bg-surface-container-low rounded-lg w-fit">
                    <button type="button" onClick={() => setEditStock((s) => Math.max(0, s - 1))} className="px-5 py-3.5 text-primary active:scale-90 transition-transform">
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={editStock}
                      onChange={(e) => setEditStock(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
                      className="w-20 text-center font-bold text-xl text-on-surface bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button type="button" onClick={() => setEditStock((s) => s + 1)} className="px-5 py-3.5 text-primary active:scale-90 transition-transform">
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-bold text-on-surface uppercase tracking-wider text-[11px]">Item Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3.5 text-on-surface placeholder:text-outline leading-relaxed focus:ring-2 focus:ring-primary/30 transition-all resize-none outline-none"
                  />
                </div>

                {editError && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg text-sm">
                    <span className="material-symbols-outlined text-base">error</span>
                    {editError}
                  </div>
                )}

                <div className="flex gap-2">
                  <button onClick={closeEditModal} className="w-1/3 py-4 rounded-lg font-bold text-base border border-slate-200">
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    disabled={savingEdit}
                    className="w-2/3 bg-primary text-white py-4 rounded-lg font-bold text-base shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {savingEdit ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
