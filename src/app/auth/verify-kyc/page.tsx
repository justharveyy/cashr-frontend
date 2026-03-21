"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function VerifyKycContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(errorParam);
    } else {
      router.push("/transactions");
    }
  }, [searchParams, router]);

  return (
    <div className="w-full max-w-md p-8 glass-panel rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-outline-variant/30 relative z-10 mx-4 text-center">
      {error ? (
        <div>
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl">error</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface mb-4">
            KYC Verification Failed
          </h1>
          <p className="text-on-surface-variant mb-8">
            Reason: {error}
          </p>
          <Link
            href="/login"
            className="px-6 py-3 bg-primary text-on-primary font-semibold rounded-xl hover:bg-primary-container transition-all"
          >
            Return to Login
          </Link>
        </div>
      ) : (
        <div>
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl animate-spin">sync</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface mb-2">
            Verifying...
          </h1>
        </div>
      )}
    </div>
  );
}

export default function VerifyKycPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-fixed rounded-full blur-[120px] opacity-60 animate-pulse"></div>
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyKycContent />
      </Suspense>
    </div>
  );
}
