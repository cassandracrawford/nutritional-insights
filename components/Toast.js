"use client";

import { useEffect, useState } from "react";

export default function ToastMessage({ message, duration = 3000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      className={`
        fixed top-10 left-1/2 -translate-x-1/2
        px-5 py-3 rounded-2xl z-50
        backdrop-blur-lg bg-white/15 border
        shadow-lg shadow-black/30 text-white
        animate-fadeIn text-xs sm:text-sm font-light
      `}
    >
      {message}
    </div>
  );
}
