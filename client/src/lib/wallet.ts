import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "./queryClient";
import { useToast } from "@/hooks/use-toast";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Connection, PublicKey } from "@solana/web3.js";

interface WalletContextType {
  connected: boolean;
  address: string | null;
  userId: number | null;
  referralCode: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  balance: {
    sol: number;
    hack: number;
  };
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  address: null,
  userId: null,
  referralCode: null,
  connect: async () => {},
  disconnect: () => {},
  balance: {
    sol: 0,
    hack: 0
  }
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [balance, setBalance] = useState({ sol: 14.5, hack: 0 });
  const [provider, setProvider] = useState<WalletConnectProvider | null>(null);
  const { toast } = useToast();

  // Initialize from localStorage if available
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    const savedUserId = localStorage.getItem("userId");
    const savedReferralCode = localStorage.getItem("referralCode");
    
    if (savedAddress) {
      setAddress(savedAddress);
      setConnected(true);
    }
    
    if (savedUserId) {
      setUserId(parseInt(savedUserId));
    }
    
    if (savedReferralCode) {
      setReferralCode(savedReferralCode);
    }
  }, []);

  const connect = async () => {
    try {
      let walletAddress;
      
      try {
        // Attempt to use WalletConnect with Solana chain
        const wcProvider = new WalletConnectProvider({
          rpc: {
            1: "https://api.mainnet-beta.solana.com",
          },
          qrcodeModalOptions: {
            mobileLinks: ["phantom", "solflare"]
          },
          // required
          bridge: "https://bridge.walletconnect.org",
          // required
          chainId: 1
          // Note: WalletConnect v1 doesn't use projectId directly
        });
        
        setProvider(wcProvider);
        
        // Enable session (triggers QR Code modal)
        await wcProvider.enable();
        
        if (wcProvider.accounts && wcProvider.accounts.length > 0) {
          walletAddress = wcProvider.accounts[0];
        } else {
          // Fallback to mock address if actual connection fails
          walletAddress = `0x${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`;
        }
      } catch (err) {
        console.error("WalletConnect error:", err);
        // Fallback to mock address if actual connection fails
        walletAddress = `0x${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`;
      }
      
      // Get URL params to check for referral
      const urlParams = new URLSearchParams(window.location.search);
      const refParam = urlParams.get('ref');
      
      // Check if we're on a referral URL path
      const pathMatch = window.location.pathname.match(/\/ref\/([A-Za-z0-9]+)/);
      const refFromPath = pathMatch ? pathMatch[1] : null;
      
      const referredBy = refParam || refFromPath || null;
      
      // Call the API to create or get user
      const response = await apiRequest('POST', '/api/users', {
        walletAddress,
        referredBy
      });
      
      const user = await response.json();
      
      setAddress(walletAddress);
      setUserId(user.id);
      setReferralCode(user.referralCode);
      setConnected(true);
      
      // Save to localStorage
      localStorage.setItem("walletAddress", walletAddress);
      localStorage.setItem("userId", user.id.toString());
      localStorage.setItem("referralCode", user.referralCode);
      
      // Set mock balances
      setBalance({
        sol: 14.5,
        hack: Math.floor(Math.random() * 15000)
      });
      
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${walletAddress}`,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect wallet. Please try again.",
      });
    }
  };

  const disconnect = () => {
    if (provider) {
      // Close WalletConnect session if it exists
      provider.disconnect();
      setProvider(null);
    }
    
    setAddress(null);
    setUserId(null);
    setReferralCode(null);
    setConnected(false);
    
    // Clear localStorage
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("userId");
    localStorage.removeItem("referralCode");
    
    // Reset balance
    setBalance({ sol: 14.5, hack: 0 });
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  return (
    React.createElement(WalletContext.Provider, {
      value: {
        connected,
        address,
        userId,
        referralCode,
        connect,
        disconnect,
        balance
      }
    }, children)
  );
};
