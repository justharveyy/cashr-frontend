"use client";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 z-40 w-[calc(100%-280px)] bg-white flex items-center justify-between px-8 h-14 border-b border-slate-200 antialiased">
      {/* <div className="flex items-center space-x-4">
        <div className="relative w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">
            search
          </span>
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
            placeholder="Search..."
            type="text"
          />
        </div>
      </div> */}

      <div className="flex items-center space-x-4">
        {/* <div className="flex items-center space-x-1 text-slate-500">
          <button className="hover:bg-slate-100 transition-colors p-2 rounded-lg">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>
          <button className="hover:bg-slate-100 transition-colors p-2 rounded-lg">
            <span className="material-symbols-outlined text-xl">help</span>
          </button>
          <button className="hover:bg-slate-100 transition-colors p-2 rounded-lg">
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </div> */}

        <div className="h-8 w-[1px] bg-slate-200" />

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-xs font-semibold text-on-surface">CashR Pro</p>
            <p className="text-[10px] text-slate-500">Premium Store</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary font-semibold text-xs border border-slate-200">
            TN
          </div>
        </div>
      </div>
    </header>
  );
}
