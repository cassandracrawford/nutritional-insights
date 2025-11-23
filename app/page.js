"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithEmailPassword, registerWithEmailPassword } from "@/lib/auth";
import { loginWithGoogle } from "@/lib/auth";
import ToastMessage from "@/components/Toast";
import AuthUI from "@/components/AuthUI";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [toast, setToast] = useState(null);
  const router = useRouter();

  async function handleLogin({ email, password }) {
    const { error } = await loginWithEmailPassword(email, password);

    if (error) {
      console.log(error);
      setToast({
        id: Date.now(),
        message: "Login failed. Please check your credentials.",
      });
      return;
    }

    router.replace("/dashboard");
  }

  async function handleRegister({ email, password }) {
    const { error } = await registerWithEmailPassword(email, password);

    if (error) {
      console.log(error);
      setToast({ message: "Registration failed. Please try again." });
      return;
    }

    setToast({ message: "Account created! Please sign in." });
    setMode("login");
  }

  async function handleOAuth() {
    const { error } = await loginWithGoogle();

    if (error) {
      console.log(error);
      setToast({
        message: "Google sign-in failed. Please try again.",
      });
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen">
      <div className="absolute inset-0 bg-black/5" />
      <AuthUI
        mode={mode}
        onModeChange={setMode}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onOAuth={handleOAuth}
      />
      {toast && <ToastMessage key={toast.id} message={toast.message} duration={3000} />}
    </main>
  );
}
