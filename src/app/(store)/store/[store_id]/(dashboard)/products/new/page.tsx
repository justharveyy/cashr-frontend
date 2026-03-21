"use client";

import { use, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function NewItemPage({ params }: { params: Promise<{ store_id: string }> }) {
  const { store_id } = use(params);
  const router = useRouter();

  const [preview, setPreview] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [stock, setStock] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const item_name = (form.elements.namedItem("item_name") as HTMLInputElement).value.trim();
    const price = (form.elements.namedItem("price") as HTMLInputElement).value;
    const sku = (form.elements.namedItem("sku") as HTMLInputElement).value.trim();
    const item_description = (form.elements.namedItem("item_description") as HTMLTextAreaElement).value.trim();

    if (!item_name || !item_description) {
      setError("Item name and description are required.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) { setError("Not authenticated."); return; }

    const formData = new FormData();
    formData.append("item_name", item_name);
    formData.append("price", price || "0");
    formData.append("sku", sku);
    formData.append("stock", String(stock));
    formData.append("item_description", item_description);
    if (iconFile) formData.append("icon", iconFile);

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/store/manage/${store_id}/items/add`, {
        method: "POST",
        headers: { Authorization: token },
        body: formData,
      });
      const data = await res.json();
      if (!data.success) { setError(data.message || "Failed to add item."); return; }
      router.push(`/store/${store_id}/products`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="text-primary active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="font-bold text-2xl tracking-tight text-on-surface">New Inventory Entry</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Fill in the details to add a new product to your store.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Image Upload */}
        <div className="bg-white p-6 rounded-xl shadow-[0_24px_24px_-4px_rgba(25,28,30,0.06)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleImageChange}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg py-12 px-4 bg-slate-50/50 hover:bg-slate-100/50 transition-colors cursor-pointer overflow-hidden"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Preview" className="max-h-48 object-contain rounded-lg" />
            ) : (
              <>
                <span className="material-symbols-outlined text-primary mb-3 text-4xl">add_a_photo</span>
                <span className="font-bold text-primary text-sm">Upload Item Image</span>
                <span className="text-on-surface-variant text-[11px] mt-1">Supports JPG, PNG (Max 5MB)</span>
              </>
            )}
          </div>
          {preview && (
            <button
              type="button"
              onClick={() => { setPreview(null); setIconFile(null); }}
              className="mt-3 text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 mx-auto"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              Remove image
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          {/* Item Name */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-on-surface uppercase tracking-wider text-[11px]" htmlFor="item_name">
              Item Name
            </label>
            <input
              id="item_name"
              name="item_name"
              type="text"
              placeholder="e.g. Arabica Dark Roast"
              required
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3.5 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/30 transition-all outline-none"
            />
          </div>

          {/* Price + SKU */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-on-surface uppercase tracking-wider text-[11px]" htmlFor="price">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary text-sm">₫</span>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  placeholder="0"
                  className="w-full bg-surface-container-low border-none rounded-lg pl-9 pr-4 py-3.5 text-on-surface placeholder:text-outline font-bold text-lg focus:ring-2 focus:ring-primary/30 transition-all outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-on-surface uppercase tracking-wider text-[11px]" htmlFor="sku">
                SKU
              </label>
              <input
                id="sku"
                name="sku"
                type="text"
                placeholder="INV-001"
                className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3.5 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/30 transition-all outline-none"
              />
            </div>
          </div>

          {/* Stock Stepper */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-on-surface uppercase tracking-wider text-[11px]">
              Stock Level
            </label>
            <div className="flex items-center bg-surface-container-low rounded-lg w-fit">
              <button
                type="button"
                onClick={() => setStock((s) => Math.max(0, s - 1))}
                className="px-5 py-3.5 text-primary active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined">remove</span>
              </button>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === "") {
                    setStock(0);
                    return;
                  }
                  const next = Number(raw);
                  if (!Number.isFinite(next)) return;
                  setStock(Math.max(0, Math.floor(next)));
                }}
                className="w-20 text-center font-bold text-xl text-on-surface bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                aria-label="Stock"
              />
              <button
                type="button"
                onClick={() => setStock((s) => s + 1)}
                className="px-5 py-3.5 text-primary active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-on-surface uppercase tracking-wider text-[11px]" htmlFor="item_description">
              Item Description
            </label>
            <textarea
              id="item_description"
              name="item_description"
              placeholder="Describe your product's key features, dimensions, or usage..."
              rows={4}
              required
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3.5 text-on-surface placeholder:text-outline leading-relaxed focus:ring-2 focus:ring-primary/30 transition-all resize-none outline-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg text-sm">
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-white py-4 rounded-lg font-bold text-base shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                Adding Item...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">check_circle</span>
                Add Item
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
