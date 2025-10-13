import React, { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Auth() {
    const navigate = useNavigate();

    useEffect(() => {
        // Assumption: authentication state is represented by a token in localStorage or sessionStorage.
        // Adjust keys to match your backend (e.g. 'access_token', 'token', 'ms365_token').
        const token =
            localStorage.getItem("access_token");

        if (token) {
            // If the user is already authenticated, redirect to the app root.
            navigate("/", { replace: true });
        }
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#231F20]">
            <div className="w-full max-w-md mx-4 p-8 rounded-lg shadow-lg bg-[#2b2c2b] text-[#dcdbdb]">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold">Welcome to HR Portal</h1>
                    <p className="mt-2 text-sm text-[#dcdbdb]/80">Sign in with your Microsoft 365 account</p>
                </div>

                <button
                    type="button"
                    onClick={() => (window.location.href = "http://localhost:8000/api/auth/redirect")}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-md bg-[#ee3124] hover:bg-[#d22a1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ee3124]/50 transition-colors"
                    aria-label="Sign in with Microsoft 365"
                >
                    <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <rect x="1" y="1" width="10" height="10" fill="#fff" />
                        <rect x="13" y="1" width="10" height="10" fill="#f2f2f2" />
                        <rect x="1" y="13" width="10" height="10" fill="#bfbfbf" />
                        <rect x="13" y="13" width="10" height="10" fill="#737373" />
                    </svg>
                    <span className="font-medium">Sign in with Microsoft 365</span>
                </button>

                <p className="mt-4 text-xs text-[#dcdbdb]/60 text-center">
                    Use your corporate Microsoft 365 account to access the portal.
                </p>
            </div>
        </div>
    );
}