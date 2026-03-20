export default function NewTransactionPage() {
  return (
    <>
      {/* Header */}
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">
            Create Transaction
          </h1>
          <p className="text-on-surface-variant font-medium">
            Record a manual sale or service transaction.
          </p>
        </div>
        <div className="flex gap-3">
          <span className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">pending</span>
            Draft Mode
          </span>
        </div>
      </header>

      {/* Multi-step Interface */}
      <div className="grid grid-cols-12 gap-8">
        {/* Main Form */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          {/* Section 1: Customer */}
          <section className="bg-surface-container-low rounded-xl p-8 transition-all hover:bg-white hover:shadow-xl hover:shadow-on-surface/5">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">
                1
              </span>
              <h2 className="text-xl font-bold tracking-tight">
                Customer Information
              </h2>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">
                search
              </span>
              <input
                className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border-none rounded-lg focus:ring-2 focus:ring-primary shadow-sm text-lg font-medium placeholder:text-outline-variant outline-none"
                placeholder="Search customer name, email or phone..."
                type="text"
              />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {[
                {
                  initials: "NL",
                  name: "Nguyen Lan",
                  phone: "090 123 4567",
                },
                {
                  initials: "TH",
                  name: "Tran Hoang",
                  phone: "091 987 6543",
                },
              ].map((customer) => (
                <button
                  key={customer.initials}
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/15 text-left hover:bg-primary-fixed transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center font-bold text-primary">
                    {customer.initials}
                  </div>
                  <div>
                    <p className="font-bold text-on-surface group-hover:text-primary">
                      {customer.name}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {customer.phone}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Section 2: Product */}
          <section className="bg-surface-container-low rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h2 className="text-xl font-bold tracking-tight">
                Product Selection
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-lowest p-6 rounded-xl flex items-center gap-6 shadow-sm">
                <div className="w-16 h-16 rounded-lg bg-surface-container-highest overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined text-3xl">
                    smartphone
                  </span>
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">iPhone 15 Pro Max</h3>
                  <div className="flex gap-4 items-center mt-1">
                    <span className="text-sm font-semibold text-primary">
                      32.990.000₫
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">
                      Stock: 24 units
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="w-8 h-8 rounded-md bg-surface-container-high flex items-center justify-center hover:bg-primary-fixed font-bold">
                    -
                  </button>
                  <span className="w-8 text-center font-bold">1</span>
                  <button className="w-8 h-8 rounded-md bg-surface-container-high flex items-center justify-center hover:bg-primary-fixed font-bold">
                    +
                  </button>
                </div>
                <button className="text-error opacity-40 hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
              <button className="w-full py-4 border-2 border-dashed border-outline-variant rounded-xl text-outline hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 font-bold">
                <span className="material-symbols-outlined">add_circle</span>
                Add Product
              </button>
            </div>
          </section>

          {/* Section 3: Payment */}
          <section className="bg-surface-container-low rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">
                3
              </span>
              <h2 className="text-xl font-bold tracking-tight">
                Payment Method
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: "account_balance",
                  label: "Local Bank",
                  checked: true,
                },
                { icon: "payments", label: "Cash", checked: false },
                { icon: "wallet", label: "E-wallet", checked: false },
              ].map((method) => (
                <label key={method.label} className="relative cursor-pointer group">
                  <input
                    defaultChecked={method.checked}
                    className="peer absolute opacity-0"
                    name="payment"
                    type="radio"
                  />
                  <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-surface-container-lowest border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary-fixed transition-all group-hover:bg-white">
                    <span className="material-symbols-outlined text-3xl">
                      {method.icon}
                    </span>
                    <span className="font-bold text-sm">{method.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Summary */}
        <div className="col-span-12 lg:col-span-4">
          <div className="sticky top-24">
            <div className="glass-panel rounded-xl overflow-hidden shadow-2xl shadow-primary/10 border border-white/40">
              <div className="p-6 bg-primary text-on-primary">
                <h3 className="text-lg font-bold">Order Summary</h3>
                <p className="text-xs text-on-primary/70 mt-1">
                  TXN #8829-001
                </p>
              </div>
              <div className="p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant font-medium">
                      Subtotal
                    </span>
                    <span className="font-bold">32.990.000₫</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant font-medium">
                      VAT (10%)
                    </span>
                    <span className="font-bold">3.299.000₫</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant font-medium">
                      Discount
                    </span>
                    <span className="text-tertiary font-bold">-0₫</span>
                  </div>
                </div>
                <div className="border-t border-outline-variant/30 pt-6">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      Total Amount
                    </span>
                    <span className="text-4xl font-black text-primary tracking-tighter">
                      36.289.000₫
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-3">
                  <button className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
                    Complete Transaction
                    <span className="material-symbols-outlined">
                      arrow_forward
                    </span>
                  </button>
                  <button className="w-full py-4 bg-primary-fixed text-on-primary-fixed-variant rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-secondary-fixed transition-all">
                    <span className="material-symbols-outlined">print</span>
                    Save & Print Receipt
                  </button>
                </div>
                <div className="flex items-center gap-3 p-3 bg-tertiary-container/10 rounded-lg">
                  <span className="material-symbols-outlined text-tertiary">
                    info
                  </span>
                  <p className="text-[10px] leading-tight text-on-surface-variant font-medium">
                    By completing this transaction, inventory levels will be
                    updated immediately in the Ledger.
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-6 bg-white rounded-xl p-6 border border-outline-variant/15">
              <h4 className="font-bold mb-4 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">
                  history
                </span>
                Recent Activity
              </h4>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-1 h-10 rounded-full bg-secondary-fixed" />
                  <div>
                    <p className="text-xs font-bold">Product Added</p>
                    <p className="text-[10px] text-on-surface-variant">
                      iPhone 15 Pro Max x1
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1 h-10 rounded-full bg-secondary-fixed" />
                  <div>
                    <p className="text-xs font-bold">Customer Identified</p>
                    <p className="text-[10px] text-on-surface-variant">
                      Guest User #000 (Updated manually)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
