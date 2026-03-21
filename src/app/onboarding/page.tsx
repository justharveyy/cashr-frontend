"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const TOTAL_STEPS = 3;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getToken() {
  return localStorage.getItem("token") || "";
}

// ─── Step Progress Dots ───────────────────────────────────────────────────────
function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center space-x-2 mb-8">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i === current
              ? "w-8 bg-primary"
              : i < current
              ? "w-2 bg-primary/40"
              : "w-2 bg-outline-variant"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Shared: Primary Button ───────────────────────────────────────────────────
function PrimaryButton({
  type = "submit",
  isLoading,
  disabled,
  onClick,
  children,
}: {
  type?: "submit" | "button";
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      onClick={onClick}
      className="group relative w-full flex justify-center items-center space-x-2 py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-on-primary bg-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 shadow-md shadow-primary/20 overflow-hidden"
    >
      <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-full group-hover:h-56 opacity-10" />
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      ) : (
        <span className="relative z-10 flex items-center space-x-2">{children}</span>
      )}
    </button>
  );
}

// ─── Shared: Error/Success Banner ─────────────────────────────────────────────
function Banner({ type, message }: { type: "error" | "success"; message: string }) {
  const styles =
    type === "error"
      ? "bg-red-500/10 border-red-500/50 text-red-500"
      : "bg-green-500/10 border-green-500/50 text-green-600";
  return (
    <div className={`p-3 border rounded-xl text-sm font-medium text-center ${styles}`}>
      {message}
    </div>
  );
}

// ─── Shared: Labeled Text Input ───────────────────────────────────────────────
function TextInput({
  label,
  hint,
  icon,
  value,
  onChange,
  type = "text",
  required = true,
  placeholder,
  mono,
}: {
  label: string;
  hint?: string;
  icon: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-on-surface mb-1.5 ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline-variant group-focus-within:text-primary transition-colors">
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-11 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 shadow-sm ${mono ? "font-mono text-sm" : ""}`}
        />
      </div>
      {hint && <p className="text-xs text-on-surface-variant mt-1.5 ml-1">{hint}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1: Store Details
// POST /store/create  { store_name, store_address, main_phone_number }
// Requires: kyc_required=True
// ─────────────────────────────────────────────────────────────────────────────
function StepStoreDetails({ onNext }: { onNext: (storeId: string) => void }) {
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [mainPhone, setMainPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/store/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: getToken() },
        body: JSON.stringify({
          store_name: storeName.trim(),
          store_address: storeAddress.trim(),
          main_phone_number: mainPhone.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to create store.");
      localStorage.setItem("onboarding_store_id", data.store_id);
      onNext(data.store_id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <span className="material-symbols-outlined text-4xl">storefront</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface mb-1">Set up your store</h1>
        <p className="text-on-surface-variant text-sm">Tell us the basics about your business.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Banner type="error" message={error} />}

        <TextInput
          label="Store Name"
          icon="badge"
          value={storeName}
          onChange={setStoreName}
          placeholder="My Awesome Store"
        />
        <TextInput
          label="Store Address"
          icon="location_on"
          value={storeAddress}
          onChange={setStoreAddress}
          placeholder="123 Commerce Street, Ho Chi Minh City"
        />
        <TextInput
          label="Store Phone Number"
          icon="call"
          type="tel"
          value={mainPhone}
          onChange={setMainPhone}
          placeholder="+84 000 000 000"
        />

        <PrimaryButton isLoading={isLoading}>
          <span>Continue</span>
          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </PrimaryButton>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2: Zalo Bot Token
// POST /store/manage/<store_id>/zalobot-key  { zalo_bot_token }
// Requires: kyc_required=True
// ─────────────────────────────────────────────────────────────────────────────
function StepZaloBot({
  storeId,
  onNext,
  onSkip,
}: {
  storeId: string;
  onNext: () => void;
  onSkip: () => void;
}) {
  const [zaloToken, setZaloToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/store/manage/${storeId}/zalobot-key`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: getToken() },
        body: JSON.stringify({ zalo_bot_token: zaloToken.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to save Zalo Bot token.");
      onNext();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <span className="material-symbols-outlined text-4xl">smart_toy</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface mb-1">Connect your Zalo Bot</h1>
        <p className="text-on-surface-variant text-sm">
          Paste your Zalo Bot API token to enable chat-based ordering. The token will be validated and
          webhooks configured automatically.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Banner type="error" message={error} />}

        <TextInput
          label="Zalo Bot Token"
          icon="key"
          value={zaloToken}
          onChange={setZaloToken}
          placeholder="AABBCCDD:xxxxxxxxxxxxxxxxxxxxxxxx"
          mono
          hint="Find this in your Zalo Official Account > Bot Settings."
        />

        <PrimaryButton isLoading={isLoading}>
          <span>Save & Continue</span>
          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </PrimaryButton>

        <button
          type="button"
          onClick={onSkip}
          className="w-full py-2.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
        >
          Skip for now
        </button>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3: Add Products (info / skip)
// No API call — sends user to the Products section of the dashboard.
// ─────────────────────────────────────────────────────────────────────────────
function StepAddProducts({ onFinish }: { onFinish: () => void }) {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <span className="material-symbols-outlined text-4xl">inventory_2</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface mb-1">Add your first product</h1>
        <p className="text-on-surface-variant text-sm">
          Build your catalog so customers can browse and order. You can add as many as you like later.
        </p>
      </div>

      {/* Empty-state illustration */}
      <div className="border-2 border-dashed border-outline-variant/60 rounded-2xl p-8 text-center mb-6 bg-surface-container-lowest/50">
        <span className="material-symbols-outlined text-5xl text-outline-variant mb-3 block">add_box</span>
        <p className="text-sm font-semibold text-on-surface mb-1">No products yet</p>
        <p className="text-xs text-on-surface-variant">
          Head to the <span className="font-medium text-primary">Products</span> section in your dashboard
          to start adding items.
        </p>
      </div>

      <PrimaryButton type="button" onClick={onFinish}>
        <span className="material-symbols-outlined text-[18px]">check_circle</span>
        <span>Go to Dashboard</span>
      </PrimaryButton>

      <button
        type="button"
        onClick={onFinish}
        className="w-full py-2.5 mt-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
      >
        I&apos;ll add products later
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [storeId, setStoreId] = useState("");

  const handleFinish = () => {
    localStorage.removeItem("onboarding_store_id");
    router.push("/transactions");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-fixed rounded-full blur-[120px] opacity-50 animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-fixed rounded-full blur-[100px] opacity-50 pointer-events-none" />

      <div className="w-full max-w-md p-8 glass-panel rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-outline-variant/30 relative z-10 mx-4">
        <StepDots current={step} />

        {step === 0 && (
          <StepStoreDetails
            onNext={(id) => {
              setStoreId(id);
              setStep(1);
            }}
          />
        )}
        {step === 1 && (
          <StepZaloBot
            storeId={storeId}
            onNext={() => setStep(2)}
            onSkip={() => setStep(2)}
          />
        )}
        {step === 2 && <StepAddProducts onFinish={handleFinish} />}
      </div>
    </div>
  );
}
