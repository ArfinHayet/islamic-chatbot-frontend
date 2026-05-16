"use client";

import { useCallback } from "react";

export function useApi() {
  const request = useCallback(async (url, options = {}) => {
    const { parse = "json", ...fetchOptions } = options;
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`);
      error.status = response.status;
      error.response = response;
      throw error;
    }

    if (parse === "response") return response;
    if (parse === "text") return response.text();
    if (parse === "blob") return response.blob();
    if (parse === "none") return null;

    return response.json();
  }, []);

  return { request };
}
