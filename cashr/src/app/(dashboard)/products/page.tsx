export default function ProductsPage() {
  const products = [
    {
      id: "ITM-001",
      name: "iPhone 15 Pro Max",
      sku: "APL-IP15PM-256",
      price: "32.990.000₫",
      stock: 24,
      status: "In Stock",
      statusClass: "bg-emerald-100 text-emerald-700",
      category: "Electronics",
      icon: "smartphone",
    },
    {
      id: "ITM-002",
      name: "Ergonomic Office Chair",
      sku: "FRN-EOC-BLK",
      price: "4.500.000₫",
      stock: 8,
      status: "Low Stock",
      statusClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
      category: "Furniture",
      icon: "chair",
    },
    {
      id: "ITM-003",
      name: "MacBook Air M2",
      sku: "APL-MBA-M2-256",
      price: "28.400.000₫",
      stock: 15,
      status: "In Stock",
      statusClass: "bg-emerald-100 text-emerald-700",
      category: "Electronics",
      icon: "laptop_mac",
    },
    {
      id: "ITM-004",
      name: "Wireless Headphones Pro",
      sku: "AUD-WHP-BLK",
      price: "1.250.000₫",
      stock: 42,
      status: "In Stock",
      statusClass: "bg-emerald-100 text-emerald-700",
      category: "Electronics",
      icon: "headphones",
    },
    {
      id: "ITM-005",
      name: "Ceramic Tea Set Premium",
      sku: "KIT-CTS-WHT",
      price: "680.000₫",
      stock: 0,
      status: "Out of Stock",
      statusClass: "bg-tertiary-container/10 text-tertiary",
      category: "Home & Decor",
      icon: "local_cafe",
    },
    {
      id: "ITM-006",
      name: "Silk Ao Dai Traditional",
      sku: "FSH-SAD-RED",
      price: "2.800.000₫",
      stock: 12,
      status: "In Stock",
      statusClass: "bg-emerald-100 text-emerald-700",
      category: "Fashion",
      icon: "apparel",
    },
  ];

  return (
    <>
      {/* Header */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-2 block">
              Inventory Management
            </span>
            <h2 className="text-4xl font-extrabold text-primary tracking-tight">
              Products & Stock
            </h2>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-lowest text-on-surface-variant font-semibold rounded-lg shadow-sm border border-outline-variant/15 hover:bg-slate-50 transition-all active:scale-95">
              <span className="material-symbols-outlined text-lg">
                filter_list
              </span>
              <span className="text-sm">Filter</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-container transition-all active:scale-95">
              <span className="material-symbols-outlined text-lg">add</span>
              <span className="text-sm">Add Product</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6">
          {[
            {
              label: "Total Products",
              value: "248",
              icon: "inventory_2",
              color: "text-primary",
            },
            {
              label: "In Stock",
              value: "189",
              icon: "check_circle",
              color: "text-emerald-600",
            },
            {
              label: "Low Stock",
              value: "42",
              icon: "warning",
              color: "text-amber-600",
            },
            {
              label: "Out of Stock",
              value: "17",
              icon: "error",
              color: "text-tertiary",
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
            placeholder="Search product name, SKU..."
            type="text"
          />
        </div>
        <select className="bg-surface-container-lowest border-none rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 min-w-[140px] outline-none">
          <option>All Categories</option>
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Home & Decor</option>
          <option>Furniture</option>
        </select>
        <select className="bg-surface-container-lowest border-none rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 min-w-[140px] outline-none">
          <option>All Status</option>
          <option>In Stock</option>
          <option>Low Stock</option>
          <option>Out of Stock</option>
        </select>
      </section>

      {/* Product Table */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-slate-500 text-[11px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">
                          {product.icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">{product.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {product.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-mono text-xs text-slate-600">
                    {product.sku}
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600">
                    {product.category}
                  </td>
                  <td className="px-6 py-5 font-bold text-sm">
                    {product.stock}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`${product.statusClass} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-bold text-slate-900 tracking-tight">
                    {product.price}
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
          <div>Showing 6 of 248 products</div>
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
