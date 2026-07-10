"use client";

import { useEffect } from "react";
import { getTelegramWebApp } from "@/lib/telegram";

export function TelegramInit() {
  useEffect(() => {
    const webApp = getTelegramWebApp();
    if (!webApp) return;
    webApp.ready();
    webApp.expand();
  }, []);

  return null;
}
