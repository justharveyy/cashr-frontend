"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, stores, activeStoreId, setActiveStoreId, isLoading } = useAuth();

  const activeStore = stores.find((s) => s.store_id === activeStoreId);

  const switchStoreAndNavigate = (nextStoreId: string) => {
    setActiveStoreId(nextStoreId);

    // Keep user on the same dashboard section when switching stores.
    const parts = pathname.split("/").filter(Boolean); // ["store", "{store_id}", "{section}", ...]
    const section = parts[2] || "dashboard";
    router.push(`/store/${nextStoreId}/${section}`);
  };

  const navItems = [
    { href: `/store/${activeStoreId}/dashboard`, icon: "dashboard", label: "Dashboard" },
    { href: `/store/${activeStoreId}/orders`, icon: "shopping_cart", label: "Orders" },
    { href: `/store/${activeStoreId}/products`, icon: "inventory_2", label: "Products" },
    { href: `/store/${activeStoreId}/customers`, icon: "group", label: "Customers" },
    { href: `/store/${activeStoreId}/messages`, icon: "chat", label: "Messages" },
    { href: `/store/${activeStoreId}/transactions`, icon: "receipt_long", label: "Transactions" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("kyc_link");
    localStorage.removeItem("active_store_id");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "phone_verified=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "kyc_verified=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "kyc_link=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] z-50 bg-white border-r border-slate-200 flex flex-col py-6 px-4 tracking-tight">

      {/* Brand */}
      <div className="mb-5 px-3">
        <h1 className="text-xl font-bold text-primary">CashR</h1>
        <p className="text-slate-400 text-xs mt-0.5">Smart Commerce</p>
      </div>

      {/* Store Switcher */}
      <div className="mb-4 px-1">
        {isLoading ? (
          <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
        ) : stores.length === 0 ? (
          <Link
            href="/onboarding"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-dashed border-primary/40 text-primary text-sm hover:bg-primary/5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add_business</span>
            <span className="font-medium">Create a store</span>
          </Link>
        ) : (
          <div className="relative">
            <select
              value={activeStoreId || ""}
              onChange={(e) => switchStoreAndNavigate(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer pr-8"
            >
              {stores.map((s) => (
                <option key={s.store_id} value={s.store_id}>
                  {s.store_name}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined text-[16px] text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              unfold_more
            </span>
          </div>
        )}
      </div>

      {/* Nav Links */}
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
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${isActive
                  ? "text-primary font-semibold bg-primary/5"
                  : "text-slate-600 hover:text-on-surface hover:bg-slate-50"
                }`}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* New Transaction CTA */}
      <Link
        href="/new-transaction"
        className="w-full py-2.5 bg-primary text-on-primary rounded-lg font-medium text-sm flex items-center justify-center space-x-2 hover:bg-primary-container transition-colors"
      >
        <span className="material-symbols-outlined text-sm">add</span>
        <span>New Transaction</span>
      </Link>

      {/* User Profile + Footer Links */}
      <div className="pt-4 mt-4 border-t border-slate-100 space-y-0.5">
        {/* User info */}
        {isLoading ? (
          <div className="flex items-center space-x-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-slate-100 rounded animate-pulse w-3/4" />
              <div className="h-2.5 bg-slate-100 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ) : user ? (
          <div className="flex items-center space-x-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
              {user.fullname?.charAt(0).toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface truncate">{user.fullname}</p>
              <p className="text-xs text-slate-400 truncate">{user.phone_number}</p>
            </div>
          </div>
        ) : null}

        <a className="flex items-center space-x-3 px-3 py-2 text-slate-500 hover:text-on-surface hover:bg-slate-50 rounded-lg transition-colors text-sm cursor-pointer">
          <span className="material-symbols-outlined text-xl">settings</span>
          <span>Settings</span>
        </a>
        <a className="flex items-center space-x-3 px-3 py-2 text-slate-500 hover:text-on-surface hover:bg-slate-50 rounded-lg transition-colors text-sm cursor-pointer">
          <span className="material-symbols-outlined text-xl">contact_support</span>
          <span>Support</span>
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm cursor-pointer rounded-lg mt-1"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
