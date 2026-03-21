"use client";

import Link from "next/link";
import { useAuth, StoreEntry } from "@/context/AuthContext";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-xl bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-100 rounded w-3/4" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-2/3" />
      </div>
      <div className="h-9 bg-slate-100 rounded-xl" />
    </div>
  );
}

// ─── Store Card ───────────────────────────────────────────────────────────────
function StoreCard({ store }: { store: StoreEntry }) {
  const botConnected = !!store.zalo_bot_id;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
      {/* Card Header */}
      <div className="p-6 flex items-start space-x-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold shrink-0">
          {getInitials(store.store_name)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <h2 className="text-base font-bold text-on-surface truncate">{store.store_name}</h2>
            <span
              className={`inline-flex items-center space-x-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                botConnected
                  ? "bg-green-500/10 text-green-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${botConnected ? "bg-green-500" : "bg-slate-400"}`} />
              <span>{botConnected ? "Zalo Bot Connected" : "No Zalo Bot"}</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Created {formatDate(store.created_at)}</p>
        </div>
      </div>

      <div className="h-px bg-slate-50 mx-6" />

      {/* Details */}
      <div className="px-6 py-4 space-y-2.5 flex-1">
        {store.store_address && (
          <div className="flex items-start space-x-2.5 text-sm text-slate-600">
            <span className="material-symbols-outlined text-[16px] text-slate-400 mt-0.5 shrink-0">location_on</span>
            <span className="leading-snug">{store.store_address}</span>
          </div>
        )}
        <div className="flex items-center space-x-2.5 text-sm text-slate-600">
          <span className="material-symbols-outlined text-[16px] text-slate-400 shrink-0">call</span>
          <span>{store.store_main_phone_number || "—"}</span>
        </div>
        {botConnected && (
          <div className="flex items-center space-x-2.5 text-sm text-slate-600">
            <span className="material-symbols-outlined text-[16px] text-slate-400 shrink-0">smart_toy</span>
            <span className="font-mono text-xs text-slate-500 truncate">Bot ID: {store.zalo_bot_id}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 pb-5 pt-2 flex items-center space-x-2">
        <Link
          href={`/store/${store.store_id}`}
          className="flex-1 text-center py-2 text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors"
        >
          Manage
        </Link>
        <Link
          href={`/products?store=${store.store_id}`}
          className="flex-1 text-center py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
        >
          Products
        </Link>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center mb-5">
        <span className="material-symbols-outlined text-5xl text-primary/40">storefront</span>
      </div>
      <h3 className="text-lg font-bold text-on-surface mb-2">No stores yet</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-6">
        Create your first store to start managing orders, products, and customers.
      </p>
      <Link
        href="/onboarding"
        className="inline-flex items-center space-x-2 px-5 py-2.5 bg-primary text-on-primary text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 hover:bg-primary-container transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">add_business</span>
        <span>Create a Store</span>
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StorePage() {
  const { user, stores, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 px-8 h-16 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-on-surface leading-tight">Your Stores</h1>
          <p className="text-xs text-slate-400">
            {isLoading
              ? "Loading..."
              : stores.length > 0
              ? `${stores.length} store${stores.length !== 1 ? "s" : ""}`
              : "No stores yet"}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/onboarding"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-on-primary text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 hover:bg-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Store</span>
          </Link>

          <div className="h-8 w-px bg-slate-200" />

          {/* User Avatar */}
          {user ? (
            <div className="flex items-center space-x-2.5">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-on-surface leading-tight">{user.fullname}</p>
                <p className="text-[10px] text-slate-400">{user.phone_number}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold ring-2 ring-primary/10">
                {user.fullname?.charAt(0).toUpperCase() || "?"}
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-100 animate-pulse" />
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : stores.length === 0 ? (
            <EmptyState />
          ) : (
            stores.map((store) => <StoreCard key={store.store_id} store={store} />)
          )}
        </div>
      </main>
    </div>
  );
}
