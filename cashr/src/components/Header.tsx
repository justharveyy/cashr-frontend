"use client";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 z-40 w-[calc(100%-280px)] bg-white/80 backdrop-blur-xl flex items-center justify-between px-8 h-16 shadow-sm antialiased">
      <div className="flex items-center space-x-4">
        <div className="relative w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">
            search
          </span>
          <input
            className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="Search data..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4 text-slate-500">
          <button className="hover:bg-slate-50 transition-colors p-2 rounded-full active:scale-95 duration-200">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="hover:bg-slate-50 transition-colors p-2 rounded-full active:scale-95 duration-200">
            <span className="material-symbols-outlined">help</span>
          </button>
          <button className="hover:bg-slate-50 transition-colors p-2 rounded-full active:scale-95 duration-200">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>

        <div className="h-8 w-[1px] bg-slate-200" />

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-xs font-bold text-on-surface">CashR Pro</p>
            <p className="text-[10px] text-slate-500">Premium Store</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm ring-2 ring-primary/10">
            TN
          </div>
        </div>
      </div>
    </header>
  );
}
