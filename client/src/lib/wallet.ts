import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "./queryClient";
import { useToast } from "@/hooks/use-toast";

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
  
  // Fetch user balance when userId changes or on connect
  useEffect(() => {
    async function fetchUserBalance() {
      if (userId) {
        try {
          const response = await apiRequest('GET', `/api/users/${userId}`);
          const user = await response.json();
          
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

  // This function is simplified for the modal to call directly
  const connect = async () => {
    // This is now empty as we're handling connection in the modal
    console.log("Connect function called, but connection is handled directly in modal.");
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
    setBalance({ sol: 14.5, hack: 0 });
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
    
    // Reload the page to ensure all state is reset cleanly
    window.location.reload();
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
