"use client";

import { useEffect, useState } from "react";

export type PerfProfile = {
  /** Ready only after mount — never gate server output on this. */
  ready: boolean;
  /** The user asked the OS for less motion. */
  reducedMotion: boolean;
  /** Low core count, Save-Data, or a slow effective connection. */
  lowPower: boolean;
  /** Convenience: run the expensive canvas background at all? */
  allowHeavyEffects: boolean;
};

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

/**
 * Decides whether this device gets the full motion treatment.
 *
 * The animated background is the single most expensive thing on the page, so
 * it is opt-in per device rather than opt-out: phones with few cores, users on
 * Save-Data, and anyone with reduced-motion set get the static gradient, which
 * is visually near-identical and costs nothing.
 */
export function usePerfProfile(): PerfProfile {
  const [profile, setProfile] = useState<PerfProfile>({
    ready: false,
    reducedMotion: false,
    lowPower: false,
    allowHeavyEffects: false,
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const evaluate = () => {
      const reducedMotion = media.matches;

      const connection = (
        navigator as Navigator & { connection?: NetworkInformation }
      ).connection;

      const cores = navigator.hardwareConcurrency ?? 8;
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

      const lowPower =
        cores <= 4 ||
        memory <= 4 ||
        connection?.saveData === true ||
        /^(slow-)?2g$/.test(connection?.effectiveType ?? "");

      setProfile({
        ready: true,
        reducedMotion,
        lowPower,
        allowHeavyEffects: !reducedMotion && !lowPower,
      });
    };

    evaluate();
    media.addEventListener("change", evaluate);
    return () => media.removeEventListener("change", evaluate);
  }, []);

  return profile;
}
