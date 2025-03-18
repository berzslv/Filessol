import { useState, useEffect } from "react";
import { useWallet } from "@/lib/wallet";
import { apiRequest } from "@/lib/queryClient";
import { formatNumber, shortenAddress, formatRelativeTime } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { CopyIcon, TwitterIcon } from "lucide-react";

interface Referral {
  id: number;
  referrerId: number;
  referredId: number;
  date: string;
  rewardAmount: string;
  walletAddress?: string; // Added for UI display
  timeAgo?: string; // Added for UI display
}

export default function ReferralSection() {
  const { connected, userId, referralCode } = useWallet();
  const [referralLink, setReferralLink] = useState<string>("");
  const { toast } = useToast();

  // Fetch referral data if user is connected
  const { data: referralData, isLoading } = useQuery({
    queryKey: [connected && userId ? `/api/users/${userId}/referrals` : null],
    enabled: !!connected && !!userId,
  });

  // Generate referral link when referral code is available
  useEffect(() => {
    if (referralCode) {
      // Use the current domain and path with the referral code
      const baseUrl = window.location.origin;
      setReferralLink(`${baseUrl}/ref/${referralCode}`);
    }
  }, [referralCode]);

  const copyReferralLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      toast({
        title: "Link Copied",
        description: "Referral link copied to clipboard"
      });
    }
  };

  const shareOnTwitter = () => {
    if (referralLink) {
      const tweetText = encodeURIComponent(`Join me on Hacked ATM and get bonuses when you buy tokens! ${referralLink}`);
      window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
    }
  };

  const shareOnWhatsApp = () => {
    if (referralLink) {
      const whatsappText = encodeURIComponent(`Join me on Hacked ATM and get bonuses when you buy tokens! ${referralLink}`);
      window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
    }
  };

  return (
    <section id="referral" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Referral Program</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Share your unique link and earn 5% from every transaction.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-zinc-800 rounded-xl p-6 border border-gray-800">
            <h3 className="font-heading font-bold text-xl mb-4">Your Referral Link</h3>
            
            <div className="mb-6">
              {!connected ? (
                <div className="p-4 rounded-lg bg-zinc-900 text-center">
                  <p className="text-gray-400">Connect your wallet to get your unique referral link</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center mb-4">
                    <div className="flex-grow relative">
                      <input 
                        type="text" 
                        value={referralLink} 
                        className="w-full py-3 px-4 rounded-lg bg-zinc-900 border border-gray-700 text-white focus:outline-none focus:border-[#ff3e00]" 
                        readOnly 
                      />
                      <button 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ff3e00] hover:text-white transition"
                        onClick={copyReferralLink}
                      >
                        <CopyIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      className="flex items-center justify-center bg-zinc-900 rounded-lg py-2 px-4 border border-gray-700 hover:border-[#ff3e00]/50 transition"
                      onClick={shareOnTwitter}
                    >
                      <TwitterIcon className="w-5 h-5 mr-2 text-[#1DA1F2]" />
                      <span>Share on Twitter</span>
                    </button>
                    <button 
                      className="flex items-center justify-center bg-zinc-900 rounded-lg py-2 px-4 border border-gray-700 hover:border-[#ff3e00]/50 transition"
                      onClick={shareOnWhatsApp}
                    >
                      <svg className="w-5 h-5 mr-2 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span>Share on WhatsApp</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6 border border-gray-800">
            <h3 className="font-heading font-bold text-xl mb-4">Your Referral Stats</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 rounded-lg bg-zinc-900">
                <div className="text-gray-400 text-sm mb-1">Total Referrals</div>
                <div className="font-heading font-bold text-2xl">
                  {isLoading ? (
                    <div className="h-7 w-16 bg-gray-700 animate-pulse rounded"></div>
                  ) : connected ? (
                    referralData?.totalReferrals || 0
                  ) : (
                    0
                  )}
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-zinc-900">
                <div className="text-gray-400 text-sm mb-1">Earned Rewards</div>
                <div className="font-heading font-bold text-2xl text-[#ff3e00]">
                  {isLoading ? (
                    <div className="h-7 w-32 bg-gray-700 animate-pulse rounded"></div>
                  ) : connected ? (
                    formatNumber(referralData?.totalRewards || 0) + " HACK"
                  ) : (
                    "0 HACK"
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-zinc-900">
              <h4 className="font-medium mb-3">Recent Referrals</h4>
              
              {!connected ? (
                <div className="text-center py-4 text-gray-400">
                  <p>Connect your wallet to see your referrals</p>
                </div>
              ) : isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <div className="bg-gray-700 rounded-full w-8 h-8 animate-pulse mr-3"></div>
                        <div>
                          <div className="h-4 w-24 bg-gray-700 animate-pulse rounded mb-1"></div>
                          <div className="h-3 w-16 bg-gray-700 animate-pulse rounded"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 w-16 bg-gray-700 animate-pulse rounded mb-1"></div>
                        <div className="h-3 w-12 bg-gray-700 animate-pulse rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : referralData?.referrals && referralData.referrals.length > 0 ? (
                <div>
                  {referralData.referrals.slice(0, 3).map((referral: Referral) => (
                    <div key={referral.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                      <div className="flex items-center">
                        <div className="bg-zinc-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{shortenAddress(referral.walletAddress || `wallet_${referral.referredId}`)}</div>
                          <div className="text-xs text-gray-400">{formatRelativeTime(referral.date)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">+{formatNumber(referral.rewardAmount || 0)} HACK</div>
                        <div className="text-xs text-green-400">${(Number(referral.rewardAmount) * 0.0008).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400">
                  <p>No referrals yet. Share your link to start earning!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
