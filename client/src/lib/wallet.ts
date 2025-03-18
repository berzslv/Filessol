import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "./queryClient";
import { useToast } from "@/hooks/use-toast";

interface WalletContextType {
  connected: boolean;
  address: string | null;
  userId: number | null;
  referralCode: string | null;
  connect: (address: string, id: number, refCode: string) => void;
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
  connect: () => {},
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

// Create PERSISTENT wallet state
const getSavedWalletAddress = () => localStorage.getItem("walletAddress");
const getSavedUserId = () => {
  const id = localStorage.getItem("userId");
  return id ? parseInt(id) : null;
};
const getSavedReferralCode = () => localStorage.getItem("referralCode");

export const WalletProvider = ({ children }: WalletProviderProps) => {
  // Initialize from localStorage immediately
  const [connected, setConnected] = useState(() => !!getSavedWalletAddress());
  const [address, setAddress] = useState<string | null>(() => getSavedWalletAddress());
  const [userId, setUserId] = useState<number | null>(() => getSavedUserId());
  const [referralCode, setReferralCode] = useState<string | null>(() => getSavedReferralCode());
  
  // Default SOL balance set higher for demo purposes
  const [balance, setBalance] = useState({ sol: 25.0, hack: 0 });
  const { toast } = useToast();
  
  // Fetch user balance when userId changes or on connect
  useEffect(() => {
    async function fetchUserBalance() {
      if (userId) {
        try {
          console.log("Fetching balance for user ID:", userId);
          const response = await apiRequest('GET', `/api/users/${userId}`);
          
          if (!response.ok) {
            console.error("Failed to fetch user data:", response.status);
            return;
          }
          
          const user = await response.json();
          console.log("Got user data:", user);
          
          if (user && user.walletBalance) {
            setBalance(prev => ({
              ...prev,
              hack: parseFloat(user.walletBalance)
            }));
          }
        } catch (error) {
          console.error("Error fetching user balance:", error);
        }
      }
    }
    
    fetchUserBalance();
  }, [userId]);
  
  // Direct connect function that can be called from modal
  const connect = (walletAddress: string, id: number, refCode: string) => {
    console.log(`Connecting wallet: address=${walletAddress}, id=${id}, refCode=${refCode}`);
    
    // Update state
    setAddress(walletAddress);
    setUserId(id);
    setReferralCode(refCode);
    setConnected(true);
    
    // This ensures localStorage is set properly
    localStorage.setItem("walletAddress", walletAddress);
    localStorage.setItem("userId", id.toString());
    localStorage.setItem("referralCode", refCode);
    
    console.log("Wallet connected, localStorage set");
  };

  const disconnect = () => {
    setAddress(null);
    setUserId(null);
    setReferralCode(null);
    setConnected(false);
    
    // Clear localStorage
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("userId");
    localStorage.removeItem("referralCode");
    
    // Reset balance
    setBalance({ sol: 25.0, hack: 0 });
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
    
    // Reload the page to ensure all state is reset cleanly
    window.location.reload();
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        address,
        userId,
        referralCode,
        connect,
        disconnect,
        balance
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
