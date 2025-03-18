// components/BuySection.js
import { useState, useEffect } from "react";
import { useWallet } from "@/lib/wallet";  // Your custom hook for wallet management
import { useToast } from "@/hooks/use-toast";
import WalletModal from "@/components/wallet-modal";  // Keep your WalletModal component if necessary

export default function BuySection() {
  const { connected, connectWallet, userId, balance } = useWallet();  // Using the updated hook
  const [solAmount, setSolAmount] = useState("");
  const [hackAmount, setHackAmount] = useState("");
  const [txFee, setTxFee] = useState("0");
  const [referralBonus, setReferralBonus] = useState("0");
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const { toast } = useToast();

  const handleBuyClick = async () => {
    if (!connected) {
      // If the wallet is not connected, trigger WalletConnect
      connectWallet();
      return;
    }

    // Validate SOL amount
    if (!solAmount || parseFloat(solAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid SOL amount.",
        variant: "destructive",
      });
      return;
    }

    // Example purchase logic - here you could interact with your API
    console.log("Purchasing tokens:", solAmount);
    toast({
      title: "Purchase Successful",
      description: `You have purchased ${hackAmount} HACK tokens.`,
      variant: "success",
    });

    // Reset input fields after purchase
    setSolAmount("");
  };

  // Effect to calculate HACK amount, fees, and referral bonus
  useEffect(() => {
    const amount = parseFloat(solAmount) || 0;
    const hackValue = amount * 15000;
    setHackAmount(hackValue.toString());

    // Calculate fees and referral bonus
    const fee = hackValue * 0.08;
    setTxFee(fee.toFixed(0));

    if (referralCode && amount > 0) {
      const bonus = fee * 0.625; // 5% of 8% fee
      setReferralBonus(bonus.toFixed(0));
    } else {
      setReferralBonus("0");
    }
  }, [solAmount, referralCode]);

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
                onChange={(e) => setSolAmount(e.target.value)}
              />
              <div className="flex items-center">
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
                Balance: <span>{balance.hack} HACK</span>
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

          <button
            className="w-full bg-[#ff3e00] text-white font-bold py-3 px-4 rounded-lg"
            onClick={handleBuyClick}
            disabled={!connected}
          >
            {connected ? "Buy HACK" : "Connect Wallet to Buy"}
          </button>
        </div>
      </div>

      <WalletModal isOpen={!connected} onClose={() => {}} />
    </section>
  );
}

