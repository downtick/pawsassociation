import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * GA4. Renders nothing when NEXT_PUBLIC_GA_ID is unset, so local development
 * and preview builds do not pollute the property with test traffic.
 *
 * IP anonymisation is on and Google Signals / ad personalisation are off, which
 * keeps the tag consistent with what the privacy policy says we do.
 */
export default function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false });`}
      </Script>
    </>
  );
}
