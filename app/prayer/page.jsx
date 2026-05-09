"use client";

import React, { useEffect } from "react";
import { IslamicChatClient } from "@/components/islamic-chat/IslamicChatClient";
import { useUi } from "@/context/UiContext";

export default function PrayerPage() {
  const { setSection } = useUi();

  useEffect(() => {
    setSection("prayer");
  }, [setSection]);

  return <IslamicChatClient />;
}
