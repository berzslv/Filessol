export default function TokenomicsSection() {
  return (
    <section className="bg-zinc-800 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Tokenomics</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Our innovative economic model rewards holders, referrers, and stakers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 rounded-xl p-6 border border-gray-800">
            <h3 className="font-heading font-bold text-xl mb-4 text-[#ff3e00]">Transaction Fees</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Referrer Fee</span>
                <span className="text-white font-medium">5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Stakers Reward</span>
                <span className="text-white font-medium">2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Marketing</span>
                <span className="text-white font-medium">1%</span>
              </div>
              <div className="border-t border-gray-800 my-2 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Fee</span>
                  <span className="text-[#ff3e00] font-bold">8%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6 border border-gray-800">
            <h3 className="font-heading font-bold text-xl mb-4 text-[#8b5cf6]">Staking Features</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Early Withdrawal Fee</span>
                <span className="text-white font-medium">5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Lock Period</span>
                <span className="text-white font-medium">7 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Reward Distribution</span>
                <span className="text-white font-medium">Every 30 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Auto-compound</span>
                <span className="text-green-500 font-medium">Enabled</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6 border border-gray-800">
            <h3 className="font-heading font-bold text-xl mb-4 text-[#10b981]">Rewards System</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Weekly Leaderboard</span>
                <span className="text-white font-medium">Top 3 Rewards</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Monthly Leaderboard</span>
                <span className="text-white font-medium">Top 3 Rewards</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Top Staker Bonus</span>
                <span className="text-white font-medium">+1% APY</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Recognition</span>
                <span className="text-white font-medium">Website Feature</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
