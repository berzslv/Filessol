import { useState } from "react";
import { Link } from "wouter";
import { Camera } from "lucide-react";
import { useWallet } from "@/lib/wallet";
import WalletModal from "./wallet-modal";

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
}

const NavLink = ({ href, label, onClick }: NavLinkProps) => (
  <a 
    href={href} 
    className="hover:text-white transition" 
    onClick={onClick}
  >
    {label}
  </a>
);

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const { connected, address, disconnect } = useWallet();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const openWalletModal = () => {
    setWalletModalOpen(true);
  };

  const closeWalletModal = () => {
    setWalletModalOpen(false);
  };

  return (
    <>
      <nav className="relative z-50 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center">
              <Camera className="w-8 h-8 text-[#ff3e00]" />
              <h1 className="ml-2 text-xl font-heading font-bold text-white">Hacked<span className="text-[#ff3e00]">ATM</span></h1>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-8 text-gray-400">
            <NavLink href="#home" label="Home" />
            <NavLink href="#buy" label="Buy" />
            <NavLink href="#staking" label="Staking" />
            <NavLink href="#referral" label="Referral" />
            <NavLink href="#leaderboard" label="Leaderboard" />
            <NavLink href="#faq" label="FAQ" />
          </div>
          
          {connected ? (
            <button 
              onClick={disconnect}
              className="bg-[#ff3e00] hover:bg-opacity-80 transition px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2"
            >
              <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </button>
          ) : (
            <button 
              onClick={openWalletModal}
              className="bg-[#ff3e00] hover:bg-opacity-80 transition px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
              </svg>
              <span>Connect Wallet</span>
            </button>
          )}
          
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-zinc-800 absolute w-full border-b border-gray-800">
            <div className="px-4 py-3 space-y-4">
              <NavLink href="#home" label="Home" onClick={() => setMobileMenuOpen(false)} />
              <NavLink href="#buy" label="Buy" onClick={() => setMobileMenuOpen(false)} />
              <NavLink href="#staking" label="Staking" onClick={() => setMobileMenuOpen(false)} />
              <NavLink href="#referral" label="Referral" onClick={() => setMobileMenuOpen(false)} />
              <NavLink href="#leaderboard" label="Leaderboard" onClick={() => setMobileMenuOpen(false)} />
              <NavLink href="#faq" label="FAQ" onClick={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}
      </nav>

      <WalletModal 
        isOpen={walletModalOpen} 
        onClose={closeWalletModal} 
      />
    </>
  );
}
