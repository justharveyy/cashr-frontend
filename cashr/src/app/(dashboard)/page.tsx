export default function DashboardPage() {
  return (
    <>
      {/* Hero Greeting */}
      <div className="mb-10">
        <h2 className="text-[3.5rem] font-black tracking-tight text-primary leading-none mb-2">
          Good morning, Thanh Nam
        </h2>
        <p className="text-slate-500 text-lg">
          Your business performance is up by{" "}
          <span className="text-secondary font-bold">12.4%</span> this week.
        </p>
      </div>

      {/* Bento Grid Dashboard */}
      <div className="grid grid-cols-12 gap-8">
        {/* Main Sales Chart - Large Card */}
        <div className="col-span-8 bg-surface-container-lowest rounded-xl p-8 shadow-[0_24px_24px_-4px_rgba(25,28,30,0.06)] relative overflow-hidden group">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-1">
                Daily Sales
              </h3>
              <p className="text-sm text-slate-400">
                Transaction volume per day
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                This Week
              </span>
            </div>
          </div>
          {/* Bar Chart */}
          <div className="flex items-end justify-between h-64 gap-4 px-4">
            <div className="flex-1 bg-surface-container rounded-t-lg transition-all hover:bg-primary-container h-[40%]" />
            <div className="flex-1 bg-surface-container rounded-t-lg transition-all hover:bg-primary-container h-[65%]" />
            <div className="flex-1 bg-surface-container rounded-t-lg transition-all hover:bg-primary-container h-[45%]" />
            <div className="flex-1 bg-primary rounded-t-lg h-[90%] shadow-lg" />
            <div className="flex-1 bg-surface-container rounded-t-lg transition-all hover:bg-primary-container h-[55%]" />
            <div className="flex-1 bg-surface-container rounded-t-lg transition-all hover:bg-primary-container h-[70%]" />
            <div className="flex-1 bg-surface-container rounded-t-lg transition-all hover:bg-primary-container h-[30%]" />
          </div>
          <div className="flex justify-between mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest px-4">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Active Chats Card */}
        <div className="col-span-4 bg-primary rounded-xl p-8 text-on-primary flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <span className="material-symbols-outlined text-secondary-fixed-dim">
                chat
              </span>
              <span className="text-sm font-bold tracking-widest uppercase opacity-80">
                Active Chats
              </span>
            </div>
            <h4 className="text-4xl font-black mb-1">14</h4>
            <p className="text-on-primary-container text-sm">
              Customers waiting for reply
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex -space-x-3 overflow-hidden">
              {["NL", "TH", "LA"].map((initials) => (
                <div
                  key={initials}
                  className="inline-block h-10 w-10 rounded-full ring-4 ring-primary bg-primary-fixed-dim flex items-center justify-center text-xs font-bold text-primary"
                >
                  {initials}
                </div>
              ))}
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-4 ring-primary bg-primary-container text-xs font-bold">
                +11
              </div>
            </div>
            <button className="w-full py-3 bg-white text-primary rounded-lg font-bold text-sm flex items-center justify-center space-x-2 active:scale-95 transition-transform">
              <span>Open Inbox</span>
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </button>
          </div>
        </div>

        {/* Inventory Health */}
        <div className="col-span-12 lg:col-span-5 bg-surface-container-low rounded-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-on-surface">
              Inventory Health
            </h3>
            <span className="material-symbols-outlined text-slate-400">
              more_horiz
            </span>
          </div>
          <div className="space-y-6">
            {[
              {
                icon: "devices",
                name: "Electronics",
                units: "1,240 SKU units",
                status: "Optimal",
                statusColor: "bg-green-100 text-green-700",
                percent: "88%",
              },
              {
                icon: "chair",
                name: "Home & Decor",
                units: "432 SKU units",
                status: "Low Stock",
                statusColor: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
                percent: "32%",
              },
              {
                icon: "apparel",
                name: "Fashion",
                units: "890 SKU units",
                status: "Restocking",
                statusColor:
                  "bg-secondary-fixed text-on-secondary-fixed-variant",
                percent: "65%",
              },
            ].map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-surface-container-lowest rounded-xl flex items-center justify-center text-primary shadow-sm border border-slate-100">
                    <span className="material-symbols-outlined">
                      {cat.icon}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">{cat.name}</p>
                    <p className="text-xs text-slate-400">{cat.units}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 ${cat.statusColor} rounded-full text-[10px] font-bold uppercase tracking-wider`}
                  >
                    {cat.status}
                  </span>
                  <p className="text-xs font-bold mt-1 text-slate-600">
                    {cat.percent}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Orders Table */}
        <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest rounded-xl p-8 shadow-[0_24px_24px_-4px_rgba(25,28,30,0.06)]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-on-surface">New Orders</h3>
            <a className="text-primary text-sm font-bold flex items-center space-x-1 hover:underline cursor-pointer">
              <span>View All</span>
              <span className="material-symbols-outlined text-sm">
                open_in_new
              </span>
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">
                <tr>
                  <th className="pb-4">Order ID</th>
                  <th className="pb-4">Customer</th>
                  <th className="pb-4">Product</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  {
                    id: "#ORD-9921",
                    customer: "Le Minh Hoang",
                    product: "iPhone 15 Pro Max...",
                    status: "Processing",
                    statusClass:
                      "bg-secondary-container/10 text-secondary-container",
                    amount: "32.990.000₫",
                  },
                  {
                    id: "#ORD-9920",
                    customer: "Tran Thi An",
                    product: "Ergonomic Chair Pro",
                    status: "Processing",
                    statusClass:
                      "bg-secondary-container/10 text-secondary-container",
                    amount: "4.500.000₫",
                  },
                  {
                    id: "#ORD-9919",
                    customer: "Nguyen Van Binh",
                    product: "MacBook Air M2",
                    status: "Delayed",
                    statusClass:
                      "bg-tertiary-container/10 text-tertiary-container",
                    amount: "28.400.000₫",
                  },
                  {
                    id: "#ORD-9918",
                    customer: "Phan My Linh",
                    product: "Wireless Headphones",
                    status: "Shipped",
                    statusClass: "bg-green-100 text-green-700",
                    amount: "1.250.000₫",
                  },
                ].map((order) => (
                  <tr
                    key={order.id}
                    className="group hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 font-mono text-xs text-primary font-bold">
                      {order.id}
                    </td>
                    <td className="py-4 font-semibold text-slate-700">
                      {order.customer}
                    </td>
                    <td className="py-4 text-sm text-slate-500">
                      {order.product}
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 ${order.statusClass} rounded-full text-[10px] font-bold uppercase`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-right font-bold text-slate-800">
                      {order.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 flex justify-between items-center text-slate-400 text-xs font-medium">
        <p>&copy; 2024 CashR. All rights reserved.</p>
        <div className="flex space-x-6">
          <a className="hover:text-primary cursor-pointer">System Status</a>
          <a className="hover:text-primary cursor-pointer">Documentation</a>
          <a className="hover:text-primary cursor-pointer">API Reference</a>
        </div>
      </footer>
    </>
  );
}
