import { Outlet, Navigate } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import React from "react";

export default function RootLayout() {
    // Simple client-side guard: check for access_token in localStorage
    // This prevents rendering RootLayout children when not authenticated.
    // For production, validate tokens on the server and use httpOnly cookies.
    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null;

    if (!token) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="lg:px-8 lg:py-8 flex-1 bg-[#f2eeef]">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}
