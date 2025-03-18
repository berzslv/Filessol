import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(number: number | string, options?: { decimals?: number, prefix?: string, suffix?: string }) {
  const num = typeof number === 'string' ? parseFloat(number) : number;
  const decimals = options?.decimals ?? 0;
  const prefix = options?.prefix ?? '';
  const suffix = options?.suffix ?? '';
  
  return `${prefix}${num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
}

export function shortenAddress(address: string, startLength = 6, endLength = 4) {
  if (address.length <= startLength + endLength) {
    return address;
  }
  
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

export function formatTimeLeft(date: Date | string) {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  // If the date is in the past
  if (targetDate <= now) {
    return 'Unlocked';
  }
  
  const diffInMs = targetDate.getTime() - now.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} left`;
  }
  
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  
  if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} left`;
  }
  
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  
  return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} left`;
}

export function calculateAPY(totalStaked: number, transactionVolume: number) {
  // Mock APY calculation based on total staked and transaction volume
  // In a real app this would come from the smart contract or backend
  const baseAPY = 50; // 50% base APY
  
  if (totalStaked <= 0) {
    return baseAPY;
  }
  
  // More transactions = higher APY, more tokens staked = lower APY
  const volumeFactor = Math.min(transactionVolume / 10000, 3); // Cap at 3x
  const stakingFactor = Math.max(1 - (totalStaked / 10000000) * 0.5, 0.5); // Floor at 0.5x
  
  return baseAPY * volumeFactor * stakingFactor;
}

export function formatDate(date: Date | string, formatStr = 'MMM d, yyyy') {
  return format(new Date(date), formatStr);
}

export function formatRelativeTime(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function getNextRewardTime() {
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  // Rewards are distributed every 30 minutes (at 0 and 30 minutes)
  let minutesUntilNext = minutes < 30 ? 30 - minutes : 60 - minutes;
  const secondsUntilNext = 60 - seconds;
  
  if (secondsUntilNext < 60) {
    minutesUntilNext -= 1;
  }
  
  return `${minutesUntilNext.toString().padStart(2, '0')}:${secondsUntilNext.toString().padStart(2, '0')}`;
}
