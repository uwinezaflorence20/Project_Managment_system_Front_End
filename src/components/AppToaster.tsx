"use client";

import { ToastContainer } from "react-toastify";
import { useTheme } from "@/lib/theme-context";
import "react-toastify/dist/ReactToastify.css";

export function AppToaster() {
  const { theme } = useTheme();
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      newestOnTop
      closeOnClick
      pauseOnHover
      theme={theme}
    />
  );
}
