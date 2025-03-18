import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import TokenomicsSection from "@/components/tokenomics-section";
import BuySection from "@/components/buy-section";
import StakingSection from "@/components/staking-section";
import ReferralSection from "@/components/referral-section";
import LeaderboardSection from "@/components/leaderboard-section";
import FAQSection from "@/components/faq-section";
import Footer from "@/components/footer";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const [location] = useLocation();

  // Check for hash in URL and scroll to section
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  // Check for referral code in params
  useEffect(() => {
    // This will be handled by the BuySection component
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <Navbar />
      <HeroSection />
      <TokenomicsSection />
      <BuySection />
      <StakingSection />
      <ReferralSection />
      <LeaderboardSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
