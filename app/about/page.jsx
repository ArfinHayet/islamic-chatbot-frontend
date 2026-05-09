"use client";

import React, { useEffect } from "react";
import { IslamicChatClient } from "@/components/islamic-chat/IslamicChatClient";
import { useUi } from "@/context/UiContext";

export default function AboutPage() {
  const { setSection } = useUi();

  useEffect(() => {
    setSection("about");
  }, [setSection]);

  return <IslamicChatClient />;
}
