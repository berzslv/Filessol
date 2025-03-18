import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useWallet } from "@/lib/wallet";
import { useToast } from "@/hooks/use-toast";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connect } = useWallet();
  const { toast } = useToast();

  const handleWalletConnectClick = async () => {
    try {
      await connect();
      onClose();
    } catch (error) {
      console.error("WalletConnect error:", error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect with WalletConnect. Please try again.",
      });
    }
  };

  const handlePhantomClick = () => {
    toast({
      title: "Use WalletConnect Instead",
      description: "Please use WalletConnect to connect your Phantom wallet for the best experience.",
    });
  };

  const handleSolflareClick = () => {
    toast({
      title: "Use WalletConnect Instead",
      description: "Please use WalletConnect to connect your Solflare wallet for the best experience.",
    });
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
            Choose your preferred wallet provider to connect to our platform.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-2">
          <button 
            className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-900 hover:bg-zinc-950 transition border border-gray-800"
            onClick={handlePhantomClick}
          >
            <div className="flex items-center">
              <svg width="32" height="32" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                <rect width="128" height="128" rx="64" fill="#AB9FF2"/>
                <path d="M110.584 64.9142H99.142C99.142 41.7651 80.173 23 56.7724 23C33.753 23 15 41.4516 15 64.8142C15 87.8237 33.371 106.275 56.7724 106.275H64.0222C85.6991 106.275 103.115 89.136 103.115 67.7005L110.584 64.9142Z" fill="#FFFFFF"/>
                <path d="M98.0377 71.8172H109.5C109.735 71.8172 109.946 71.6321 109.97 71.3982C110.218 68.4555 110.218 65.4842 109.97 62.5415C109.946 62.3075 109.735 62.1224 109.5 62.1224H98.0377V71.8172Z" fill="#FFFFFF"/>
              </svg>
              <span className="font-medium">Phantom</span>
            </div>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          
          <button 
            className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-900 hover:bg-zinc-950 transition border border-gray-800"
            onClick={handleSolflareClick}
          >
            <div className="flex items-center">
              <svg width="32" height="32" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                <path d="M63.94 42.63H13.44C11.98 42.63 10.82 43.8 10.82 45.25C10.82 45.89 11.11 46.48 11.58 46.89L32.02 64.13L11.58 81.37C11.12 81.78 10.82 82.37 10.82 83.01C10.82 84.46 11.99 85.63 13.44 85.63H63.94C64.59 85.63 65.18 85.33 65.58 84.87L116.03 67.63C116.9 66.89 116.9 65.61 116.03 64.87L65.59 47.63C65.18 47.17 64.59 42.63 63.94 42.63Z" fill="url(#paint0_linear)"/>
                <defs>
                  <linearGradient id="paint0_linear" x1="63.5" y1="42.63" x2="63.5" y2="85.63" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9945FF"/>
                    <stop offset="1" stopColor="#14F195"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="font-medium">Solflare</span>
            </div>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          
          <button 
            className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-900 hover:bg-zinc-950 transition border border-gray-800"
            onClick={handleWalletConnectClick}
          >
            <div className="flex items-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                <path d="M9.58818 11.8556C13.1293 8.31442 18.8707 8.31442 22.4118 11.8556L22.8336 12.2774C23.0097 12.4535 23.0097 12.7383 22.8336 12.9144L21.1664 14.5817C21.0784 14.6697 20.936 14.6697 20.8479 14.5817L20.2799 14.0137C17.8252 11.559 14.1748 11.559 11.7201 14.0137L11.1161 14.6177C11.028 14.7058 10.8856 14.7058 10.7976 14.6177L9.13034 12.9504C8.95427 12.7743 8.95427 12.4895 9.13034 12.3135L9.58818 11.8556ZM25.4268 14.8706L26.9215 16.3653C27.0976 16.5414 27.0976 16.8261 26.9215 17.0022L20.8479 23.0758C20.6718 23.2519 20.387 23.2519 20.211 23.0758L16.0964 18.9613C16.0524 18.9173 15.9476 18.9173 15.9036 18.9613L11.789 23.0758C11.6129 23.2519 11.3282 23.2519 11.1521 23.0758L5.07852 17.0022C4.90245 16.8261 4.90245 16.5414 5.07852 16.3653L6.57319 14.8706C6.74926 14.6945 7.03402 14.6945 7.21009 14.8706L11.3247 18.9851C11.3687 19.0291 11.4734 19.0291 11.5175 18.9851L15.632 14.8706C15.8081 14.6945 16.0929 14.6945 16.2689 14.8706L20.3835 18.9851C20.4275 19.0291 20.5323 19.0291 20.5763 18.9851L24.6909 14.8706C24.867 14.6945 25.1518 14.6945 25.3278 14.8706Z" fill="#3B99FC"/>
              </svg>
              <span className="font-medium">WalletConnect</span>
            </div>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>
            By connecting your wallet, you agree to our <a href="#" className="text-[#ff3e00] hover:underline">Terms of Service</a> and <a href="#" className="text-[#ff3e00] hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
