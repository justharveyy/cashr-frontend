export default function CustomersPage() {
  const customers = [
    {
      id: "USR-001",
      name: "Nguyen Lan",
      initials: "NL",
      phone: "090 123 4567",
      email: "lan.nguyen@email.com",
      orders: 12,
      totalSpend: "14.200.000₫",
      status: "Verified",
      statusClass: "bg-emerald-50 text-emerald-700",
      lastOrder: "Mar 21, 2026",
    },
    {
      id: "USR-002",
      name: "Tran Hoang",
      initials: "TH",
      phone: "091 987 6543",
      email: "hoang.tran@email.com",
      orders: 8,
      totalSpend: "8.500.000₫",
      status: "Verified",
      statusClass: "bg-emerald-50 text-emerald-700",
      lastOrder: "Mar 20, 2026",
    },
    {
      id: "USR-003",
      name: "Phan Minh Anh",
      initials: "PM",
      phone: "097 555 1234",
      email: "anh.phan@email.com",
      orders: 24,
      totalSpend: "42.800.000₫",
      status: "VIP",
      statusClass: "bg-blue-50 text-blue-700",
      lastOrder: "Mar 21, 2026",
    },
    {
      id: "USR-004",
      name: "Le Quoc Huy",
      initials: "LH",
      phone: "098 222 3344",
      email: "huy.le@email.com",
      orders: 3,
      totalSpend: "2.100.000₫",
      status: "New",
      statusClass: "bg-slate-100 text-slate-600",
      lastOrder: "Mar 19, 2026",
    },
    {
      id: "USR-005",
      name: "Vo Thanh Mai",
      initials: "VM",
      phone: "093 444 5566",
      email: "mai.vo@email.com",
      orders: 6,
      totalSpend: "5.400.000₫",
      status: "Verified",
      statusClass: "bg-emerald-50 text-emerald-700",
      lastOrder: "Mar 18, 2026",
    },
    {
      id: "USR-006",
      name: "Bui Thanh",
      initials: "BT",
      phone: "096 777 8899",
      email: "thanh.bui@email.com",
      orders: 1,
      totalSpend: "450.000₫",
      status: "Pending KYC",
      statusClass: "bg-amber-50 text-amber-700",
      lastOrder: "Mar 17, 2026",
    },
  ];

  return (
    <>
      {/* Header */}
      <section className="mb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
              Customer Relationship
            </p>
            <h2 className="text-2xl font-bold text-on-surface">
              Customers
            </h2>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm">
              <span className="material-symbols-outlined text-lg">
                download
              </span>
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-container transition-colors text-sm">
              <span className="material-symbols-outlined text-lg">
                person_add
              </span>
              Add Customer
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              label: "Total Customers",
              value: "1,842",
              icon: "group",
              color: "text-primary",
            },
            {
              label: "Verified",
              value: "1,456",
              icon: "verified",
              color: "text-emerald-600",
            },
            {
              label: "VIP Members",
              value: "128",
              icon: "star",
              color: "text-amber-600",
            },
            {
              label: "New This Month",
              value: "64",
              icon: "person_add",
              color: "text-blue-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-5 rounded-lg border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`material-symbols-outlined ${stat.color} text-xl`}
                >
                  {stat.icon}
                </span>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <p className="text-2xl font-bold text-on-surface">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Search */}
      <section className="bg-white p-4 rounded-lg flex items-center gap-3 mb-6 border border-slate-200">
        <div className="relative flex-grow max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            search
          </span>
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 placeholder:text-slate-400 outline-none"
            placeholder="Search customer name, phone, email..."
            type="text"
          />
        </div>
        <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 min-w-[120px] outline-none">
          <option>All Status</option>
          <option>Verified</option>
          <option>VIP</option>
          <option>New</option>
          <option>Pending KYC</option>
        </select>
      </section>

      {/* Customer Table */}
      <section className="bg-white rounded-lg overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Orders</th>
                <th className="px-5 py-3">Total Spend</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Last Order</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {customers.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-500">
                        {c.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{c.name}</p>
                        <p className="text-[10px] text-slate-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">
                    {c.phone}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-sm">{c.orders}</td>
                  <td className="px-5 py-3.5 font-medium text-sm text-on-surface">
                    {c.totalSpend}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`${c.statusClass} px-2 py-0.5 rounded text-[10px] font-semibold`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">
                    {c.lastOrder}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="text-slate-300 hover:text-slate-500 transition-colors">
                      <span className="material-symbols-outlined text-xl">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
          <div>Showing 6 of 1,842 customers</div>
          <div className="flex gap-1">
            <button
              className="px-2.5 py-1 border border-slate-200 rounded text-slate-300"
              disabled
            >
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>
            <button className="px-2.5 py-1 bg-primary text-white rounded text-xs font-medium">
              1
            </button>
            <button className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-50">
              2
            </button>
            <button className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-50">
              3
            </button>
            <button className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-50">
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
