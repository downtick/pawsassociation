"use client";
import { useSyncExternalStore } from "react";
import CopyCodeButton from "./CopyCodeButton";
import {
  FOUNDING_CODE, FOUNDING_ENDS_AT, FOUNDING_ENDS_LABEL, FOUNDING_PRICE_DOLLARS,
  GUARANTEE_DAYS, PRICE_DOLLARS,
} from "@/lib/membershipPolicy";

// Founding-member rate banner for /join and /get-listed. Checked in the
// browser so a statically built page still drops it once the offer ends.
const noop = () => () => {};

export default function FoundingOffer({ className = "" }: { className?: string }) {
  const live = useSyncExternalStore(noop, () => Date.now() < FOUNDING_ENDS_AT, () => true);
  if (!live) return null;

  return (
    <div className={`offer ${className}`}>
      <div className="offer-text">
        <span className="offer-tag">Founding-member rate</span>
        <p className="offer-head">
          ${FOUNDING_PRICE_DOLLARS} your first year with code <strong>{FOUNDING_CODE}</strong>
        </p>
        <p className="offer-fine">
          Then ${PRICE_DOLLARS}/year. Offer ends {FOUNDING_ENDS_LABEL}. {GUARANTEE_DAYS}-day
          money-back guarantee. Enter the code on the checkout page under &ldquo;Add promotion code.&rdquo;
        </p>
      </div>
      <div className="offer-code">
        <code>{FOUNDING_CODE}</code>
        <CopyCodeButton code={FOUNDING_CODE} />
      </div>
    </div>
  );
}
