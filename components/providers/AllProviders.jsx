"use client";

import { ChatProvider } from "@/context/ChatContext";
import { LocaleProvider } from "@/context/LocaleContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { UiProvider } from "@/context/UiContext";

export function AllProviders({ children }) {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <UiProvider>
          <ChatProvider>{children}</ChatProvider>
        </UiProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
}
