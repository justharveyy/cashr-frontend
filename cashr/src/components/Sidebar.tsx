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
    <aside className="fixed left-0 top-0 h-screen w-[280px] z-50 bg-white border-r border-slate-200 flex flex-col py-6 px-4 tracking-tight">
      <div className="mb-6 px-3">
        <h1 className="text-xl font-bold text-primary">CashR</h1>
        <p className="text-slate-400 text-xs mt-0.5">Smart Commerce</p>
      </div>

      <nav className="flex-1 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                isActive
                  ? "text-primary font-semibold bg-primary/5"
                  : "text-slate-600 hover:text-on-surface hover:bg-slate-50"
              }`}
            >
              <span
                className="material-symbols-outlined text-xl"
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
        className="w-full py-2.5 bg-primary text-on-primary rounded-lg font-medium text-sm flex items-center justify-center space-x-2 hover:bg-primary-container transition-colors"
      >
        <span className="material-symbols-outlined text-sm">add</span>
        <span>New Transaction</span>
      </Link>

      <div className="pt-4 mt-4 border-t border-slate-100 space-y-0.5">
        <a className="flex items-center space-x-3 px-3 py-2 text-slate-500 hover:text-on-surface hover:bg-slate-50 rounded-lg transition-colors text-sm cursor-pointer">
          <span className="material-symbols-outlined text-xl">settings</span>
          <span>Settings</span>
        </a>
        <a className="flex items-center space-x-3 px-3 py-2 text-slate-500 hover:text-on-surface hover:bg-slate-50 rounded-lg transition-colors text-sm cursor-pointer">
          <span className="material-symbols-outlined text-xl">
            contact_support
          </span>
          <span>Support</span>
        </a>
      </div>
    </aside>
  );
}
