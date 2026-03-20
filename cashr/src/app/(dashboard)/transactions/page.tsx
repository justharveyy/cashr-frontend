export default function TransactionsPage() {
  const transactions = [
    {
      id: "#TXN-8829410",
      date: "Mar 21, 2026",
      time: "14:22:10",
      initials: "NL",
      customer: "Nguyen Lan",
      type: "Inflow",
      typeIcon: "south_west",
      typeColor: "text-emerald-600",
      status: "Settled",
      statusClass:
        "bg-emerald-50 text-emerald-700",
      amount: "1.250.000",
      highlight: false,
    },
    {
      id: "#TXN-8829411",
      date: "Mar 21, 2026",
      time: "13:05:45",
      initials: "TH",
      customer: "Tran Huy",
      type: "Outflow",
      typeIcon: "north_east",
      typeColor: "text-slate-500",
      status: "Pending",
      statusClass:
        "bg-amber-50 text-amber-700",
      amount: "5.000.000",
      highlight: false,
    },
    {
      id: "#TXN-8829412",
      date: "Mar 21, 2026",
      time: "11:45:12",
      initials: "LA",
      customer: "Le Anh",
      type: "Inflow",
      typeIcon: "south_west",
      typeColor: "text-emerald-600",
      status: "Settled",
      statusClass:
        "bg-emerald-50 text-emerald-700",
      amount: "12.800.000",
      highlight: false,
    },
    {
      id: "#TXN-8829413",
      date: "Mar 20, 2026",
      time: "18:12:00",
      initials: "BT",
      customer: "Bui Thanh",
      type: "Inflow",
      typeIcon: "south_west",
      typeColor: "text-emerald-600",
      status: "Failed",
      statusClass:
        "bg-tertiary-container/10 text-tertiary",
      amount: "450.000",
      highlight: true,
    },
    {
      id: "#TXN-8829414",
      date: "Mar 20, 2026",
      time: "15:30:22",
      initials: "PL",
      customer: "Pham Linh",
      type: "Inflow",
      typeIcon: "south_west",
      typeColor: "text-emerald-600",
      status: "Settled",
      statusClass:
        "bg-emerald-50 text-emerald-700",
      amount: "3.600.000",
      highlight: false,
    },
  ];

  return (
    <>
      {/* Hero Balance Summary */}
      <section className="grid grid-cols-12 gap-6 items-end mb-8">
        <div className="col-span-12 lg:col-span-7 bg-primary rounded-xl p-8 text-on-primary shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container opacity-20 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />
          <p className="text-primary-fixed-dim text-sm font-medium mb-1">
            Net Movement (Last 30 Days)
          </p>
          <h3 className="text-5xl font-extrabold tracking-tighter mb-4">
            +142.850.000{" "}
            <span className="text-2xl font-normal opacity-70">VND</span>
          </h3>
          <div className="flex gap-4">
            <span className="flex items-center text-xs bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
              <span
                className="material-symbols-outlined text-xs mr-1"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                trending_up
              </span>
              12.5% vs Last Month
            </span>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/15">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              Total Inflow
            </p>
            <p className="text-2xl font-bold text-primary tracking-tight">
              218.400.000
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              1,242 Transactions
            </p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/15">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              Total Outflow
            </p>
            <p className="text-2xl font-bold text-tertiary tracking-tight">
              75.550.000
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              458 Transactions
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-surface-container-low p-5 rounded-xl flex flex-wrap items-center gap-4 mb-8">
        <div className="flex-grow flex items-center gap-3">
          <div className="relative flex-grow max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              search
            </span>
            <input
              className="w-full bg-surface-container-lowest border-none rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 outline-none"
              placeholder="Search Transaction ID or Customer..."
              type="text"
            />
          </div>
          <button className="bg-surface-container-lowest px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-white transition-colors border border-outline-variant/10">
            <span className="material-symbols-outlined text-sm">
              calendar_today
            </span>
            Mar 1, 2026 - Mar 21, 2026
          </button>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-surface-container-lowest border-none rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 min-w-[140px] outline-none">
            <option>All Types</option>
            <option>Inflow</option>
            <option>Outflow</option>
          </select>
          <select className="bg-surface-container-lowest border-none rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 min-w-[140px] outline-none">
            <option>All Status</option>
            <option>Settled</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
          <button className="bg-primary-container/10 text-primary px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-primary-container/20 transition-colors">
            Apply Filters
          </button>
        </div>
      </section>

      {/* Ledger Table */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10 mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-slate-500 text-[11px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount (VND)</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((txn) => (
                <tr
                  key={txn.id}
                  className={`hover:bg-slate-50 transition-colors group ${txn.highlight ? "border-l-4 border-l-error" : ""}`}
                >
                  <td className="px-6 py-5 font-mono text-xs text-primary font-semibold">
                    {txn.id}
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-medium">{txn.date}</div>
                    <div className="text-[10px] text-slate-400">{txn.time}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-outline-variant/10">
                        {txn.initials}
                      </div>
                      <div className="text-sm font-medium">{txn.customer}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`flex items-center gap-1.5 ${txn.typeColor} text-xs font-bold`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {txn.typeIcon}
                      </span>
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`${txn.statusClass} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-5 text-right font-bold tracking-tight ${txn.highlight ? "text-slate-400" : "text-slate-900"}`}
                  >
                    {txn.amount}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-slate-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-surface-container-low flex justify-between items-center text-xs font-medium text-slate-500">
          <div>Showing 1 - 20 of 1,700 transactions</div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/20 rounded opacity-50"
              disabled
            >
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>
            <button className="px-3 py-1.5 bg-primary text-on-primary rounded">
              1
            </button>
            <button className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/20 rounded hover:bg-white">
              2
            </button>
            <button className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/20 rounded hover:bg-white">
              3
            </button>
            <button className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/20 rounded hover:bg-white">
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Export Tools */}
      <section className="flex justify-end gap-3">
        <button className="bg-surface-container-highest text-on-surface-variant px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-outline-variant/30 transition-colors">
          <span className="material-symbols-outlined text-sm">print</span>
          Print PDF
        </button>
        <button className="bg-secondary text-on-secondary px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-sm">download</span>
          Export CSV
        </button>
      </section>
    </>
  );
}
