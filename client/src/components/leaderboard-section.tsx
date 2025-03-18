import { useState } from "react";
import { Wallet, Activity, Ban } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatNumber } from "@/lib/utils";

interface LeaderboardUser {
  id: number;
  walletAddress: string;
  displayAddress: string;
  value: number;
  bonus?: string;
  percentage?: number;
}

export default function LeaderboardSection() {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
  
  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ['/api/leaderboards'],
  });

  const handleTabChange = (tab: 'weekly' | 'monthly') => {
    setActiveTab(tab);
  };

  // Render a single leaderboard position
  const renderLeaderboardPosition = (user: LeaderboardUser, position: number, type: 'referrer' | 'staker') => {
    const colors = {
      1: {
        bg: 'bg-[#ff3e00]/20',
        text: 'text-[#ff3e00]'
      },
      2: {
        bg: 'bg-[#8b5cf6]/20',
        text: 'text-[#8b5cf6]'
      },
      3: {
        bg: 'bg-[#10b981]/20',
        text: 'text-[#10b981]'
      }
    };

    const color = colors[position as keyof typeof colors] || colors[3];
    const showBadge = position === 1;
    
    return (
      <div className="flex items-center mb-6" key={user.id}>
        <div className="relative mr-4">
          <div className={`w-16 h-16 ${color.bg} rounded-full flex items-center justify-center text-2xl font-bold ${color.text}`}>
            {position}
          </div>
          {showBadge && (
            <div className="absolute -top-2 -right-2 bg-[#ff3e00] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
            </div>
          )}
        </div>
        <div className="flex-grow">
          <div className="flex items-center">
            <span className="font-medium">{user.displayAddress}</span>
            <span className={`ml-2 px-2 py-0.5 text-xs ${type === 'referrer' ? 'bg-[#ff3e00]/20 text-[#ff3e00]' : 'bg-[#8b5cf6]/20 text-[#8b5cf6]'} rounded-full`}>
              {user.bonus}
            </span>
          </div>
          <div className="mt-1 h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={`h-full ${type === 'referrer' ? 'bg-[#ff3e00]' : 'bg-[#8b5cf6]'} rounded-full`} 
              style={{ width: `${user.percentage}%` }}
            ></div>
          </div>
          <div className="mt-1 text-sm text-gray-400">
            {type === 'referrer' ? 'Earned: ' : 'Staked: '}
            {formatNumber(user.value)} HACK
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="leaderboard" className="py-16 bg-zinc-800 relative">
      <div className="absolute w-64 h-64 bg-[#10b981] rounded-full opacity-5 bottom-20 left-20 blur-3xl"></div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Leaderboards</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Compete with other users to earn additional rewards and recognition.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap border-b border-gray-700">
            <button 
              className={`font-medium py-2 px-4 border-b-2 ${activeTab === 'weekly' ? 'text-white border-[#10b981]' : 'text-gray-400 border-transparent hover:text-white transition'}`}
              onClick={() => handleTabChange('weekly')}
            >
              Weekly
            </button>
            <button 
              className={`font-medium py-2 px-4 border-b-2 ${activeTab === 'monthly' ? 'text-white border-[#10b981]' : 'text-gray-400 border-transparent hover:text-white transition'}`}
              onClick={() => handleTabChange('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Referrers */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-gray-800">
            <h3 className="font-heading font-bold text-xl mb-4 flex items-center">
              <Wallet className="w-5 h-5 text-[#ff3e00] mr-2" />
              Top Referrers
            </h3>

            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full animate-pulse mr-4"></div>
                    <div className="flex-grow">
                      <div className="h-4 w-36 bg-gray-700 animate-pulse rounded mb-2"></div>
                      <div className="h-2 w-full bg-gray-700 animate-pulse rounded mb-2"></div>
                      <div className="h-3 w-24 bg-gray-700 animate-pulse rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {leaderboardData && leaderboardData[activeTab] && leaderboardData[activeTab].referrers ? (
                  leaderboardData[activeTab].referrers.map((user: LeaderboardUser, index: number) => (
                    renderLeaderboardPosition(user, index + 1, 'referrer')
                  ))
                ) : (
                  <div className="flex items-center justify-center h-40">
                    <div className="text-center">
                      <Ban className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-gray-400">No data available</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Top Stakers */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-gray-800">
            <h3 className="font-heading font-bold text-xl mb-4 flex items-center">
              <Activity className="w-5 h-5 text-[#8b5cf6] mr-2" />
              Top Stakers
            </h3>

            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full animate-pulse mr-4"></div>
                    <div className="flex-grow">
                      <div className="h-4 w-36 bg-gray-700 animate-pulse rounded mb-2"></div>
                      <div className="h-2 w-full bg-gray-700 animate-pulse rounded mb-2"></div>
                      <div className="h-3 w-24 bg-gray-700 animate-pulse rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {leaderboardData && leaderboardData[activeTab] && leaderboardData[activeTab].stakers ? (
                  leaderboardData[activeTab].stakers.map((user: LeaderboardUser, index: number) => (
                    renderLeaderboardPosition(user, index + 1, 'staker')
                  ))
                ) : (
                  <div className="flex items-center justify-center h-40">
                    <div className="text-center">
                      <Ban className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-gray-400">No data available</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
