"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary-fixed rounded-full blur-[140px] opacity-40 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary-fixed rounded-full blur-[120px] opacity-40 pointer-events-none"></div>

      {/* Header/Nav */}
      <nav className="w-full relative z-20 top-0 border-b border-outline-variant/20 glass-panel">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary text-on-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[24px]">
                account_balance_wallet
              </span>
            </div>
            <span className="text-xl font-bold text-on-surface tracking-tight">
              CashR
            </span>
          </div>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <div className="h-6 w-px bg-outline-variant/40"></div>
            <Link
              href="/login"
              className="text-sm font-semibold text-primary hover:text-primary-container transition-colors"
            >
              Log in
            </Link>
            <button
              onClick={() => router.push("/signup")}
              className="px-5 py-2.5 bg-primary text-on-primary text-sm font-semibold rounded-xl hover:bg-primary-container transition-all shadow-md shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-0.5"
            >
              Sign up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-6 pt-32 pb-24 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/30 mb-8 max-w-fit mx-auto cursor-pointer hover:bg-surface-container-high transition-colors">
          <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold tracking-wider uppercase">
            New
          </span>
          <span className="text-xs font-medium text-on-surface-variant">
            Introducing AI-powered analytics →
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-on-surface tracking-tight max-w-4xl mx-auto leading-[1.15] mb-6">
          Smart Commerce Platform for <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Modern Business</span>
        </h1>
        
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
          Manage transactions, track multi-channel analytics, and grow your revenue seamlessly with our next-generation unified dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => router.push("/signup")}
            className="w-full sm:w-auto px-8 py-4 bg-primary text-on-primary text-base font-semibold rounded-2xl flex items-center justify-center space-x-2 hover:bg-primary-container transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 group"
          >
            <span>Start for free</span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("features");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-8 py-4 bg-surface-container-lowest border border-outline-variant text-on-surface text-base font-semibold rounded-2xl flex items-center justify-center hover:bg-surface-container transition-all"
          >
            See how it works
          </button>
        </div>

        {/* Dashboard Mockup Preview */}
        <div className="w-full max-w-5xl mx-auto mt-24 relative rounded-t-3xl overflow-hidden glass-panel border border-outline-variant/50 border-b-0 p-4 pb-0 shadow-2xl">
          <div className="w-full rounded-t-2xl bg-surface-container-low border border-outline-variant/20 border-b-0 h-[400px] flex items-center justify-center relative overflow-hidden">
             {/* Mockup UI Elements */}
             <div className="absolute top-4 left-4 right-4 h-12 flex space-x-4">
               <div className="h-full w-1/4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20"></div>
               <div className="h-full w-1/4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20"></div>
               <div className="h-full w-1/4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20"></div>
               <div className="h-full w-1/4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20"></div>
             </div>
             <div className="absolute top-20 left-4 right-4 bottom-0 flex space-x-4">
               <div className="h-full w-2/3 bg-surface-container-lowest rounded-t-xl shadow-sm border border-outline-variant/20 border-b-0 flex items-end justify-center pb-4">
                 <div className="w-[90%] h-[70%] bg-primary-fixed/30 rounded-lg flex items-end justify-between px-4 pb-0 space-x-2">
                    {/* Fake Chart Bars */}
                    {[40, 70, 45, 90, 65, 80, 50, 85].map((h, i) => (
                      <div key={i} className="w-full bg-primary rounded-t-sm" style={{ height: `${h}%` }}></div>
                    ))}
                 </div>
               </div>
               <div className="h-full w-1/3 bg-surface-container-lowest rounded-t-xl shadow-sm border border-outline-variant/20 border-b-0"></div>
             </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 bg-surface-container-lowest relative z-10 border-t border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">
              Everything you need to scale
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              Our tools are designed to remove friction from your daily operations so you can focus on building your brand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-surface border border-outline-variant/30 transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined">monitoring</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-3">Live Analytics</h3>
              <p className="text-on-surface-variant leading-relaxed text-sm">
                Get real-time insights into your store's performance. Monitor sales, traffic, and conversion rates seamlessly.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-surface border border-outline-variant/30 transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-tertiary-container text-on-tertiary-container rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-3">Fast Payouts</h3>
              <p className="text-on-surface-variant leading-relaxed text-sm">
                Receive your funds faster with our optimized routing network. Manage all your transactions with total confidence.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-surface border border-outline-variant/30 transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined">security</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-3">Bank-grade Security</h3>
              <p className="text-on-surface-variant leading-relaxed text-sm">
                We protect your data with end-to-end encryption and adhere to the highest compliance standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-surface text-center border-t border-outline-variant/30 relative z-10">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-6 h-6 bg-primary text-on-primary rounded-md flex items-center justify-center">
             <span className="material-symbols-outlined text-[14px]">
               account_balance_wallet
             </span>
          </div>
          <span className="font-bold text-on-surface text-lg tracking-tight">
            CashR
          </span>
        </div>
        <p className="text-on-surface-variant text-sm font-medium">
          © {new Date().getFullYear()} CashR Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
