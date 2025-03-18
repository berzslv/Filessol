import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useWallet } from "@/lib/wallet";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connect } = useWallet();
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to directly connect to the backend with a wallet address
  const connectDirectly = async () => {
    if (!walletAddress.trim()) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please enter a wallet address to continue",
      });
      return;
    }

    setLoading(true);

    try {
      // Clear any existing user data from localStorage to prevent stale data
      localStorage.removeItem("walletAddress");
      localStorage.removeItem("userId");
      localStorage.removeItem("referralCode");
      
      // Call the API to register/get the user
      const response = await apiRequest("POST", "/api/users", {
        walletAddress: walletAddress.trim(),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const user = await response.json();
      console.log("Got user from API:", user);

      if (!user || !user.id) {
        throw new Error("Invalid user data received from server");
      }

      // Use the connect function from context
      connect(walletAddress, user.id, user.referralCode);

      // Close the modal first
      onClose();
      
      // Show a success confirmation
      toast({
        title: "Connection Successful",
        description: `Wallet ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)} connected! You can now use the Buy section to purchase tokens.`,
      });
      
      // Force reload the page to ensure all components pick up the new wallet state
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error connecting:", error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect. Please try again.",
      });
      
      // Clear any partial state
      localStorage.removeItem("walletAddress");
      localStorage.removeItem("userId");
      localStorage.removeItem("referralCode");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-zinc-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Connect Wallet</DialogTitle>
            <button onClick={onClose} className="text-gray-500 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>
          <DialogDescription className="text-gray-400">
            Enter any wallet address to connect in demo mode
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Wallet Address
            </label>
            <div className="mt-1">
              <input
                type="text"
                className="w-full px-3 py-2 bg-zinc-900 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ff3e00] focus:border-transparent"
                placeholder="Enter any wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
            </div>
            <p className="mt-2 text-sm text-gray-400">
              For testing, you can enter any text as your wallet address
            </p>
          </div>
          
          <button
            className="w-full px-4 py-3 rounded-md bg-[#ff3e00] text-white font-bold hover:bg-opacity-90 transition flex justify-center items-center"
            onClick={connectDirectly}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Connecting...</span>
              </>
            ) : (
              <span>Connect Wallet</span>
            )}
          </button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>
            By connecting, you agree to our <a href="#" className="text-[#ff3e00] hover:underline">Terms of Service</a> and <a href="#" className="text-[#ff3e00] hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
