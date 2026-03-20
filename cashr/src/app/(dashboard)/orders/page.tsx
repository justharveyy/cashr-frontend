export default function OrdersPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-2 block">
              Executive Overview
            </span>
            <h2 className="text-4xl font-extrabold text-primary tracking-tight">
              Orders & Transactions
            </h2>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-lowest text-on-surface-variant font-semibold rounded-lg shadow-sm border border-outline-variant/15 hover:bg-slate-50 transition-all active:scale-95">
              <span className="material-symbols-outlined text-lg">
                calendar_today
              </span>
              <span className="text-sm">Last 30 Days</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-container transition-all active:scale-95">
              <span className="material-symbols-outlined text-lg">
                download
              </span>
              <span className="text-sm">Export Report</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4 p-8 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined text-[160px]">
                account_balance_wallet
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium opacity-80 mb-1">
                Net Movement
              </p>
              <h3 className="text-5xl font-black mb-6">₫48.2M</h3>
              <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-md">
                <span className="material-symbols-outlined text-sm font-bold">
                  trending_up
                </span>
                <span className="text-xs font-bold">
                  +12.4% vs last month
                </span>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4 p-8 rounded-xl bg-surface-container-lowest border border-outline-variant/15 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
                <span className="material-symbols-outlined">
                  arrow_downward
                </span>
              </div>
              <p className="text-sm font-bold text-slate-500">
                Monthly Inflow
              </p>
            </div>
            <h3 className="text-3xl font-extrabold text-on-surface mb-2">
              ₫124.500.000
            </h3>
            <p className="text-xs text-slate-400">
              Total 1,242 successful settlements
            </p>
          </div>
          <div className="col-span-12 lg:col-span-4 p-8 rounded-xl bg-surface-container-lowest border border-outline-variant/15 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-rose-50 text-tertiary">
                <span className="material-symbols-outlined">arrow_upward</span>
              </div>
              <p className="text-sm font-bold text-slate-500">
                Monthly Outflow
              </p>
            </div>
            <h3 className="text-3xl font-extrabold text-on-surface mb-2">
              ₫76.300.000
            </h3>
            <p className="text-xs text-slate-400">
              Inventory restock & processing fees
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-10">
        {/* Live Orders Table */}
        <div className="col-span-12 xl:col-span-8">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
            <div className="p-6 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <h4 className="text-lg font-bold">Live Orders</h4>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
                  24 ACTIVE
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 hover:bg-white rounded transition-colors">
                  <span className="material-symbols-outlined text-slate-400 text-lg">
                    filter_list
                  </span>
                </button>
                <button className="p-1.5 hover:bg-white rounded transition-colors">
                  <span className="material-symbols-outlined text-slate-400 text-lg">
                    more_vert
                  </span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    {
                      id: "#CSR-9021",
                      initials: "AN",
                      name: "Anh Nguyen",
                      loc: "Saigon, VN",
                      date: "Mar 21, 14:20",
                      amount: "₫1.240.000",
                      status: "Awaiting Pickup",
                      statusClass:
                        "bg-secondary-fixed text-on-secondary-fixed",
                    },
                    {
                      id: "#CSR-9018",
                      initials: "MT",
                      name: "Minh Tran",
                      loc: "Hanoi, VN",
                      date: "Mar 21, 13:45",
                      amount: "₫5.500.000",
                      status: "Pending",
                      statusClass: "bg-orange-100 text-orange-700",
                    },
                    {
                      id: "#CSR-9015",
                      initials: "LH",
                      name: "Le Hoang",
                      loc: "Da Nang, VN",
                      date: "Mar 21, 11:10",
                      amount: "₫890.000",
                      status: "Processing",
                      statusClass: "bg-blue-100 text-blue-700",
                    },
                    {
                      id: "#CSR-9012",
                      initials: "TP",
                      name: "Tu Pham",
                      loc: "Can Tho, VN",
                      date: "Mar 20, 19:20",
                      amount: "₫2.100.000",
                      status: "Delivered",
                      statusClass: "bg-emerald-100 text-emerald-700",
                    },
                  ].map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-5">
                        <span className="font-bold text-primary text-sm">
                          {order.id}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {order.initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">
                              {order.name}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {order.loc}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {order.date}
                      </td>
                      <td className="px-6 py-5 font-bold text-sm text-on-surface">
                        {order.amount}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${order.statusClass} text-[10px] font-bold`}
                        >
                          <span className="w-1 h-1 rounded-full bg-current" />
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 border-t border-slate-50 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Showing 4 of 24 active orders
              </p>
              <button className="px-4 py-2 text-xs font-bold text-primary hover:bg-slate-50 rounded-lg transition-colors">
                View All Orders
              </button>
            </div>
          </div>
        </div>

        {/* Recent Financial Log */}
        <div className="col-span-12 xl:col-span-4">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold">Recent Financial Log</h4>
              <button className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Sync Log
              </button>
            </div>
            <div className="space-y-3">
              {[
                {
                  icon: "payments",
                  iconBg: "bg-emerald-50 text-emerald-600",
                  title: "Merchant Settlement",
                  desc: "Bank Transfer - #TR-9921",
                  amount: "+₫18.400.000",
                  amountColor: "text-emerald-600",
                  time: "Mar 21, 09:00 AM",
                  badge: "Settled",
                  badgeClass:
                    "text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded",
                },
                {
                  icon: "inventory",
                  iconBg: "bg-slate-100 text-slate-500",
                  title: "Wholesale Payment",
                  desc: "Inventory Purchase - #PO-112",
                  amount: "-₫4.200.000",
                  amountColor: "text-on-surface",
                  time: "Mar 20, 16:45 PM",
                  badge: "Completed",
                  badgeClass:
                    "text-slate-500 font-bold bg-slate-50 px-2 py-0.5 rounded",
                },
                {
                  icon: "history",
                  iconBg: "bg-rose-50 text-tertiary",
                  title: "Refund Processed",
                  desc: "Order #CSR-8821 - Cust: Vy Le",
                  amount: "-₫540.000",
                  amountColor: "text-tertiary",
                  time: "Mar 20, 11:30 AM",
                  badge: "Refunded",
                  badgeClass:
                    "text-on-tertiary-fixed-variant font-bold bg-rose-50 px-2 py-0.5 rounded",
                },
              ].map((entry) => (
                <div
                  key={entry.title}
                  className="p-5 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/5 group hover:border-primary/20 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${entry.iconBg}`}>
                        <span className="material-symbols-outlined text-xl">
                          {entry.icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">{entry.title}</p>
                        <p className="text-[10px] text-slate-400">
                          {entry.desc}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${entry.amountColor}`}>
                      {entry.amount}
                    </span>
                  </div>
                  <div className="h-px w-full bg-slate-50 mb-3" />
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">{entry.time}</span>
                    <span className={entry.badgeClass}>{entry.badge}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bank Card */}
            <div className="p-6 bg-[#001848] rounded-xl text-white overflow-hidden relative">
              <div className="absolute right-0 top-0 w-32 h-32 bg-primary-container/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-sm bg-white p-1 flex items-center justify-center text-primary font-bold text-xs">
                    VCB
                  </div>
                  <p className="text-xs font-bold tracking-tight">
                    Connected Settlement Bank
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-300 uppercase tracking-widest">
                    Account Number
                  </p>
                  <p className="text-xl font-mono tracking-widest">
                    **** **** 9012
                  </p>
                </div>
                <div className="mt-8 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-slate-300 uppercase">
                      Settlement Threshold
                    </p>
                    <p className="text-sm font-bold">₫5.000.000</p>
                  </div>
                  <span className="material-symbols-outlined text-white/40">
                    verified_user
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
