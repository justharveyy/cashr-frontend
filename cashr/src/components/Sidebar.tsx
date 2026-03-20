"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "dashboard", label: "Dashboard" },
  { href: "/orders", icon: "shopping_cart", label: "Orders" },
  { href: "/products", icon: "inventory_2", label: "Products" },
  { href: "/customers", icon: "group", label: "Customers" },
  { href: "/messages", icon: "chat", label: "Messages" },
  { href: "/transactions", icon: "receipt_long", label: "Transactions" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] z-50 bg-slate-200 flex flex-col py-8 px-6 space-y-4 tracking-tight">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-primary mb-2">CashR</h1>
        <p className="text-slate-500 text-sm">Smart Commerce</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "text-primary font-bold border-r-4 border-primary bg-white"
                  : "text-slate-600 hover:text-primary hover:bg-slate-100"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={
                  isActive
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        href="/new-transaction"
        className="w-full py-4 bg-primary text-on-primary rounded-xl font-semibold shadow-sm active:scale-95 transition-transform duration-150 flex items-center justify-center space-x-2"
      >
        <span className="material-symbols-outlined text-sm">add</span>
        <span>New Transaction</span>
      </Link>

      <div className="pt-6 border-t border-slate-300 space-y-1">
        <a className="flex items-center space-x-3 px-4 py-2 text-slate-500 hover:text-primary transition-colors text-sm cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">
            settings
          </span>
          <span>Settings</span>
        </a>
        <a className="flex items-center space-x-3 px-4 py-2 text-slate-500 hover:text-primary transition-colors text-sm cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">
            contact_support
          </span>
          <span>Support</span>
        </a>
      </div>
    </aside>
  );
}
