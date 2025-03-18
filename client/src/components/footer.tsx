import { Camera, Twitter, Github, Linkedin, Wallet } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="py-12 bg-zinc-800 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Camera className="w-8 h-8 text-[#ff3e00]" />
              <h2 className="ml-2 text-xl font-heading font-bold text-white">Hacked<span className="text-[#ff3e00]">ATM</span></h2>
            </div>
            <p className="text-gray-400 mb-6">
              A Solana-based token with built-in referral system and staking vault, designed to provide passive income opportunities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Wallet className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-white transition">Home</a></li>
              <li><a href="#buy" className="text-gray-400 hover:text-white transition">Buy Tokens</a></li>
              <li><a href="#staking" className="text-gray-400 hover:text-white transition">Staking Vault</a></li>
              <li><a href="#referral" className="text-gray-400 hover:text-white transition">Referral Program</a></li>
              <li><a href="#leaderboard" className="text-gray-400 hover:text-white transition">Leaderboards</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-white transition">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Whitepaper</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Smart Contract</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Audit Report</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Token Info</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Hacked ATM. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
