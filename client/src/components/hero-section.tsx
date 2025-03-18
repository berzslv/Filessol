import { Link } from "wouter";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  hoverBorderColor: string;
}

const FeatureCard = ({ icon, title, description, color, hoverBorderColor }: FeatureCardProps) => (
  <div className={`bg-zinc-800 rounded-xl p-6 border border-gray-800 hover:border-${hoverBorderColor} transition card-glow`}>
    <div className={`rounded-full bg-${color}/10 w-14 h-14 flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <h3 className="text-xl font-heading font-bold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export default function HeroSection() {
  return (
    <section id="home" className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute w-64 h-64 bg-[#ff3e00] rounded-full opacity-10 -top-10 -left-10 blur-3xl"></div>
      <div className="absolute w-64 h-64 bg-[#8b5cf6] rounded-full opacity-10 bottom-10 right-10 blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
            Hack Your Way to <span className="text-[#ff3e00]">Financial Freedom</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Earn passive income through our innovative referral system and staking vault on the Solana blockchain.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#buy" className="bg-[#ff3e00] hover:bg-opacity-90 text-white font-bold rounded-lg py-3 px-8 transition shadow-lg hover:shadow-[#ff3e00]/30">
              Buy Tokens
            </a>
            <a href="#staking" className="bg-zinc-800 hover:bg-opacity-90 border border-gray-700 text-white font-bold rounded-lg py-3 px-8 transition">
              Start Staking
            </a>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={
              <svg className="w-6 h-6 text-[#ff3e00]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
              </svg>
            }
            title="Referral System"
            description="Earn 5% of every transaction when someone uses your unique referral link."
            color="[#ff3e00]"
            hoverBorderColor="[#ff3e00]/30"
          />

          <FeatureCard
            icon={
              <svg className="w-6 h-6 text-[#8b5cf6]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
              </svg>
            }
            title="Staking Vault"
            description="Stake your tokens to earn dynamic APY with auto-compounding rewards every 30 minutes."
            color="[#8b5cf6]"
            hoverBorderColor="[#8b5cf6]/30"
          />

          <FeatureCard
            icon={
              <svg className="w-6 h-6 text-[#10b981]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
            }
            title="Leaderboards"
            description="Compete for the top spots as referrer or staker and win bonus rewards and airdrops."
            color="[#10b981]"
            hoverBorderColor="[#10b981]/30"
          />
        </div>
      </div>
    </section>
  );
}
