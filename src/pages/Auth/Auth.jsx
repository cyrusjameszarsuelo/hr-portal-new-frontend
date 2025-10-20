import React, { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Auth() {
    const navigate = useNavigate();

    useEffect(() => {
        // If already authenticated, redirect to app root.
        const token = localStorage.getItem("access_token");
        if (token) navigate("/", { replace: true });
    }, [navigate]);

    const handleMicrosoftSignIn = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/redirect`;
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left panel */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-32">
                <div className="w-full max-w-max px-6 py-16 md:py-20 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#333333]">Login to MEGANet</h1>
                    <p className="mt-4 text-sm md:text-base text-gray-500">Use your corporate Microsoft 365 account to access your account and protected resources.</p>

                    <p className="mt-8 text-sm text-gray-400">Click the button below to get started.</p>

                    <button
                        type="button"
                        onClick={handleMicrosoftSignIn}
                        className="mt-6 w-full md:w-3/4 inline-flex items-center justify-center gap-3 py-3 md:py-4 px-4 md:px-6 rounded-md bg-[#e93a2e] hover:bg-[#d6352a] text-white mx-auto shadow"
                        aria-label="Login with your Microsoft Account"
                    >
                        {/* Microsoft colored tile */}
                        <span className="w-6 h-6 inline-block flex-shrink-0">
                            <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <rect x="0" y="0" width="11" height="11" fill="#f35325" />
                                <rect x="13" y="0" width="11" height="11" fill="#81bc06" />
                                <rect x="0" y="13" width="11" height="11" fill="#05a6f0" />
                                <rect x="13" y="13" width="11" height="11" fill="#ffba08" />
                            </svg>
                        </span>
                        <span className="font-medium">Login with your Microsoft Account</span>
                    </button>

                    <div className="mt-6 text-sm text-gray-400 px-4 md:px-6">
                        By continuing you agree to the company's Terms of Use and Privacy Policy. Only Microsoft 365 accounts issued by your organization are allowed to sign in.
                    </div>
                </div>
            </div>

                <div
                    className="w-full md:w-1/2 flex-1 min-h-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/src/assets/images/construction-silhouette.jpg')`, backgroundSize: 'cover' }}
                />
        </div>
    );
}