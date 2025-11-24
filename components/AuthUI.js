"use client";

import { useState } from "react";
import RegisterForm from "./Register";
import LoginForm from "./Login";

export default function AuthUI({
  mode = "login",
  onModeChange,
  onLogin,
  onRegister,
  onOAuth,
  onError,
}) {
  const [googleLoading, setGoogleLoading] = useState(false);

  // Handle Google OAuth login
  async function handleGoogleClick() {
    setGoogleLoading(true);
    await onOAuth(); 
    setGoogleLoading(false); 
  }

  const isLogin = mode === "login";

  return (
    <section
      className="
        relative z-10 w-full max-w-md
        px-6 py-8 sm:px-8 sm:py-10
        mx-4 sm:mx-0
        rounded-3xl border border-white/25 bg-white/10
        shadow-xl shadow-slate-900/40
        backdrop-blur-3xl
      "
    >
      {/* Header */}
      <header className="mb-6 space-y-1">
        <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-slate-100/80 font-light">
          {isLogin ? "Welcome to" : "Create your account for"}
        </p>
        <h1 className="text-2xl sm:text-3xl text-white drop-shadow-sm font-normal leading-tight">
          Diet Insights Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-100/80 mt-1 font-light">
          {isLogin
            ? "Sign in to continue."
            : "Register with your email and password."}
        </p>
      </header>

      {/* Form */}
      {isLogin ? (
        <LoginForm onSubmit={onLogin} />
      ) : (
        <RegisterForm onSubmit={onRegister} onError={onError} />
      )}

      {/* Divider */}
      <div className="flex items-center gap-3 my-5 sm:my-6">
        <div className="h-px flex-1 bg-white/30" />
        <span className="text-[10px] sm:text-xs text-slate-100/80 uppercase tracking-[0.2em]">
          or
        </span>
        <div className="h-px flex-1 bg-white/30" />
      </div>

      {/* OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={googleLoading}
        className="
          w-full flex items-center justify-center gap-2 sm:gap-3
          rounded-2xl border border-white/40 bg-white/15
          py-2 sm:py-2.5 text-xs sm:text-sm font-normal text-white
          hover:bg-white/25 hover:cursor-pointer
          transition-colors backdrop-blur-sm
          disabled:opacity-70 disabled:cursor-not-allowed
        "
      >
        <img
          src="/google.png"
          alt="Google logo"
          className="w-4 h-4 sm:w-5 sm:h-5"
        />
        <span>
          {googleLoading ? "Signing you in…" : "Continue with Google"}
        </span>
      </button>

      {/* Link to Register */}
      <p className="mt-4 sm:mt-5 text-[11px] sm:text-xs text-center text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => onModeChange(isLogin ? "register" : "login")}
          className="font-semibold underline underline-offset-2 text-white hover:text-white/80 hover:cursor-pointer transition-colors"
        >
          {isLogin ? "Register" : "Sign in"}
        </button>
      </p>
    </section>
  );
}
