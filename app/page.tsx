"use client";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 w-full relative">

        <img src="/image.jpg" alt="background" className="absolute inset-0 w-full h-full object-cover"/>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-white/95" />
        <img src="/logo.png" alt="eTranzact" className="absolute top-6 left-6 h-30 z-10" />
        <div className="relative z-10 w-full max-w-lg flex flex-col justify-center px-10 h-screen ml-auto mr-20">
          
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">WELCOME TO NRS</h1>
            <h2 className="text-2xl font-extrabold text-blue-600 leading-tight">MERCHANT PORTAL SOLUTION</h2>
          </div>

          <p className="text-gray-900 mb-8 text-sm">
            A centralised platform to manage{" "}
            <strong className="text-gray-900">Bulk upload and Single Invoice creation</strong>{" "}
            — all in one place with instant confirmation.
          </p>

          <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter email address"
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-sm outline-none focus:border-blue-500 bg-white/90"
          />

          <label className="text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="border border-gray-300 rounded-lg pl-5 pr-10 py-3 w-full text-sm outline-none focus:border-blue-500 bg-white/90"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>

          <div className="text-right mb-10">
            <a href="#" className="text-sm text-[#1d50a5] hover:underline">Forgot Password?</a>
          </div>

          <button className="w-full text-white py-3 rounded-lg text-base font-medium bg-blue-600 shadow-[0_4px_14px_0_rgba(59,130,246,0.5)]">
            Sign In
          </button>
        </div>
      </div>

      <div className="w-full bg-white py-4 text-center text-gray-400 text-xs border-t border-gray-100">
        Copyright © 2026 &nbsp;·&nbsp; Privacy Policy
      </div>
    </div>
  );
}