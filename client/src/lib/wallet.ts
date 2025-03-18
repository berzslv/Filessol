// lib/wallet.js
import { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import WalletConnectProvider from "@walletconnect/client";
import { useToast } from "@/hooks/use-toast";  // Assuming you have a custom toast hook

export function useWallet() {
  const [connected, setConnected] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [balance, setBalance] = useState({ sol: 0, hack: 0 });
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const { toast } = useToast();

  const connectWallet = async () => {
    try {
      // Initialize WalletConnect provider
      const provider = new WalletConnectProvider({
        rpc: {
          solana: "https://api.mainnet-beta.solana.com", // Solana RPC URL
        },
      });

      // Enable WalletConnect session
      await provider.enable();

      // Get connected account
      const accounts = provider.accounts;
      const account = accounts[0]; // First connected wallet address
      console.log("Connected wallet:", account);

      // Set public key
      const pubKey = new PublicKey(account);
      setPublicKey(pubKey);
      setConnected(true);

      // Fetch the SOL balance of the wallet
      const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
      const solBalance = await connection.getBalance(pubKey);
      const formattedSolBalance = solBalance / 1e9;  // Convert lamports to SOL
      setBalance({ sol: formattedSolBalance, hack: 0 }); // Assuming HACK balance is 0 for now

      // You can set userId or other logic based on your app's requirements
      setUserId(1);  // Example: Use logic for your user ID

    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Unable to connect to your wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setUserId(null);
    setBalance({ sol: 0, hack: 0 });
    setPublicKey(null);
  };

  return {
    connected,
    connectWallet,
    disconnectWallet,
    userId,
    balance,
    publicKey,
  };
}
