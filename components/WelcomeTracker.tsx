"use client";
import { useEffect } from "react";
import { track } from "@/lib/track";

// Fires once when Stripe Checkout returns a new member to /dashboard?welcome=1,
// then strips the flag so a refresh doesn't count the purchase twice.
export default function WelcomeTracker() {
  useEffect(() => {
    track("purchase", { currency: "USD", value: 149, items: [{ item_name: "PAWS Annual Membership", price: 149 }] });
    const url = new URL(window.location.href);
    url.searchParams.delete("welcome");
    window.history.replaceState(null, "", url.toString());
  }, []);
  return null;
}
