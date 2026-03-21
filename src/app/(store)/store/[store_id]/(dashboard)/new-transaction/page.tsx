"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CustomerItem {
  customer_id: string;
  user_id: string;
  fullname: string | null;
  phone_number: string | null;
  email: string | null;
}

interface Item {
  item_id: string;
  item_name: string;
  item_icon: string;
  price: number;
  stock: number;
  sku: string;
}

interface CartLine {
  item: Item;
  quantity: number;
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

export default function NewTransactionPage({ params }: { params: Promise<{ store_id: string }> }) {
  const { store_id } = use(params);
  const searchParams = useSearchParams();
  const preselectedCustomerId = searchParams.get("customer_id") || "";

  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [cart, setCart] = useState<Record<string, CartLine>>({});
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.user_id === selectedCustomerId) || null,
    [customers, selectedCustomerId]
  );

  const filteredCustomers = useMemo(() => {
    const q = customerSearch.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => {
      const name = (c.fullname || "").toLowerCase();
      const phone = (c.phone_number || "").toLowerCase();
      const email = (c.email || "").toLowerCase();
      return name.includes(q) || phone.includes(q) || email.includes(q) || c.user_id.toLowerCase().includes(q);
    });
  }, [customers, customerSearch]);

  const filteredItems = useMemo(() => {
    const q = itemSearch.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.item_name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
  }, [items, itemSearch]);

  const cartLines = useMemo(() => Object.values(cart), [cart]);
  const subtotal = useMemo(
    () => cartLines.reduce((sum, line) => sum + line.item.price * line.quantity, 0),
    [cartLines]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/store/manage/${store_id}/customers?page=1&per_page=100`, {
        headers: { Authorization: token },
      }).then((r) => r.json()),
      fetch(`${API_URL}/store/manage/${store_id}/items`, {
        headers: { Authorization: token },
      }).then((r) => r.json()),
    ])
      .then(([customersRes, itemsRes]) => {
        const customerRows: CustomerItem[] = customersRes.success ? customersRes.items || [] : [];
        const itemRows: Item[] = itemsRes.success ? itemsRes.items || [] : [];

        setCustomers(customerRows);
        setItems(itemRows);

        if (preselectedCustomerId && customerRows.some((c) => c.user_id === preselectedCustomerId)) {
          setSelectedCustomerId(preselectedCustomerId);
        } else if (customerRows.length > 0) {
          setSelectedCustomerId(customerRows[0].user_id);
        }
      })
      .finally(() => setLoading(false));
  }, [store_id, preselectedCustomerId]);

  const addItem = (item: Item) => {
    setCart((prev) => {
      const existing = prev[item.item_id];
      const currentQty = existing?.quantity || 0;
      if (item.stock !== -1 && currentQty + 1 > item.stock) return prev;
      return {
        ...prev,
        [item.item_id]: {
          item,
          quantity: currentQty + 1,
        },
      };
    });
  };

  const increaseQty = (itemId: string) => {
    setCart((prev) => {
      const line = prev[itemId];
      if (!line) return prev;
      if (line.item.stock !== -1 && line.quantity + 1 > line.item.stock) return prev;
      return {
        ...prev,
        [itemId]: { ...line, quantity: line.quantity + 1 },
      };
    });
  };

  const decreaseQty = (itemId: string) => {
    setCart((prev) => {
      const line = prev[itemId];
      if (!line) return prev;
      if (line.quantity <= 1) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [itemId]: { ...line, quantity: line.quantity - 1 },
      };
    });
  };

  const removeLine = (itemId: string) => {
    setCart((prev) => {
      const { [itemId]: _, ...rest } = prev;
      return rest;
    });
  };

  const createOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedCustomerId || subtotal <= 0 || submitting) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const lineSummary = cartLines
      .map((line) => `${line.item.item_name} x${line.quantity}`)
      .join(", ");

    const composedNote = [
      note.trim(),
      lineSummary ? `Items: ${lineSummary}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch(`${API_URL}/pay2s/store/${store_id}/customers/${selectedCustomerId}/manual-order`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: subtotal,
          note: composedNote,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Failed to create order.");
        return;
      }

      setSuccess(`Created pending order ${data.order.order_id}.`);
      setCart({});
      setNote("");
    } catch {
      setError("Failed to create order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-on-surface mb-1">Create Order</h1>
          <p className="text-sm text-slate-500">Create a new pending order for a chat customer.</p>
        </div>
        {preselectedCustomerId && (
          <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold">
            Preselected from chat
          </span>
        )}
      </header>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <section className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-semibold">1</span>
              <h2 className="text-base font-semibold">Customer Information</h2>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
              <input
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                placeholder="Search customer name, email or phone..."
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {loading ? (
                <div className="text-sm text-slate-400">Loading customers...</div>
              ) : filteredCustomers.length === 0 ? (
                <div className="text-sm text-slate-400">No customers found.</div>
              ) : (
                filteredCustomers.map((customer) => {
                  const selected = customer.user_id === selectedCustomerId;
                  return (
                    <button
                      key={customer.customer_id}
                      onClick={() => setSelectedCustomerId(customer.user_id)}
                      className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors border ${
                        selected
                          ? "border-primary bg-blue-50/30"
                          : "border-slate-200 bg-slate-50 hover:border-primary/30"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-sm text-slate-600">
                        {initials(customer.fullname)}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-on-surface">{customer.fullname || "Unknown"}</p>
                        <p className="text-xs text-slate-400">{customer.phone_number || customer.user_id}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-semibold">2</span>
              <h2 className="text-base font-semibold">Product Selection</h2>
            </div>

            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
              <input
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                placeholder="Search product name, SKU..."
                type="text"
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
              {loading ? (
                <div className="text-sm text-slate-400">Loading products...</div>
              ) : filteredItems.length === 0 ? (
                <div className="text-sm text-slate-400">No products found.</div>
              ) : (
                filteredItems.map((item) => (
                  <div key={item.item_id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-medium text-sm">{item.item_name}</h3>
                        <p className="text-xs text-slate-400">SKU: {item.sku || "-"}</p>
                        <p className="text-sm font-semibold text-primary mt-1">{item.price.toLocaleString("vi-VN")}₫</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Stock left: {item.stock === -1 ? "Unlimited" : item.stock}
                        </p>
                      </div>
                      <button
                        onClick={() => addItem(item)}
                        className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium disabled:opacity-50"
                        disabled={
                          item.stock === 0 ||
                          (item.stock !== -1 && (cart[item.item_id]?.quantity || 0) >= item.stock)
                        }
                      >
                        {item.stock !== -1 && (cart[item.item_id]?.quantity || 0) >= item.stock ? "Max" : "Add"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-semibold">3</span>
              <h2 className="text-base font-semibold">Order Note</h2>
            </div>
            <textarea
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none resize-none h-24"
              placeholder="Optional note for this transaction..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="sticky top-20 bg-white rounded-lg overflow-hidden border border-slate-200">
            <div className="p-5 bg-slate-800 text-white">
              <h3 className="text-base font-semibold">Order Summary</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {selectedCustomer ? `${selectedCustomer.fullname || selectedCustomer.user_id}` : "No customer selected"}
              </p>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="max-h-[240px] overflow-y-auto pr-1 space-y-2">
                {cartLines.length === 0 ? (
                  <p className="text-sm text-slate-400">No items added yet.</p>
                ) : (
                  cartLines.map((line) => (
                    <div key={line.item.item_id} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">{line.item.item_name}</p>
                          <p className="text-xs text-slate-400">{line.item.price.toLocaleString("vi-VN")}₫ each</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {line.item.stock === -1
                              ? "Stock left: Unlimited"
                              : `Stock left: ${Math.max(0, line.item.stock - line.quantity)}`}
                          </p>
                        </div>
                        <button
                          onClick={() => removeLine(line.item.item_id)}
                          className="text-slate-400 hover:text-red-600"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button onClick={() => decreaseQty(line.item.item_id)} className="w-7 h-7 rounded bg-slate-200">-</button>
                          <span className="w-6 text-center text-sm font-medium">{line.quantity}</span>
                          <button
                            onClick={() => increaseQty(line.item.item_id)}
                            disabled={line.item.stock !== -1 && line.quantity >= line.item.stock}
                            className="w-7 h-7 rounded bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-semibold">{(line.item.price * line.quantity).toLocaleString("vi-VN")}₫</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total</span>
                  <span className="text-2xl font-bold text-on-surface">{subtotal.toLocaleString("vi-VN")}₫</span>
                </div>
              </div>

              {error && <p className="text-xs text-red-600">{error}</p>}
              {success && <p className="text-xs text-emerald-700">{success}</p>}

              <button
                onClick={createOrder}
                disabled={submitting || !selectedCustomerId || cartLines.length === 0}
                className="w-full py-2.5 bg-primary text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Creating..." : "Create Order"}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              <p className="text-[11px] text-slate-400">
                Payment method is fixed to bank transfer and order is created as pending.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
