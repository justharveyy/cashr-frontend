export default function ProductsPage() {
  const products = [
    {
      id: "ITM-001",
      name: "iPhone 15 Pro Max",
      sku: "APL-IP15PM-256",
      price: "32.990.000₫",
      stock: 24,
      status: "In Stock",
      statusClass: "bg-emerald-50 text-emerald-700",
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
      statusClass: "bg-amber-50 text-amber-700",
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
      statusClass: "bg-emerald-50 text-emerald-700",
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
      statusClass: "bg-emerald-50 text-emerald-700",
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
      statusClass: "bg-red-50 text-red-700",
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
      statusClass: "bg-emerald-50 text-emerald-700",
      category: "Fashion",
      icon: "apparel",
    },
  ];

  return (
    <>
      {/* Header */}
      <section className="mb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
              Inventory Management
            </p>
            <h2 className="text-2xl font-bold text-on-surface">
              Products & Stock
            </h2>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm">
              <span className="material-symbols-outlined text-lg">
                filter_list
              </span>
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-container transition-colors text-sm">
              <span className="material-symbols-outlined text-lg">add</span>
              Add Product
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4">
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
              color: "text-red-600",
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
            placeholder="Search product name, SKU..."
            type="text"
          />
        </div>
        <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 min-w-[120px] outline-none">
          <option>All Categories</option>
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Home & Decor</option>
          <option>Furniture</option>
        </select>
        <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 min-w-[120px] outline-none">
          <option>All Status</option>
          <option>In Stock</option>
          <option>Low Stock</option>
          <option>Out of Stock</option>
        </select>
      </section>

      {/* Product Table */}
      <section className="bg-white rounded-lg overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Price</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                        <span className="material-symbols-outlined text-lg">
                          {product.icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {product.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-500">
                    {product.sku}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">
                    {product.category}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-sm">
                    {product.stock}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`${product.statusClass} px-2 py-0.5 rounded text-[10px] font-semibold`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium text-sm text-on-surface">
                    {product.price}
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
          <div>Showing 6 of 248 products</div>
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
