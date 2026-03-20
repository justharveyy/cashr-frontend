export default function TransactionsPage() {
  const transactions = [
    { id: "#TXN-8829410", date: "Mar 21, 2026", time: "14:22:10", initials: "NL", customer: "Nguyen Lan", type: "Inflow", typeIcon: "south_west", typeColor: "text-emerald-600", status: "Settled", statusClass: "bg-emerald-50 text-emerald-700", amount: "1.250.000", highlight: false },
    { id: "#TXN-8829411", date: "Mar 21, 2026", time: "13:05:45", initials: "TH", customer: "Tran Huy", type: "Outflow", typeIcon: "north_east", typeColor: "text-slate-500", status: "Pending", statusClass: "bg-amber-50 text-amber-700", amount: "5.000.000", highlight: false },
    { id: "#TXN-8829412", date: "Mar 21, 2026", time: "11:45:12", initials: "LA", customer: "Le Anh", type: "Inflow", typeIcon: "south_west", typeColor: "text-emerald-600", status: "Settled", statusClass: "bg-emerald-50 text-emerald-700", amount: "12.800.000", highlight: false },
    { id: "#TXN-8829413", date: "Mar 20, 2026", time: "18:12:00", initials: "BT", customer: "Bui Thanh", type: "Inflow", typeIcon: "south_west", typeColor: "text-emerald-600", status: "Failed", statusClass: "bg-red-50 text-red-700", amount: "450.000", highlight: true },
    { id: "#TXN-8829414", date: "Mar 20, 2026", time: "15:30:22", initials: "PL", customer: "Pham Linh", type: "Inflow", typeIcon: "south_west", typeColor: "text-emerald-600", status: "Settled", statusClass: "bg-emerald-50 text-emerald-700", amount: "3.600.000", highlight: false },
  ];

  return (
    <>
      {/* Summary */}
      <section className="grid grid-cols-12 gap-4 items-end mb-6">
        <div className="col-span-12 lg:col-span-7 bg-white rounded-lg p-6 border border-slate-200">
          <p className="text-xs text-slate-400 font-medium mb-1">
            Net Movement (Last 30 Days)
          </p>
          <h3 className="text-3xl font-bold text-on-surface mb-3">
            +142.850.000{" "}
            <span className="text-lg font-normal text-slate-400">VND</span>
          </h3>
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            12.5% vs Last Month
          </span>
        </div>
        <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
              Total Inflow
            </p>
            <p className="text-xl font-bold text-on-surface">218.400.000</p>
            <p className="text-[10px] text-slate-400 mt-1">1,242 Transactions</p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
              Total Outflow
            </p>
            <p className="text-xl font-bold text-red-600">75.550.000</p>
            <p className="text-[10px] text-slate-400 mt-1">458 Transactions</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white p-4 rounded-lg flex flex-wrap items-center gap-3 mb-6 border border-slate-200">
        <div className="flex-grow flex items-center gap-3">
          <div className="relative flex-grow max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 placeholder:text-slate-400 outline-none" placeholder="Search Transaction ID or Customer..." type="text" />
          </div>
          <button className="bg-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-slate-200 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            Mar 1 - Mar 21, 2026
          </button>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 min-w-[120px] outline-none">
            <option>All Types</option>
            <option>Inflow</option>
            <option>Outflow</option>
          </select>
          <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 min-w-[120px] outline-none">
            <option>All Status</option>
            <option>Settled</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
          <button className="bg-primary/5 text-primary px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/10 transition-colors">
            Apply
          </button>
        </div>
      </section>

      {/* Ledger Table */}
      <section className="bg-white rounded-lg overflow-hidden border border-slate-200 mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">Transaction ID</th>
                <th className="px-5 py-3">Date & Time</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Amount (VND)</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((txn) => (
                <tr key={txn.id} className={`hover:bg-slate-50 transition-colors ${txn.highlight ? "border-l-3 border-l-red-400" : ""}`}>
                  <td className="px-5 py-3.5 font-mono text-xs text-primary font-medium">{txn.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="text-sm font-medium">{txn.date}</div>
                    <div className="text-[10px] text-slate-400">{txn.time}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-500">{txn.initials}</div>
                      <span className="text-sm font-medium">{txn.customer}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`flex items-center gap-1 ${txn.typeColor} text-xs font-medium`}>
                      <span className="material-symbols-outlined text-[14px]">{txn.typeIcon}</span>
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`${txn.statusClass} px-2 py-0.5 rounded text-[10px] font-semibold`}>{txn.status}</span>
                  </td>
                  <td className={`px-5 py-3.5 text-right font-medium text-sm ${txn.highlight ? "text-slate-400" : "text-on-surface"}`}>{txn.amount}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="text-slate-300 hover:text-slate-500 transition-colors">
                      <span className="material-symbols-outlined text-xl">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
          <div>Showing 1 - 20 of 1,700 transactions</div>
          <div className="flex gap-1">
            <button className="px-2.5 py-1 border border-slate-200 rounded text-slate-300" disabled>
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="px-2.5 py-1 bg-primary text-white rounded text-xs font-medium">1</button>
            <button className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-50">2</button>
            <button className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-50">3</button>
            <button className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-50">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* Export Tools */}
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
