"use client";

import { useState } from "react";

export default function RegisterForm({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (onSubmit) onSubmit({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      <div className="space-y-1.5 sm:space-y-2">
        <label
          htmlFor="email"
          className="block text-xs sm:text-sm font-normal text-slate-100"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
              w-full rounded-2xl border border-white/30 bg-white/15
              px-3 py-2 sm:px-4 sm:py-2.5
              text-xs sm:text-sm text-slate-900
              placeholder:text-slate-500 font-light
              focus:outline-none focus:ring-2 focus:ring-white/70
              focus:border-transparent
            "
          placeholder="youremail@example.com"
        />
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <label
          htmlFor="password"
          className="block text-xs sm:text-sm font-normal text-slate-100"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="
              w-full rounded-2xl border border-white/30 bg-white/15
              px-3 py-2 sm:px-4 sm:py-2.5
              text-xs sm:text-sm text-slate-900
              placeholder:text-slate-500 font-light
              focus:outline-none focus:ring-2 focus:ring-white/70
              focus:border-transparent
            "
          placeholder="•••••••••••••"
        />
      </div>

      <button
        type="submit"
        className="
            mt-1.5 sm:mt-2 w-full rounded-2xl bg-white/90 text-slate-900
            py-2 sm:py-2.5 text-sm font-normal
            hover:bg-white transition-colors hover:cursor-pointer
            shadow-md shadow-slate-900/20
          "
      >
        Register
      </button>
    </form>
  );
}
