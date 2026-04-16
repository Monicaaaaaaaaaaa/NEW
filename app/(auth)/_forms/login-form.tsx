"use client";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="w-full max-w-lg flex flex-col justify-center px-10">
      
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
          WELCOME TO NRS
        </h1>
        <h2 className="text-2xl font-extrabold text-blue-600 leading-tight">
          MERCHANT PORTAL SOLUTION
        </h2>
      </div>

      <p className="text-gray-900 mb-8 text-sm">
        A centralised platform to manage{" "}
        <strong>Bulk upload and Single Invoice creation</strong>{" "}
        — all in one place with instant confirmation.
      </p>

      <label className="text-sm font-medium text-gray-700 mb-1">
        Email
      </label>
      <input
        type="email"
        placeholder="Enter email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-sm outline-none focus:border-blue-500"
      />

      <label className="text-sm font-medium text-gray-700 mb-1">
        Password
      </label>

      <div className="relative mb-2">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-lg pl-4 pr-10 py-3 w-full text-sm outline-none focus:border-blue-500"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        >
          {showPassword ? ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"> <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/> <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/> <line x1="1" y1="1" x2="23" y2="23"/> </svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"> <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/> <circle cx="12" cy="12" r="3"/> </svg> )}
        </button>
      </div>

      <div className="text-right mb-6">
        <a href="#" className="text-sm text-blue-600 hover:underline">
          Forgot Password?
        </a>
      </div>

      <button
        onClick={handleLogin}
        className="w-full text-white py-2 rounded-lg text-base font-medium bg-blue-600"
      >
        Sign In
      </button>
    </div>
  );
}