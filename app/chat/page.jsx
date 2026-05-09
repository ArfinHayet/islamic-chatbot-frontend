'use client'

import { IslamicChatClient } from "@/components/islamic-chat/IslamicChatClient";
import { useUi } from "@/context/UiContext";
import { useEffect } from "react";

export default function ChatPage() {
  const { setSection } = useUi();

  useEffect(() => {
    setSection("dua");
  }, [setSection]);

  return <IslamicChatClient />;
}
