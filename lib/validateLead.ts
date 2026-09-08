import type { BudgetRange, LeadPayload } from "@/lib/analytics";

export const BUDGETS: BudgetRange[] = ["under-5k", "5k-15k", "15k-50k", "50k-plus"];

export type FieldName = keyof LeadPayload;
export type Errors = Partial<Record<FieldName, string>>;

/**
 * One validator, imported by both the form and the API route.
 *
 * Client-side it drives inline messages; server-side it is the actual gate,
 * because anything that only runs in the browser is a suggestion, not a rule.
 */
export function validateLead(input: Partial<LeadPayload>): Errors {
  const errors: Errors = {};

  const name = input.name?.trim() ?? "";
  if (name.length < 2) {
    errors.name = "Please enter your full name.";
  } else if (name.length > 80) {
    errors.name = "That name is too long.";
  }

  const email = input.email?.trim() ?? "";
  // Deliberately permissive: reject the obviously broken, never a real address.
  if (!email) {
    errors.email = "We need an email to send the invite.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 160) {
    errors.email = "That doesn't look like a valid email.";
  }

  const company = input.company?.trim() ?? "";
  if (company.length < 2) {
    errors.company = "Which company are we talking about?";
  } else if (company.length > 100) {
    errors.company = "That company name is too long.";
  }

  if (!input.budget) {
    errors.budget = "Pick a range so we can prepare properly.";
  } else if (!BUDGETS.includes(input.budget)) {
    errors.budget = "Pick one of the listed ranges.";
  }

  if (input.message && input.message.length > 1000) {
    errors.message = "Please keep this under 1000 characters.";
  }

  return errors;
}
