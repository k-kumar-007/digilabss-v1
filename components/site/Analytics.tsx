"use client";

import { useEffect } from "react";
import { initDataLayer, track } from "@/lib/analytics";

/**
 * Boots the dataLayer and fires one page_view.
 *
 * Runs after hydration on purpose: nothing about tracking should compete with
 * the first paint. GTM itself is loaded by `next/script` with `afterInteractive`.
 */
export function Analytics() {
  useEffect(() => {
    initDataLayer();
    track("page_view", {
      page_path: window.location.pathname,
      page_title: document.title,
    });
  }, []);

  return null;
}
