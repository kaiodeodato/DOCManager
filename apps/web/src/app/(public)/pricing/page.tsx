"use client";
import { LandingFinalCta, LandingPricing } from "@ac/ui";

export default function PricingPage() {
  return (
    <div className="dm-page-enter py-8">
      <LandingPricing
        title="Pricing"
        tiers={[
          { id: "starter", name: "Starter", price: "€99/mo", features: ["2 seats", "5k pages"], onCta: () => { window.location.href = "/register"; } },
          { id: "pro", name: "Pro", price: "€399/mo", features: ["20 seats", "Giulia", "Integrations"], highlighted: true, onCta: () => { window.location.href = "/register"; } },
          { id: "enterprise", name: "Enterprise", price: "Custom", features: ["SSO", "Dedicated workers"], onCta: () => { window.location.href = "/contact"; } },
        ]}
      />
      <LandingFinalCta title="Need a custom plan?" cta="Contact sales" onCta={() => { window.location.href = "/contact"; }} />
    </div>
  );
}
