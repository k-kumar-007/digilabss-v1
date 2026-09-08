/** Every number the console renders, in one place. */

export const KPIS = [
  { id: "spend", label: "Total Ad Spend", value: "$1,542.65", delta: "12.5%", up: true, tone: "blue" },
  { id: "revenue", label: "Total Revenue", value: "$8,372.40", delta: "18.2%", up: true, tone: "teal" },
  { id: "results", label: "Purchases / Leads", value: "1,482", delta: "21.4%", up: true, tone: "violet" },
  { id: "reach", label: "Reach", value: "432,000", delta: "9.8%", up: true, tone: "amber" },
  { id: "clicks", label: "Link Clicks", value: "12,546", delta: "16.7%", up: true, tone: "blue" },
  { id: "cpr", label: "Cost per Result", value: "$0.96", delta: "11.3%", up: false, tone: "teal" },
] as const;

export const TREND = {
  spend: [18, 22, 20, 26, 31, 28, 35, 33, 42, 46, 44, 52, 57, 54, 63, 68, 66, 74, 80, 86],
  revenue: [62, 71, 66, 84, 92, 88, 104, 99, 118, 128, 122, 141, 152, 147, 168, 178, 172, 191, 204, 214],
  clicks: [30, 34, 32, 39, 44, 41, 48, 46, 54, 58, 56, 63, 68, 65, 73, 78, 76, 83, 88, 93],
  purchases: [8, 10, 9, 12, 14, 13, 16, 15, 19, 21, 20, 24, 26, 25, 29, 31, 30, 34, 37, 39],
};

export const OBJECTIVES = [
  { label: "Sales", pct: 42, count: 623, tone: "var(--color-viz-blue)" },
  { label: "Leads", pct: 28, count: 415, tone: "var(--color-viz-teal)" },
  { label: "Website Traffic", pct: 18, count: 267, tone: "var(--color-viz-amber)" },
  { label: "Engagement", pct: 8, count: 119, tone: "var(--color-viz-violet)" },
  { label: "Other", pct: 4, count: 58, tone: "var(--color-viz-pink)" },
];

export const CAMPAIGNS = [
  { name: "Summer Sale 2025", objective: "Sales", spend: "$452.30", results: "512", cpr: "$0.88", roas: "5.4×", tone: "var(--color-viz-blue)" },
  { name: "Lead Gen — Online Courses", objective: "Leads", spend: "$261.75", results: "318", cpr: "$0.82", roas: "4.8×", tone: "var(--color-viz-teal)" },
  { name: "Brand Awareness Q3", objective: "Engagement", spend: "$198.60", results: "24,560", cpr: "$0.01", roas: "—", tone: "var(--color-viz-violet)" },
  { name: "Website Traffic — Blog", objective: "Traffic", spend: "$175.20", results: "2,842", cpr: "$0.06", roas: "3.2×", tone: "var(--color-viz-amber)" },
  { name: "Retargeting — Visitors", objective: "Sales", spend: "$124.80", results: "298", cpr: "$0.42", roas: "6.1×", tone: "var(--color-viz-pink)" },
];

export const ADS = [
  { title: "Learn Without Limits", campaign: "Lead Gen — Online Courses", impressions: "124,560", clicks: "6,842", ctr: "5.5%", results: "286", art: "from-[#1c6ef2] to-[#7c5cf5]" },
  { title: "Summer Sale — 50% Off", campaign: "Summer Sale 2025", impressions: "98,430", clicks: "4,210", ctr: "4.3%", results: "198", art: "from-[#ef9d10] to-[#e8467f]" },
  { title: "Build Your Skills", campaign: "Website Traffic — Blog", impressions: "76,220", clicks: "3,496", ctr: "4.6%", results: "167", art: "from-[#0fb185] to-[#1c6ef2]" },
];

export const KEY_METRICS = [
  { label: "Impressions", value: "842,000", delta: "14.6%" },
  { label: "Reach", value: "432,000", delta: "9.8%" },
  { label: "Frequency", value: "1.95", delta: "4.2%" },
  { label: "Website Clicks", value: "12,546", delta: "16.7%" },
  { label: "Adds to Cart", value: "1,892", delta: "20.1%" },
  { label: "Purchases", value: "1,482", delta: "21.4%" },
  { label: "Revenue", value: "$8,372.40", delta: "18.2%" },
];

export const AUDIENCE = [
  { bucket: "18–24", men: 16, women: 13 },
  { bucket: "25–34", men: 36, women: 27 },
  { bucket: "35–44", men: 18, women: 18 },
  { bucket: "45–54", men: 8, women: 11 },
  { bucket: "55+", men: 6, women: 7 },
];
