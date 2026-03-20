export default function OrdersPage() {
  return (
    <>
      {/* Header */}
      <section className="mb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
              Executive Overview
            </p>
            <h2 className="text-2xl font-bold text-on-surface">
              Orders & Transactions
            </h2>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm">
              <span className="material-symbols-outlined text-lg">
                calendar_today
              </span>
              Last 30 Days
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-container transition-colors text-sm">
              <span className="material-symbols-outlined text-lg">
                download
              </span>
              Export Report
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-5 rounded-lg bg-white border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/5 text-primary">
                <span className="material-symbols-outlined text-xl">
                  account_balance_wallet
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500">Net Movement</p>
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-1">₫48.2M</h3>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <span className="material-symbols-outlined text-sm">
                trending_up
              </span>
              +12.4% vs last month
            </span>
          </div>
          <div className="p-5 rounded-lg bg-white border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <span className="material-symbols-outlined text-xl">
                  arrow_downward
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500">Monthly Inflow</p>
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-1">
              ₫124.500.000
            </h3>
            <p className="text-xs text-slate-400">
              1,242 successful settlements
            </p>
          </div>
          <div className="p-5 rounded-lg bg-white border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-red-50 text-red-600">
                <span className="material-symbols-outlined text-xl">arrow_upward</span>
              </div>
              <p className="text-xs font-medium text-slate-500">Monthly Outflow</p>
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-1">
              ₫76.300.000
            </h3>
            <p className="text-xs text-slate-400">
              Inventory restock & fees
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-6">
        {/* Live Orders Table */}
        <div className="col-span-12 xl:col-span-8">
          <div className="bg-white rounded-lg overflow-hidden border border-slate-200">
            <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <h4 className="text-sm font-semibold">Live Orders</h4>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded">
                  24 ACTIVE
                </span>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 hover:bg-slate-50 rounded transition-colors">
                  <span className="material-symbols-outlined text-slate-400 text-lg">
                    filter_list
                  </span>
                </button>
                <button className="p-1.5 hover:bg-slate-50 rounded transition-colors">
                  <span className="material-symbols-outlined text-slate-400 text-lg">
                    more_vert
                  </span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-100">
                  <tr>
                    {["Order ID", "Customer", "Date", "Amount", "Status"].map((h) => (
                      <th key={h} className={`px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider ${h === "Status" ? "text-right" : ""}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { id: "#CSR-9021", initials: "AN", name: "Anh Nguyen", loc: "Saigon, VN", date: "Mar 21, 14:20", amount: "₫1.240.000", status: "Awaiting Pickup", statusClass: "bg-blue-50 text-blue-700" },
                    { id: "#CSR-9018", initials: "MT", name: "Minh Tran", loc: "Hanoi, VN", date: "Mar 21, 13:45", amount: "₫5.500.000", status: "Pending", statusClass: "bg-amber-50 text-amber-700" },
                    { id: "#CSR-9015", initials: "LH", name: "Le Hoang", loc: "Da Nang, VN", date: "Mar 21, 11:10", amount: "₫890.000", status: "Processing", statusClass: "bg-blue-50 text-blue-700" },
                    { id: "#CSR-9012", initials: "TP", name: "Tu Pham", loc: "Can Tho, VN", date: "Mar 20, 19:20", amount: "₫2.100.000", status: "Delivered", statusClass: "bg-emerald-50 text-emerald-700" },
                  ].map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                      <td className="px-5 py-3.5">
                        <span className="font-medium text-primary text-sm">{order.id}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-500">
                            {order.initials}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{order.name}</p>
                            <p className="text-[10px] text-slate-400">{order.loc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">{order.date}</td>
                      <td className="px-5 py-3.5 text-sm font-medium">{order.amount}</td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${order.statusClass} text-[10px] font-semibold`}>
                          <span className="w-1 h-1 rounded-full bg-current" />
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400">Showing 4 of 24 active orders</p>
              <button className="px-3 py-1.5 text-xs font-medium text-primary hover:bg-slate-50 rounded transition-colors">
                View All Orders
              </button>
            </div>
          </div>
        </div>

        {/* Recent Financial Log */}
        <div className="col-span-12 xl:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Recent Financial Log</h4>
            <button className="text-[11px] font-medium text-primary">Sync Log</button>
          </div>
          {[
            { icon: "payments", iconBg: "bg-emerald-50 text-emerald-600", title: "Merchant Settlement", desc: "Bank Transfer - #TR-9921", amount: "+₫18.400.000", amountColor: "text-emerald-600", time: "Mar 21, 09:00 AM", badge: "Settled", badgeClass: "text-emerald-700 bg-emerald-50" },
            { icon: "inventory", iconBg: "bg-slate-50 text-slate-500", title: "Wholesale Payment", desc: "Inventory Purchase - #PO-112", amount: "-₫4.200.000", amountColor: "text-on-surface", time: "Mar 20, 16:45 PM", badge: "Completed", badgeClass: "text-slate-600 bg-slate-50" },
            { icon: "history", iconBg: "bg-red-50 text-red-600", title: "Refund Processed", desc: "Order #CSR-8821 - Vy Le", amount: "-₫540.000", amountColor: "text-red-600", time: "Mar 20, 11:30 AM", badge: "Refunded", badgeClass: "text-red-700 bg-red-50" },
          ].map((entry) => (
            <div key={entry.title} className="p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${entry.iconBg}`}>
                    <span className="material-symbols-outlined text-lg">{entry.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{entry.title}</p>
                    <p className="text-[10px] text-slate-400">{entry.desc}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${entry.amountColor}`}>{entry.amount}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] pt-2.5 border-t border-slate-50">
                <span className="text-slate-400">{entry.time}</span>
                <span className={`${entry.badgeClass} font-semibold px-1.5 py-0.5 rounded`}>{entry.badge}</span>
              </div>
            </div>
          ))}

          {/* Bank Card */}
          <div className="p-4 bg-slate-800 rounded-lg text-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded bg-white p-0.5 flex items-center justify-center text-primary font-bold text-[10px]">
                VCB
              </div>
              <p className="text-xs font-medium text-slate-200">
                Connected Settlement Bank
              </p>
            </div>
            <div className="mb-4">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                Account Number
              </p>
              <p className="text-lg font-mono tracking-wider text-slate-100">
                **** **** 9012
              </p>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-slate-400 uppercase">
                  Settlement Threshold
                </p>
                <p className="text-sm font-medium text-slate-100">₫5.000.000</p>
              </div>
              <span className="material-symbols-outlined text-slate-500 text-xl">
                verified_user
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
