"use client";

import { useState } from "react";
import { submitPartnerEnquiry } from "./actions";
import { GradientText } from "@/lib/styles";
import { track } from "@/lib/analytics";

const INPUT_CLASS =
  "w-full bg-brand-accent/30 border border-brand-primary/5 rounded-2xl px-6 py-4 text-brand-midnight font-medium placeholder:text-brand-midnight/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:bg-white transition-all";

const LABEL_CLASS =
  "block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4";

export function PartnerEnquiryForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("loading");
    setErrorMessage("");
    track("partner_enquiry_submit");

    try {
      const result = await submitPartnerEnquiry(formData);
      if (result && "error" in result) {
        track("partner_enquiry_error");
        setStatus("error");
        setErrorMessage(result.error);
      } else {
        track("partner_enquiry_success");
        setStatus("success");
      }
    } catch {
      track("partner_enquiry_error");
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="max-w-3xl mx-auto bg-green-50 border border-green-100 rounded-3xl p-12 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-6">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-brand-midnight uppercase tracking-tight mb-2">
          Enquiry received
        </h3>
        <p className="text-brand-midnight/60 font-medium max-w-md mx-auto">
          Thanks for reaching out. We&apos;ll review your enquiry and come back
          to you shortly with next steps.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 text-sm font-black uppercase tracking-widest text-brand-primary hover:text-brand-secondary transition-colors"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-4xl border border-brand-primary/5 shadow-2xl p-8 sm:p-16">
      <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-brand-midnight mb-10">
        Send us your <GradientText>enquiry</GradientText>
      </h3>

      <form action={handleSubmit}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="businessName" className={LABEL_CLASS}>
              Business Name
            </label>
            <input
              name="businessName"
              type="text"
              id="businessName"
              required
              placeholder="Bont Golf"
              className={INPUT_CLASS}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="contactName" className={LABEL_CLASS}>
              Your Name
            </label>
            <input
              name="contactName"
              type="text"
              id="contactName"
              required
              placeholder="Jane Doe"
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 mt-6">
          <div className="space-y-2">
            <label htmlFor="email" className={LABEL_CLASS}>
              Email Address
            </label>
            <input
              name="email"
              type="email"
              id="email"
              required
              placeholder="jane@business.co.uk"
              className={INPUT_CLASS}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className={LABEL_CLASS}>
              Phone <span className="text-brand-midnight/30">(optional)</span>
            </label>
            <input
              name="phone"
              type="tel"
              id="phone"
              placeholder="07700 900000"
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div className="space-y-2 mt-6">
          <label htmlFor="websiteOrSocial" className={LABEL_CLASS}>
            Website or Social Handle{" "}
            <span className="text-brand-midnight/30">(optional)</span>
          </label>
          <input
            name="websiteOrSocial"
            type="text"
            id="websiteOrSocial"
            placeholder="bontgolf.com or @bontgolf"
            className={INPUT_CLASS}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 mt-6">
          <div className="space-y-2">
            <label htmlFor="campaignType" className={LABEL_CLASS}>
              Campaign Type
            </label>
            <select
              name="campaignType"
              id="campaignType"
              required
              defaultValue=""
              className={INPUT_CLASS}
            >
              <option value="" disabled>
                Select a route...
              </option>
              <option value="Free giveaway">Free giveaway</option>
              <option value="Ticketed competition">Ticketed competition</option>
              <option value="Not sure yet">Not sure yet</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="prizeValueGbp" className={LABEL_CLASS}>
              Approx. Prize Value (£){" "}
              <span className="text-brand-midnight/30">(optional)</span>
            </label>
            <input
              name="prizeValueGbp"
              type="number"
              min={0}
              step={1}
              id="prizeValueGbp"
              placeholder="e.g. 500"
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div className="space-y-2 mt-6">
          <label htmlFor="prizeDescription" className={LABEL_CLASS}>
            Prize or Product Description
          </label>
          <textarea
            name="prizeDescription"
            id="prizeDescription"
            required
            placeholder="Tell us about the prize or product you'd like to offer..."
            rows={3}
            className={`${INPUT_CLASS} resize-none`}
          />
        </div>

        <div className="space-y-2 mt-6">
          <label htmlFor="message" className={LABEL_CLASS}>
            Anything Else
          </label>
          <textarea
            name="message"
            id="message"
            required
            placeholder="Goals, timing, target audience, or anything else we should know..."
            rows={5}
            className={`${INPUT_CLASS} resize-none`}
          />
        </div>

        {status === "error" && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full mt-10 bg-brand-primary text-white rounded-full py-5 font-black uppercase tracking-[0.2em] text-sm shadow-xl transition-all duration-300 hover:bg-brand-secondary hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0"
        >
          {status === "loading" ? "Sending..." : "Send Enquiry"}
        </button>

        <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-widest text-brand-midnight/30">
          We&apos;ll only use these details to respond to your enquiry.
        </p>
      </form>
    </div>
  );
}
