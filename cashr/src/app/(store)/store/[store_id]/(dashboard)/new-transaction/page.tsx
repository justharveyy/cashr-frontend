export default function NewTransactionPage() {
  return (
    <>
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-on-surface mb-1">
            Create Transaction
          </h1>
          <p className="text-sm text-slate-500">
            Record a manual sale or service transaction.
          </p>
        </div>
        <span className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm">pending</span>
          Draft Mode
        </span>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Form */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          {/* Section 1: Customer */}
          <section className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-semibold">
                1
              </span>
              <h2 className="text-base font-semibold">Customer Information</h2>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary/30 text-sm placeholder:text-slate-400 outline-none"
                placeholder="Search customer name, email or phone..."
                type="text"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { initials: "NL", name: "Nguyen Lan", phone: "090 123 4567" },
                { initials: "TH", name: "Tran Hoang", phone: "091 987 6543" },
              ].map((customer) => (
                <button key={customer.initials} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-left hover:border-primary/30 hover:bg-blue-50/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-sm text-slate-600">
                    {customer.initials}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-on-surface">{customer.name}</p>
                    <p className="text-xs text-slate-400">{customer.phone}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Section 2: Product */}
          <section className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-semibold">
                2
              </span>
              <h2 className="text-base font-semibold">Product Selection</h2>
            </div>
            <div className="flex flex-col gap-3">
              <div className="bg-slate-50 p-4 rounded-lg flex items-center gap-4 border border-slate-100">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined text-2xl">smartphone</span>
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-sm">iPhone 15 Pro Max</h3>
                  <div className="flex gap-3 items-center mt-0.5">
                    <span className="text-sm font-semibold text-primary">32.990.000₫</span>
                    <span className="text-xs text-slate-400">Stock: 24</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-7 h-7 rounded bg-slate-200 flex items-center justify-center hover:bg-slate-300 text-sm font-medium">-</button>
                  <span className="w-6 text-center text-sm font-medium">1</span>
                  <button className="w-7 h-7 rounded bg-slate-200 flex items-center justify-center hover:bg-slate-300 text-sm font-medium">+</button>
                </div>
                <button className="text-slate-300 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
              <button className="w-full py-3 border border-dashed border-slate-300 rounded-lg text-slate-400 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                <span className="material-symbols-outlined text-xl">add_circle</span>
                Add Product
              </button>
            </div>
          </section>

          {/* Section 3: Payment */}
          <section className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-semibold">
                3
              </span>
              <h2 className="text-base font-semibold">Payment Method</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: "account_balance", label: "Local Bank", checked: true },
                { icon: "payments", label: "Cash", checked: false },
                { icon: "wallet", label: "E-wallet", checked: false },
              ].map((method) => (
                <label key={method.label} className="relative cursor-pointer">
                  <input defaultChecked={method.checked} className="peer absolute opacity-0" name="payment" type="radio" />
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-50 border border-slate-200 peer-checked:border-primary peer-checked:bg-blue-50/30 transition-colors hover:bg-slate-100">
                    <span className="material-symbols-outlined text-2xl text-slate-500 peer-checked:text-primary">{method.icon}</span>
                    <span className="text-sm font-medium">{method.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Summary */}
        <div className="col-span-12 lg:col-span-4">
          <div className="sticky top-20">
            <div className="bg-white rounded-lg overflow-hidden border border-slate-200">
              <div className="p-5 bg-slate-800 text-white">
                <h3 className="text-base font-semibold">Order Summary</h3>
                <p className="text-xs text-slate-300 mt-0.5">TXN #8829-001</p>
              </div>
              <div className="p-5 flex flex-col gap-5">
                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium">32.990.000₫</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">VAT (10%)</span>
                    <span className="font-medium">3.299.000₫</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Discount</span>
                    <span className="font-medium text-red-600">-0₫</span>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total</span>
                    <span className="text-2xl font-bold text-on-surface">36.289.000₫</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="w-full py-2.5 bg-primary text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary-container transition-colors">
                    Complete Transaction
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                  <button className="w-full py-2.5 bg-slate-50 text-slate-600 rounded-lg font-medium text-sm flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-100 transition-colors">
                    <span className="material-symbols-outlined text-sm">print</span>
                    Save & Print Receipt
                  </button>
                </div>
                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
                  <span className="material-symbols-outlined text-amber-600 text-lg">info</span>
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    Completing this transaction will update inventory levels immediately.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-white rounded-lg p-5 border border-slate-200">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-lg">history</span>
                Recent Activity
              </h4>
              <div className="space-y-3">
                {[
                  { label: "Product Added", desc: "iPhone 15 Pro Max x1" },
                  { label: "Customer Identified", desc: "Guest User #000 (Updated manually)" },
                ].map((item) => (
                  <div key={item.label} className="flex gap-2.5">
                    <div className="w-0.5 rounded-full bg-slate-200 shrink-0" />
                    <div>
                      <p className="text-xs font-medium">{item.label}</p>
                      <p className="text-[10px] text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
