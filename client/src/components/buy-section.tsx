import { useState, useEffect } from "react";
import { useWallet } from "@/lib/wallet";
import { apiRequest } from "@/lib/queryClient";
import { formatNumber } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import WalletModal from "@/components/wallet-modal";

export default function BuySection() {
  const { connected, userId, balance, connect } = useWallet();
  const [solAmount, setSolAmount] = useState<string>("");
  const [hackAmount, setHackAmount] = useState<string>("");
  const [txFee, setTxFee] = useState<string>("0");
  const [referralBonus, setReferralBonus] = useState<string>("0");
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const { toast } = useToast();
  const [location] = useLocation();

  // Calculate HACK amount based on SOL input
  useEffect(() => {
    const amount = parseFloat(solAmount) || 0;
    const hackValue = amount * 15000;
    setHackAmount(hackValue.toString());
    
    // Calculate fees
    const fee = hackValue * 0.08;
    setTxFee(fee.toFixed(0));
    
    // Calculate referral bonus (if applicable)
    if (referralCode && amount > 0) {
      const bonus = fee * 0.625; // 5% of 8% total fee
      setReferralBonus(bonus.toFixed(0));
    } else {
      setReferralBonus("0");
    }
  }, [solAmount, referralCode]);

  // Check for referral code in URL
  useEffect(() => {
    // Check URL path for referral code
    const pathMatch = location.match(/\/ref\/([A-Za-z0-9]+)/);
    if (pathMatch) {
      setReferralCode(pathMatch[1]);
    }
    
    // Check query params for referral code
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get('ref');
    if (refParam) {
      setReferralCode(refParam);
    }
  }, [location]);

  const handleSolAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSolAmount(value);
  };

  const openWalletModal = () => {
    setWalletModalOpen(true);
  };

  const closeWalletModal = () => {
    setWalletModalOpen(false);
  };

  const handleBuyClick = async () => {
    if (!connected || !userId) {
      // Open wallet modal instead of showing toast
      openWalletModal();
      return;
    }

    if (!solAmount || parseFloat(solAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid SOL amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const response = await apiRequest("POST", "/api/buy", {
        userId,
        solAmount: parseFloat(solAmount),
        hackAmount: parseFloat(hackAmount),
        referralCode: referralCode || undefined
      });

      const result = await response.json();
      
      // Update local balance display from the result
      if (result.details && result.details.newBalance) {
        // In a production app, we would update the global wallet state
        // But for now we'll just show the toast with the new balance
        toast({
          title: "Purchase Successful",
          description: `You have purchased ${formatNumber(hackAmount)} HACK tokens. New balance: ${formatNumber(result.details.newBalance)} HACK`
        });
      } else {
        toast({
          title: "Purchase Successful",
          description: `You have purchased ${formatNumber(hackAmount)} HACK tokens`
        });
      }

      // Reset form and reload the page after a delay to update the wallet balance
      setSolAmount("");
      
      // Wait a moment so the user can see the success message, then reload
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error buying tokens:", error);
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="buy" className="py-16 relative">
      <div className="absolute w-64 h-64 bg-[#ff3e00] rounded-full opacity-5 top-20 right-20 blur-3xl"></div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Buy Hacked ATM Token</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Purchase tokens directly from our platform with seamless integration.
          </p>
        </div>

        <div className="max-w-lg mx-auto bg-zinc-800 rounded-xl p-6 border border-gray-800 shadow-xl">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-400 font-medium">Pay with</label>
              <div className="text-xs text-gray-400">
                Balance: <span>{balance.sol} SOL</span>
              </div>
            </div>
            <div className="flex rounded-lg border border-gray-700 bg-zinc-900 p-3">
              <input 
                type="number" 
                placeholder="0.0" 
                className="bg-transparent flex-grow focus:outline-none text-lg" 
                value={solAmount}
                onChange={handleSolAmountChange}
              />
              <div className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M93.94 42.63H13.44C11.98 42.63 10.82 43.8 10.82 45.25C10.82 45.89 11.11 46.48 11.58 46.89L32.02 64.13L11.58 81.37C11.12 81.78 10.82 82.37 10.82 83.01C10.82 84.46 11.99 85.63 13.44 85.63H93.94C94.59 85.63 95.18 85.33 95.58 84.87L116.03 67.63C116.9 66.89 116.9 65.61 116.03 64.87L95.59 47.63C95.18 47.17 94.59 42.63 93.94 42.63Z" fill="url(#paint0_linear)"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="63.5" y1="42.63" x2="63.5" y2="85.63" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#9945FF"/>
                      <stop offset="1" stopColor="#14F195"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span className="font-medium">SOL</span>
              </div>
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-800 p-2 rounded-full border border-gray-700">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            <hr className="border-gray-700" />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-400 font-medium">You'll receive</label>
              <div className="text-xs text-gray-400">
                Balance: <span>{formatNumber(balance.hack)} HACK</span>
              </div>
            </div>
            <div className="flex rounded-lg border border-gray-700 bg-zinc-900 p-3">
              <input 
                type="text" 
                placeholder="0.0" 
                className="bg-transparent flex-grow focus:outline-none text-lg" 
                value={hackAmount}
                disabled
              />
              <div className="flex items-center">
                <div className="w-5 h-5 mr-2 bg-[#ff3e00] rounded-full flex items-center justify-center text-white text-xs font-bold">H</div>
                <span className="font-medium">HACK</span>
              </div>
            </div>
          </div>

          <div className="mb-6 p-3 bg-zinc-900 rounded-lg border border-gray-700">
            <div className="flex justify-between mb-1">
              <span className="text-gray-400">Price</span>
              <span className="font-medium">1 SOL = 15,000 HACK</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-400">Transaction Fee (8%)</span>
              <span className="font-medium text-red-400">-{txFee} HACK</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Referral Bonus</span>
              <span className="font-medium text-green-400">+{referralBonus} HACK</span>
            </div>
          </div>

          <div className="flex text-xs text-gray-400 mb-6">
            <div className="mr-1">
              <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div>
              <span>Using referral code: </span>
              <span className="text-[#ff3e00] font-medium">{referralCode || "None"}</span>
            </div>
          </div>

          <button 
            className="w-full bg-[#ff3e00] text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            onClick={handleBuyClick}
            disabled={loading || (!connected && !solAmount) || (connected && (!solAmount || parseFloat(solAmount) <= 0))}
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            <span>{connected && userId ? "Buy HACK" : "Connect Wallet to Buy"}</span>
          </button>
        </div>
      </div>

      {/* Wallet Modal */}
      <WalletModal 
        isOpen={walletModalOpen} 
        onClose={closeWalletModal} 
      />
    </section>
  );
}
