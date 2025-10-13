import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function LoginSuccess() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      try {
        localStorage.setItem("access_token", token);
        setStatus("success");
        // small delay so user sees the spinner success state briefly
        setTimeout(() => navigate("/", { replace: true }), 600);
      } catch (err) {
        console.error("Failed to save token:", err);
        setStatus("error");
        setTimeout(() => navigate("/auth", { replace: true }), 1200);
      }
    } else {
      setStatus("error");
      setTimeout(() => navigate("/auth", { replace: true }), 800);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#231F20] text-[#dcdbdb]">
      <div className="p-8 rounded-lg shadow-lg bg-[#2b2c2b] w-full max-w-sm text-center">
        <div className="flex flex-col items-center gap-4">
          <div>
            {status === "processing" && (
              <svg
                className="animate-spin h-10 w-10 text-[#ee3124]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}

            {status === "success" && (
              <svg className="h-10 w-10 text-green-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-30" />
                <path d="M7 12l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}

            {status === "error" && (
              <svg className="h-10 w-10 text-red-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-30" />
                <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>

          <div>
            {status === "processing" && <p className="text-sm">Completing sign in…</p>}
            {status === "success" && <p className="text-sm">Signed in — redirecting…</p>}
            {status === "error" && <p className="text-sm">Sign-in failed — returning to login.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
