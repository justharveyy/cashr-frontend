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
      statusClass: "bg-emerald-100 text-emerald-700",
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
      statusClass: "bg-emerald-100 text-emerald-700",
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
      statusClass: "bg-primary-fixed text-primary",
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
      statusClass: "bg-secondary-fixed text-on-secondary-fixed",
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
      statusClass: "bg-emerald-100 text-emerald-700",
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
      statusClass: "bg-amber-100 text-amber-700",
      lastOrder: "Mar 17, 2026",
    },
  ];

  return (
    <>
      {/* Header */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-2 block">
              Customer Relationship
            </span>
            <h2 className="text-4xl font-extrabold text-primary tracking-tight">
              Customers
            </h2>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-lowest text-on-surface-variant font-semibold rounded-lg shadow-sm border border-outline-variant/15 hover:bg-slate-50 transition-all active:scale-95">
              <span className="material-symbols-outlined text-lg">
                download
              </span>
              <span className="text-sm">Export</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-container transition-all active:scale-95">
              <span className="material-symbols-outlined text-lg">
                person_add
              </span>
              <span className="text-sm">Add Customer</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
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
              color: "text-secondary",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`material-symbols-outlined ${stat.color} text-xl`}
                >
                  {stat.icon}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <p className="text-3xl font-extrabold text-on-surface">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Search */}
      <section className="bg-surface-container-low p-5 rounded-xl flex items-center gap-4 mb-8">
        <div className="relative flex-grow max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            search
          </span>
          <input
            className="w-full bg-surface-container-lowest border-none rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 outline-none"
            placeholder="Search customer name, phone, email..."
            type="text"
          />
        </div>
        <select className="bg-surface-container-lowest border-none rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 min-w-[140px] outline-none">
          <option>All Status</option>
          <option>Verified</option>
          <option>VIP</option>
          <option>New</option>
          <option>Pending KYC</option>
        </select>
      </section>

      {/* Customer Table */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-slate-500 text-[11px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Total Spend</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Order</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {customers.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-xs font-bold text-primary">
                        {c.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{c.name}</p>
                        <p className="text-[10px] text-slate-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600">
                    {c.phone}
                  </td>
                  <td className="px-6 py-5 font-bold text-sm">{c.orders}</td>
                  <td className="px-6 py-5 font-bold text-sm text-on-surface">
                    {c.totalSpend}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`${c.statusClass} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600">
                    {c.lastOrder}
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
          <div>Showing 6 of 1,842 customers</div>
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
    </>
  );
}
