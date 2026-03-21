"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OTPPage() {
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError("Please enter a valid 6-digit code.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token") || "";
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/auth/verify-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    },
                    body: JSON.stringify({
                        otp_code: otp,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Invalid OTP code.");
            }

            // Successfully verified!
            document.cookie = `phone_verified=true; path=/; max-age=86400`;

            const isKycVerified = document.cookie.includes("kyc_verified=true");

            // If successful, retrieve KYC link and redirect conditionally
            const kycLink = localStorage.getItem("kyc_link");
            if (!isKycVerified && kycLink) {
                window.location.href = kycLink;
            } else {
                // Fallback to platform if KYC is already validated or link does not exist
                router.push("/transactions");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred verifying the OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setResendLoading(true);
        setResendMessage("");
        setError("");

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication token missing.");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/auth/resend-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    }
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to resend OTP.");
            }

            setResendMessage(data.message || "OTP resent successfully.");
        } catch (err: any) {
            setError(err.message || "An error occurred resending the OTP.");
        } finally {
            setResendLoading(false);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get("init") === "resend") {
                // Trigger auto-resend on mount because of redirection constraint
                handleResendOTP();
                
                // Clean up URL to prevent loop on arbitrary refresh
                const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                window.history.replaceState({ path: newUrl }, "", newUrl);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-fixed rounded-full blur-[120px] opacity-60 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-fixed rounded-full blur-[100px] opacity-60"></div>

            <div className="w-full max-w-md p-8 glass-panel rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-outline-variant/30 relative z-10 mx-4 transition-all duration-500 ease-in-out text-center">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <span className="material-symbols-outlined text-4xl">mobile_friendly</span>
                    </div>
                    <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2">
                        Verification
                    </h1>
                    <p className="text-on-surface-variant text-sm">
                        We've sent a 6-digit verification code to your phone.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm font-medium text-center">
                            {error}
                        </div>
                    )}
                    {resendMessage && (
                        <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-xl text-green-500 text-sm font-medium text-center">
                            {resendMessage}
                        </div>
                    )}

                    <div className="space-y-4 text-left">
                        <div className="relative group flex justify-center">
                            <input
                                type="text"
                                required
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                className="w-4/5 text-center text-3xl tracking-[1em] pl-[1em] py-4 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface placeholder:text-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 shadow-sm"
                                placeholder="000000"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || otp.length !== 6}
                        className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-on-primary bg-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 shadow-md shadow-primary/20 overflow-hidden"
                    >
                        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-full group-hover:h-56 opacity-10"></span>

                        <div className="flex items-center space-x-2 relative z-10">
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <span>Verify Code</span>
                            )}
                        </div>
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
                    <p className="text-sm text-on-surface-variant flex items-center justify-center space-x-2">
                        <span>Didn't receive a code?</span>
                        {resendLoading ? (
                            <span className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                className="font-semibold text-primary hover:text-primary-container hover:underline transition-all"
                            >
                                Resend now
                            </button>
                        )}
                    </p>
                </div>

            </div>
        </div>
    );
}