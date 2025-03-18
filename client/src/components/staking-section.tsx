import { useState, useEffect } from "react";
import { useWallet } from "@/lib/wallet";
import { apiRequest } from "@/lib/queryClient";
import { formatNumber, formatTimeLeft, calculateAPY, getNextRewardTime } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

export default function StakingSection() {
  const { connected, userId, balance } = useWallet();
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [currentApy, setCurrentApy] = useState<number>(120.5);
  const [nextRewardTime, setNextRewardTime] = useState<string>("00:15:45");
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Fetch staking data if user is connected
  const { 
    data: stakingData,
    isLoading: stakingLoading,
    refetch: refetchStakingData
  } = useQuery({
    queryKey: [connected && userId ? `/api/users/${userId}/staking` : null],
    enabled: !!connected && !!userId,
  });

  // Fetch total staked amount
  const { 
    data: totalStakedData,
    isLoading: totalStakedLoading,
  } = useQuery({
    queryKey: ['/api/stats/total-staked'],
  });

  // Update next reward time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNextRewardTime(getNextRewardTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate APY based on total staked and mock transaction volume
  useEffect(() => {
    if (totalStakedData) {
      const totalStaked = totalStakedData.totalStaked || 0;
      const mockTransactionVolume = 250000; // Mock value for transaction volume
      const apy = calculateAPY(totalStaked, mockTransactionVolume);
      setCurrentApy(apy);
    }
  }, [totalStakedData]);

  const handleStakeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStakeAmount(e.target.value);
  };

  const handleMaxClick = () => {
    setStakeAmount(balance.hack.toString());
  };

  const handleStake = async () => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to stake tokens",
        variant: "destructive"
      });
      return;
    }

    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to stake",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(stakeAmount) > balance.hack) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough HACK tokens",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const response = await apiRequest("POST", "/api/stake", {
        userId,
        amount: stakeAmount
      });

      const result = await response.json();

      toast({
        title: "Staking Successful",
        description: `You have staked ${formatNumber(stakeAmount)} HACK tokens`
      });

      // Reset form and refetch data
      setStakeAmount("");
      refetchStakingData();
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/staking`] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats/total-staked'] });
    } catch (error) {
      console.error("Error staking tokens:", error);
      toast({
        title: "Staking Failed",
        description: "There was an error processing your staking request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to unstake tokens",
        variant: "destructive"
      });
      return;
    }

    if (!stakingData || !stakingData.stakings || stakingData.stakings.length === 0) {
      toast({
        title: "No Staked Tokens",
        description: "You don't have any tokens staked",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // For simplicity, we'll unstake the first staking record
      const stakingId = stakingData.stakings[0].id;
      
      const response = await apiRequest("POST", "/api/unstake", {
        userId,
        stakingId
      });

      const result = await response.json();

      toast({
        title: "Unstaking Successful",
        description: `You have unstaked your HACK tokens`
      });

      // Refetch data
      refetchStakingData();
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/staking`] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats/total-staked'] });
    } catch (error) {
      console.error("Error unstaking tokens:", error);
      toast({
        title: "Unstaking Failed",
        description: "There was an error processing your unstaking request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="staking" className="py-16 bg-zinc-800 relative">
      <div className="absolute w-64 h-64 bg-[#8b5cf6] rounded-full opacity-5 -bottom-10 -left-10 blur-3xl"></div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Staking Vault</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Stake your Hacked ATM tokens to earn auto-compounding rewards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900 rounded-xl p-6 border border-gray-800 lg:col-span-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <h3 className="font-heading font-bold text-xl mb-2 md:mb-0">Stake Your Tokens</h3>
              <div className="text-sm text-gray-400">
                Your HACK Balance: <span>{formatNumber(balance.hack)} HACK</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-400 font-medium">Amount to Stake</label>
                <button 
                  className="text-xs bg-zinc-800 py-1 px-2 rounded text-[#ff3e00] border border-[#ff3e00]/30"
                  onClick={handleMaxClick}
                >
                  MAX
                </button>
              </div>
              <div className="flex rounded-lg border border-gray-700 bg-zinc-800 p-3">
                <input 
                  type="number" 
                  placeholder="0.0" 
                  className="bg-transparent flex-grow focus:outline-none text-lg" 
                  value={stakeAmount}
                  onChange={handleStakeAmountChange}
                />
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-2 bg-[#ff3e00] rounded-full flex items-center justify-center text-white text-xs font-bold">H</div>
                  <span className="font-medium">HACK</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gray-800/30 mb-6">
              <div className="flex flex-col md:flex-row md:justify-between mb-2">
                <div className="mb-2 md:mb-0">
                  <span className="text-gray-400 text-sm">Current APY</span>
                  <div className="font-heading font-bold text-2xl text-[#8b5cf6]">
                    {currentApy.toFixed(1)}%
                  </div>
                </div>
                <div className="mb-2 md:mb-0">
                  <span className="text-gray-400 text-sm">Lock Period</span>
                  <div className="font-heading font-bold text-2xl">7 days</div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Early Withdrawal Fee</span>
                  <div className="font-heading font-bold text-2xl text-red-400">5%</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                className="flex-1 bg-[#8b5cf6] text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                onClick={handleStake}
                disabled={!connected || loading || !stakeAmount || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > balance.hack}
              >
                {loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>}
                <span>Stake HACK</span>
              </button>
              <button 
                className="flex-1 bg-zinc-800 text-white border border-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                onClick={handleUnstake}
                disabled={!connected || loading || !stakingData || !stakingData?.stakings || stakingData?.stakings.length === 0}
              >
                {loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>}
                <span>Unstake HACK</span>
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6 border border-gray-800">
            <h3 className="font-heading font-bold text-xl mb-4">Your Staking Stats</h3>
            
            <div className="space-y-5">
              <div>
                <span className="text-gray-400 text-sm">Total Staked</span>
                <div className="font-heading font-bold text-2xl">
                  {stakingLoading ? (
                    <div className="h-7 w-32 bg-gray-700 animate-pulse rounded"></div>
                  ) : (
                    formatNumber(stakingData?.totalStaked || 0) + " HACK"
                  )}
                </div>
              </div>
              
              <div>
                <span className="text-gray-400 text-sm">Rewards Earned</span>
                <div className="font-heading font-bold text-2xl text-[#10b981]">
                  {stakingLoading ? (
                    <div className="h-7 w-32 bg-gray-700 animate-pulse rounded"></div>
                  ) : (
                    formatNumber(stakingData?.rewardsEarned || 0) + " HACK"
                  )}
                </div>
              </div>
              
              <div>
                <span className="text-gray-400 text-sm">Next Reward In</span>
                <div className="font-heading font-bold text-2xl">
                  {nextRewardTime}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-800">
                <span className="text-gray-400 text-sm">Staking Unlock Date</span>
                <div className="font-heading font-bold text-lg">
                  {stakingLoading ? (
                    <div className="h-6 w-40 bg-gray-700 animate-pulse rounded"></div>
                  ) : stakingData?.unlockDate ? (
                    formatTimeLeft(stakingData.unlockDate)
                  ) : (
                    "Not staking yet"
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-zinc-800 rounded-lg p-4">
              <div className="mb-2 flex justify-between items-center">
                <span className="text-gray-400 text-sm">Total Value Locked</span>
                <span className="text-sm text-[#ff3e00]">Platform-wide</span>
              </div>
              <div className="font-heading font-bold text-2xl">
                {totalStakedLoading ? (
                  <div className="h-7 w-40 bg-gray-700 animate-pulse rounded"></div>
                ) : (
                  formatNumber(totalStakedData?.totalStaked || 0) + " HACK"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
