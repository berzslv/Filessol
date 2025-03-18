import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the Hacked ATM token
  
  // Get user by wallet address
  app.get("/api/users/wallet/:address", async (req, res) => {
    try {
      const walletAddress = req.params.address;
      const user = await storage.getUserByWalletAddress(walletAddress);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.json(user);
    } catch (error) {
      console.error("Error fetching user by wallet:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Create a new user when wallet is connected
  app.post("/api/users", async (req, res) => {
    try {
      const userSchema = z.object({
        walletAddress: z.string(),
        referredBy: z.string().optional().nullable()
      });
      
      const parsedData = userSchema.safeParse(req.body);
      
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid input" });
      }
      
      const { walletAddress, referredBy } = parsedData.data;
      
      // Check if user already exists
      const existingUser = await storage.getUserByWalletAddress(walletAddress);
      if (existingUser) {
        return res.json(existingUser);
      }
      
      // Validate referral code if provided
      if (referredBy) {
        const referrer = await storage.getUserByReferralCode(referredBy);
        if (!referrer) {
          return res.status(400).json({ message: "Invalid referral code" });
        }
      }
      
      // Generate a unique username and referral code
      const username = `user_${Math.random().toString(36).substring(2, 10)}`;
      const referralCode = `REF${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      
      // Set an initial wallet balance for new users
      const initialBalance = "500"; // Initial HACK token balance for new users
      
      const newUser = await storage.createUser({
        username,
        password: Math.random().toString(36).substring(2, 15),
        walletAddress,
        referralCode,
        referredBy: referredBy || null,
        walletBalance: initialBalance
      });
      
      // If user was referred, create a referral record
      if (referredBy) {
        const referrer = await storage.getUserByReferralCode(referredBy);
        if (referrer) {
          await storage.createReferral({
            referrerId: referrer.id,
            referredId: newUser.id,
            rewardAmount: '0' // Will be updated when they make a transaction
          });
        }
      }
      
      return res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Get user's referral data
  app.get("/api/users/:userId/referrals", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const referrals = await storage.getUserReferrals(userId);
      
      // Calculate total rewards
      const totalRewards = referrals.reduce((sum, ref) => sum + Number(ref.rewardAmount || 0), 0);
      
      return res.json({
        referralCode: user.referralCode,
        totalReferrals: referrals.length,
        totalRewards,
        referrals
      });
    } catch (error) {
      console.error("Error fetching referrals:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Get user's staking data
  app.get("/api/users/:userId/staking", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const stakings = await storage.getStakingByUser(userId);
      const activeStakings = stakings.filter(s => s.isActive);
      
      // Calculate total staked amount and rewards
      const totalStaked = activeStakings.reduce((sum, stake) => sum + Number(stake.amount), 0);
      // Mock rewards calculation - in a real app would be based on actual rewards distribution
      const rewardsEarned = totalStaked * 0.02; // 2% rewards for demo
      
      // Get the next unlock date
      let unlockDate = null;
      if (activeStakings.length > 0) {
        unlockDate = activeStakings.sort((a, b) => 
          new Date(a.unlockDate).getTime() - new Date(b.unlockDate).getTime()
        )[0].unlockDate;
      }
      
      return res.json({
        totalStaked,
        rewardsEarned,
        unlockDate,
        stakings: activeStakings
      });
    } catch (error) {
      console.error("Error fetching staking data:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Stake tokens
  app.post("/api/stake", async (req, res) => {
    try {
      const stakeSchema = z.object({
        userId: z.number(),
        amount: z.string()
      });
      
      const parsedData = stakeSchema.safeParse(req.body);
      
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid input" });
      }
      
      const { userId, amount } = parsedData.data;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Calculate unlock date (7 days from now)
      const unlockDate = new Date();
      unlockDate.setDate(unlockDate.getDate() + 7);
      
      const staking = await storage.createStaking({
        userId,
        amount,
        startDate: new Date(),
        unlockDate,
        isActive: true
      });
      
      // Create a transaction record for the staking
      await storage.createTransaction({
        userId,
        type: 'stake',
        amount,
        fee: '0',
        referralBonus: '0',
        transactionHash: `tx_${Math.random().toString(36).substring(2, 15)}`
      });
      
      return res.status(201).json(staking);
    } catch (error) {
      console.error("Error staking tokens:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Unstake tokens
  app.post("/api/unstake", async (req, res) => {
    try {
      const unstakeSchema = z.object({
        userId: z.number(),
        stakingId: z.number()
      });
      
      const parsedData = unstakeSchema.safeParse(req.body);
      
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid input" });
      }
      
      const { userId, stakingId } = parsedData.data;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const staking = await storage.getStakingByUser(userId);
      const stakingRecord = staking.find(s => s.id === stakingId);
      
      if (!stakingRecord) {
        return res.status(404).json({ message: "Staking record not found" });
      }
      
      if (!stakingRecord.isActive) {
        return res.status(400).json({ message: "Staking is already inactive" });
      }
      
      // Check if we need to apply early withdrawal fee
      const now = new Date();
      const unlockDate = new Date(stakingRecord.unlockDate);
      let fee = '0';
      let amount = stakingRecord.amount.toString();
      
      if (now < unlockDate) {
        // Apply 5% fee for early withdrawal
        fee = (Number(stakingRecord.amount) * 0.05).toString();
        amount = (Number(stakingRecord.amount) - Number(fee)).toString();
      }
      
      // Update staking record
      const updatedStaking = await storage.updateStaking(stakingId, false);
      
      // Create a transaction record for the unstaking
      await storage.createTransaction({
        userId,
        type: 'unstake',
        amount,
        fee,
        referralBonus: '0',
        transactionHash: `tx_${Math.random().toString(36).substring(2, 15)}`
      });
      
      return res.json(updatedStaking);
    } catch (error) {
      console.error("Error unstaking tokens:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Buy tokens
  app.post("/api/buy", async (req, res) => {
    try {
      const buySchema = z.object({
        userId: z.number(),
        solAmount: z.number(),
        hackAmount: z.number(),
        referralCode: z.string().optional()
      });
      
      const parsedData = buySchema.safeParse(req.body);
      
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid input" });
      }
      
      const { userId, solAmount, hackAmount, referralCode } = parsedData.data;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Calculate fees
      const totalFee = hackAmount * 0.08; // 8% fee
      const marketingFee = hackAmount * 0.01; // 1% for marketing
      const stakingFee = hackAmount * 0.02; // 2% for staking rewards
      let referralFee = hackAmount * 0.05; // 5% for referrer
      let referralBonus = '0';
      
      // If referral code is provided and valid, update the referral record
      if (referralCode) {
        const referrer = await storage.getUserByReferralCode(referralCode);
        if (referrer) {
          // Find the referral record
          const referrals = await storage.getUserReferrals(referrer.id);
          const referralRecord = referrals.find(r => r.referredId === userId);
          
          if (referralRecord) {
            // Update the reward amount
            referralBonus = referralFee.toString();
            
            // In a real implementation we'd update the referral record with the new reward
            // For this demo we'll simulate it
          }
        }
      }
      
      // Create transaction record
      const transaction = await storage.createTransaction({
        userId,
        type: 'buy',
        amount: hackAmount.toString(),
        fee: totalFee.toString(),
        referralBonus,
        transactionHash: `tx_${Math.random().toString(36).substring(2, 15)}`
      });
      
      // Update user's wallet balance
      // In a real application, this would be handled by the blockchain
      // Here we're simulating it in our database
      const currentBalance = user.walletBalance ? parseFloat(user.walletBalance.toString()) : 0;
      const newBalance = currentBalance + hackAmount;
      
      // We'd update the user's wallet balance here
      // In a real implementation, we'd have a method to update user fields
      // For now, we'll respond with the new balance in the transaction data
      
      return res.status(201).json({
        transaction,
        details: {
          solAmount,
          hackAmount,
          newBalance: newBalance,
          fees: {
            total: totalFee,
            marketing: marketingFee,
            staking: stakingFee,
            referral: referralFee
          },
          referralBonus: Number(referralBonus)
        }
      });
    } catch (error) {
      console.error("Error buying tokens:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Get total staked amount
  app.get("/api/stats/total-staked", async (req, res) => {
    try {
      const totalStaked = await storage.getTotalStaked();
      
      return res.json({
        totalStaked
      });
    } catch (error) {
      console.error("Error fetching total staked:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Get leaderboards
  app.get("/api/leaderboards", async (req, res) => {
    try {
      const leaderboards = await storage.getAllLeaderboards();
      return res.json(leaderboards);
    } catch (error) {
      console.error("Error fetching leaderboards:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
