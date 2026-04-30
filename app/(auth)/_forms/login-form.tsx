"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormValues>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  
  const onSubmit = async (data: LoginFormValues) => {
     if (loading) return;

     setLoading(true);
     
     try {
      const response = await fetch(
        "/api/auth/login",{
          method: "POST",
          headers: {"Content-Type": "application/json",},
          body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        }
     );
     
     const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Login failed");
    }

    localStorage.setItem("token", result.token);
    console.log("Login successful:", result);
    router.push("/dashboard");

  } catch (error) {
    console.error("Login error:", error);
    alert(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg flex flex-col justify-center px-10"
    >
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

      <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">
        Email
      </label>
      <Input
        id="email"
        type="email"
        placeholder="Enter email address"
        className={`rounded-lg px-4 py-3 mb-1 text-sm outline-none ${
          errors.email ? "border-red-500" : "border-gray-300 focus:border-blue-500"
        }`}
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Enter a valid email address",
          },
        })}
      />
      {errors.email && (
        <p className="text-red-500 text-xs mb-3">{errors.email.message}</p>
      )}

      <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1">
        Password
      </label>
      <div className="relative mb-1">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter Password"
          autoComplete="current-password"
          className={`rounded-lg pl-4 pr-10 py-3 w-full text-sm outline-none ${
            errors.password ? "border-red-500" : "border-gray-300 focus:border-blue-500"
          }`}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        <button
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      </div>
      {errors.password && (
        <p className="text-red-500 text-xs mb-3">{errors.password.message}</p>
      )}

      <div className="text-right mb-6">
        <a href="#" className="text-sm text-blue-600 hover:underline">
          Forgot Password?
        </a>
      </div>

      <Button type="submit" disabled={!isValid || isSubmitting} className="w-full">
  {isSubmitting ? (
    <span className="flex items-center justify-center gap-2">
      <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      Signing in...
    </span>
  ) : (
    "Sign In"
  )}
</Button>
    </form>
  );
}