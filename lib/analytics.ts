/**
 * Tracking layer.
 *
 * Everything routes through the GTM dataLayer, which is the single source of
 * truth. GA4 and Meta Pixel are then fired as *mock* calls so the assignment's
 * "event firing on form submission" is verifiable without wiring real
 * containers: if `gtag` / `fbq` are not present (no real tag installed) we
 * install lightweight shims that queue the call and log it. Open the console
 * or run `window.dataLayer` to inspect.
 */

export type BudgetRange =
  | "under-5k"
  | "5k-15k"
  | "15k-50k"
  | "50k-plus";

export type LeadPayload = {
  name: string;
  email: string;
  company: string;
  budget: BudgetRange;
  message?: string;
};

type DataLayerEvent = Record<string, unknown> & { event: string };

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; __mock?: boolean };
  }
}

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? "G-DEMO12345";
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "000000000000000";

const isBrowser = () => typeof window !== "undefined";

/** Approximate value per budget band, so `generate_lead` carries a real number. */
const BUDGET_VALUE: Record<BudgetRange, number> = {
  "under-5k": 2500,
  "5k-15k": 10000,
  "15k-50k": 32500,
  "50k-plus": 75000,
};

export const BUDGET_LABEL: Record<BudgetRange, string> = {
  "under-5k": "Under $5k / mo",
  "5k-15k": "$5k – $15k / mo",
  "15k-50k": "$15k – $50k / mo",
  "50k-plus": "$50k+ / mo",
};

/**
 * Ensure the dataLayer exists before GTM loads. GTM replays anything already
 * queued here, so events fired during hydration are never dropped.
 */
export function initDataLayer() {
  if (!isBrowser()) return;
  window.dataLayer = window.dataLayer || [];
}

/** Install no-op-but-observable stand-ins for GA4 / Meta Pixel in demo mode. */
function ensureMockTags() {
  if (!isBrowser()) return;

  if (typeof window.gtag !== "function") {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push({ event: "mock_gtag", args } as DataLayerEvent);
      console.info("%c[GA4 mock]", "color:#e37400;font-weight:700", ...args);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA4_ID, { send_page_view: false });
  }

  if (typeof window.fbq !== "function") {
    const shim = ((...args: unknown[]) => {
      shim.queue!.push(args);
      window.dataLayer?.push({ event: "mock_fbq", args } as DataLayerEvent);
      console.info("%c[Meta Pixel mock]", "color:#0866ff;font-weight:700", ...args);
    }) as NonNullable<Window["fbq"]>;
    shim.queue = [];
    shim.__mock = true;
    window.fbq = shim;
    window.fbq("init", META_PIXEL_ID);
  }
}

/** Push a named event onto the dataLayer. Safe to call before GTM is ready. */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (!isBrowser()) return;
  initDataLayer();
  ensureMockTags();
  window.dataLayer!.push({ event, ...params });
}

/* -------------------------------------------------------------------------- */
/*  Named events — the only ones the page fires.                              */
/* -------------------------------------------------------------------------- */

export function trackCtaClick(location: string, label: string) {
  track("cta_click", { cta_location: location, cta_label: label });
}

/** Fires once, when the visitor first interacts with the lead form. */
export function trackFormStart() {
  track("form_start", { form_id: "book_a_call" });
}

export function trackFormError(fields: string[]) {
  track("form_error", { form_id: "book_a_call", invalid_fields: fields.join(",") });
}

/**
 * The conversion. One dataLayer event plus the two mock pixel calls the brief
 * asks for: GA4 `generate_lead` and Meta `Lead`.
 */
export function trackLeadSubmitted(lead: LeadPayload, leadId: string) {
  const value = BUDGET_VALUE[lead.budget] ?? 0;

  track("generate_lead", {
    form_id: "book_a_call",
    lead_id: leadId,
    currency: "USD",
    value,
    budget_range: lead.budget,
    company: lead.company,
  });

  ensureMockTags();

  window.gtag?.("event", "generate_lead", {
    send_to: GA4_ID,
    currency: "USD",
    value,
    lead_id: leadId,
  });

  window.fbq?.("track", "Lead", {
    content_name: "Book a Call",
    currency: "USD",
    value,
  });
}

/** Section impressions — how far down the story people actually get. */
export function trackSectionView(section: string) {
  track("section_view", { section_id: section });
}
