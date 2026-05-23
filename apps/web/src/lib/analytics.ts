/**
 * Crumbless analytics wrapper.
 *
 * Crumbless's `window.crumbless.track(eventName)` accepts a single string
 * (max 100 chars) and has no event-property support. The string-literal
 * union below is the single source of truth for the entire event taxonomy
 * — every call site must use one of these names.
 *
 * Per-raffle context is inferred from the auto-tracked pageview URL,
 * so event names are intentionally slug-free.
 */

export type AnalyticsEvent =
  // Conversion funnel — skill question through checkout
  | "raffle_skill_answer_submit"
  | "raffle_skill_answer_correct"
  | "raffle_skill_answer_incorrect"
  | "raffle_quiz_change_answer"
  | "raffle_quick_select_quantity"
  | "raffle_proceed_to_payment_click"
  | "raffle_checkout_login_redirect"
  | "raffle_checkout_profile_redirect"
  | "raffle_free_entry_click"
  | "checkout_session_created"
  | "checkout_session_error"
  | "dna_widget_opened"
  | "dna_payment_declined"
  | "dna_payment_cancelled"
  // Conversion confirmation — success page
  | "purchase_completed"
  | "purchase_failed"
  | "purchase_refunded_oversold"
  | "trustpilot_review_click"
  // Discovery / browse
  | "raffles_filter_free"
  | "raffles_filter_discounted"
  | "raffles_filter_ending_soon"
  | "raffles_filter_best_odds"
  | "raffles_sort_ending_soon"
  | "raffles_sort_price_low"
  | "raffles_sort_most_available"
  // Authentication
  | "auth_login_email_submit"
  | "auth_login_google_submit"
  | "auth_login_success"
  | "auth_login_failure"
  | "auth_register_email_submit"
  | "auth_register_google_submit"
  | "auth_register_success"
  | "auth_register_failure"
  | "auth_logout"
  | "auth_forgot_password_view"
  | "auth_forgot_password_submit"
  | "auth_forgot_password_sent"
  | "profile_complete_view"
  | "profile_complete_submit"
  | "profile_complete_success"
  | "profile_complete_failure"
  | "profile_banner_view"
  | "profile_banner_cta_click"
  | "profile_banner_dismiss"
  // Engagement / misc
  | "nav_enter_now_click"
  | "nav_mobile_menu_open"
  | "payment_prompt_dismiss"
  | "dashboard_tab_entries"
  | "dashboard_tab_wins"
  | "contact_form_submit"
  | "contact_form_success"
  | "contact_form_error"
  | "social_instagram_click"
  | "social_tiktok_click"
  | "social_facebook_click"
  | "social_linkedin_click"
  // B2B partners
  | "business_prompt_view"
  | "business_prompt_click"
  | "business_prompt_dismiss"
  | "partner_enquiry_submit"
  | "partner_enquiry_success"
  | "partner_enquiry_error";

const firedOnce = new Set<string>();

export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  const crumbless = window.crumbless;
  if (!crumbless || typeof crumbless.track !== "function") return;

  try {
    crumbless.track(event);
  } catch {
    // Analytics must never break the UI.
  }
}

/**
 * Fires an event at most once per page-load for the given key.
 * Useful for definitive conversion events (e.g. `purchase_completed`)
 * where StrictMode double-renders or refresh-on-pending could double-fire.
 */
export function trackOnce(event: AnalyticsEvent, key: string): void {
  const dedupeKey = `${event}:${key}`;
  if (firedOnce.has(dedupeKey)) return;
  firedOnce.add(dedupeKey);
  track(event);
}
