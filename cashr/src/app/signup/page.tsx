"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push("/transactions");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-fixed rounded-full blur-[120px] opacity-60 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-fixed rounded-full blur-[100px] opacity-60"></div>

      <div className="w-full max-w-md p-8 glass-panel rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-outline-variant/30 relative z-10 mx-4 transition-all duration-500 ease-in-out">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary text-on-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-4xl">
              account_balance_wallet
            </span>
          </div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2 transition-all">
            Create an account
          </h1>
          <p className="text-on-surface-variant text-sm">
            Sign up to start managing your commerce smartly
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            {/* Phone Number Input */}
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5 ml-1">
                Phone Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline-variant group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </div>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 shadow-sm"
                  placeholder="+84 000 000 000"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1 mr-1">
                <label className="block text-sm font-medium text-on-surface">
                  Password
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline-variant group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">lock_outline</span>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 shadow-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline-variant hover:text-on-surface transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-on-primary bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 shadow-md shadow-primary/20 overflow-hidden"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-full group-hover:h-56 opacity-10"></span>
            
            <div className="flex items-center space-x-2">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span>Create Account</span>
              )}
              {!isLoading && (
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              )}
            </div>
          </button>
        </form>

        {/* Link to Login */}
        <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
          <p className="text-sm text-on-surface-variant flex items-center justify-center space-x-2">
            <span>Already have an account?</span>
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary-container hover:underline transition-all"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
