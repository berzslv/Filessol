import { 
  users, type User, type InsertUser,
  staking, type Staking, type InsertStaking,
  transactions, type Transaction, type InsertTransaction,
  referrals, type Referral, type InsertReferral,
  leaderboard, type Leaderboard, type InsertLeaderboard,
  type LeaderboardData, type LeaderboardUser
} from "@shared/schema";
import { addDays } from "date-fns";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByWalletAddress(address: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByReferralCode(code: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserReferrals(userId: number): Promise<Referral[]>;
  updateUserBalance(userId: number, newBalance: string): Promise<User | undefined>;
  
  // Staking methods
  getStakingByUser(userId: number): Promise<Staking[]>;
  createStaking(staking: InsertStaking): Promise<Staking>;
  updateStaking(id: number, isActive: boolean): Promise<Staking | undefined>;
  getTotalStaked(): Promise<number>;
  
  // Transaction methods
  getUserTransactions(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Referral methods
  getReferral(id: number): Promise<Referral | undefined>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  
  // Leaderboard methods
  getLeaderboard(type: string, period: string): Promise<Leaderboard | undefined>;
  createLeaderboard(leaderboard: InsertLeaderboard): Promise<Leaderboard>;
  getAllLeaderboards(): Promise<LeaderboardData>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private stakings: Map<number, Staking>;
  private transactions: Map<number, Transaction>;
  private referrals: Map<number, Referral>;
  private leaderboards: Map<string, Leaderboard>;
  currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.stakings = new Map();
    this.transactions = new Map();
    this.referrals = new Map();
    this.leaderboards = new Map();
    this.currentId = {
      users: 1,
      stakings: 1,
      transactions: 1,
      referrals: 1,
      leaderboards: 1
    };
    
    // Initialize with mock data for development
    this.initializeMockData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByWalletAddress(address: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === address,
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByReferralCode(code: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.referralCode === code,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUserReferrals(userId: number): Promise<Referral[]> {
    return Array.from(this.referrals.values()).filter(
      (referral) => referral.referrerId === userId
    );
  }
  
  async updateUserBalance(userId: number, newBalance: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      const updatedUser = { ...user, walletBalance: newBalance };
      this.users.set(userId, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  // Staking methods
  async getStakingByUser(userId: number): Promise<Staking[]> {
    return Array.from(this.stakings.values()).filter(
      (staking) => staking.userId === userId
    );
  }

  async createStaking(insertStaking: InsertStaking): Promise<Staking> {
    const id = this.currentId.stakings++;
    const staking: Staking = { ...insertStaking, id };
    this.stakings.set(id, staking);
    return staking;
  }

  async updateStaking(id: number, isActive: boolean): Promise<Staking | undefined> {
    const staking = this.stakings.get(id);
    if (staking) {
      const updatedStaking = { ...staking, isActive };
      this.stakings.set(id, updatedStaking);
      return updatedStaking;
    }
    return undefined;
  }

  async getTotalStaked(): Promise<number> {
    return Array.from(this.stakings.values())
      .filter(staking => staking.isActive)
      .reduce((total, staking) => total + Number(staking.amount), 0);
  }

  // Transaction methods
  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.userId === userId
    );
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentId.transactions++;
    const transaction: Transaction = { 
      ...insertTransaction, 
      id,
      date: new Date()
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  // Referral methods
  async getReferral(id: number): Promise<Referral | undefined> {
    return this.referrals.get(id);
  }

  async createReferral(insertReferral: InsertReferral): Promise<Referral> {
    const id = this.currentId.referrals++;
    const referral: Referral = { 
      ...insertReferral, 
      id,
      date: new Date()
    };
    this.referrals.set(id, referral);
    return referral;
  }

  // Leaderboard methods
  async getLeaderboard(type: string, period: string): Promise<Leaderboard | undefined> {
    const key = `${type}-${period}`;
    return this.leaderboards.get(key);
  }

  async createLeaderboard(insertLeaderboard: InsertLeaderboard): Promise<Leaderboard> {
    const id = this.currentId.leaderboards++;
    const leaderboard: Leaderboard = { ...insertLeaderboard, id };
    const key = `${leaderboard.type}-${leaderboard.period}`;
    this.leaderboards.set(key, leaderboard);
    return leaderboard;
  }

  async getAllLeaderboards(): Promise<LeaderboardData> {
    // Initialize empty leaderboard data
    const leaderboardData: LeaderboardData = {
      weekly: {
        referrers: [],
        stakers: []
      },
      monthly: {
        referrers: [],
        stakers: []
      }
    };

    // Get weekly referrers
    const weeklyReferrers = this.leaderboards.get('referral-weekly');
    if (weeklyReferrers && weeklyReferrers.data) {
      leaderboardData.weekly.referrers = weeklyReferrers.data as LeaderboardUser[];
    }

    // Get weekly stakers
    const weeklyStakers = this.leaderboards.get('staking-weekly');
    if (weeklyStakers && weeklyStakers.data) {
      leaderboardData.weekly.stakers = weeklyStakers.data as LeaderboardUser[];
    }

    // Get monthly referrers
    const monthlyReferrers = this.leaderboards.get('referral-monthly');
    if (monthlyReferrers && monthlyReferrers.data) {
      leaderboardData.monthly.referrers = monthlyReferrers.data as LeaderboardUser[];
    }

    // Get monthly stakers
    const monthlyStakers = this.leaderboards.get('staking-monthly');
    if (monthlyStakers && monthlyStakers.data) {
      leaderboardData.monthly.stakers = monthlyStakers.data as LeaderboardUser[];
    }

    return leaderboardData;
  }

  private initializeMockData() {
    // Create some users with wallet addresses
    const user1 = this.createUser({
      username: 'user1',
      password: 'password123',
      walletAddress: '0xab...cd12',
      referralCode: 'REF001',
      referredBy: null
    });

    const user2 = this.createUser({
      username: 'user2',
      password: 'password123',
      walletAddress: '0x12...34ef',
      referralCode: 'REF002',
      referredBy: 'REF001'
    });

    const user3 = this.createUser({
      username: 'user3',
      password: 'password123',
      walletAddress: '0x56...78gh',
      referralCode: 'REF003',
      referredBy: 'REF001'
    });

    const user4 = this.createUser({
      username: 'user4',
      password: 'password123',
      walletAddress: '0x45...67ab',
      referralCode: 'REF004',
      referredBy: 'REF002'
    });

    const user5 = this.createUser({
      username: 'user5',
      password: 'password123',
      walletAddress: '0xcd...ef89',
      referralCode: 'REF005',
      referredBy: 'REF003'
    });

    const user6 = this.createUser({
      username: 'user6',
      password: 'password123',
      walletAddress: '0x01...23gh',
      referralCode: 'REF006',
      referredBy: 'REF001'
    });

    // Create staking records
    const now = new Date();
    
    this.createStaking({
      userId: 4,
      amount: '1250000',
      startDate: now,
      unlockDate: addDays(now, 7),
      isActive: true
    });

    this.createStaking({
      userId: 5,
      amount: '980000',
      startDate: now,
      unlockDate: addDays(now, 7),
      isActive: true
    });

    this.createStaking({
      userId: 6,
      amount: '750000',
      startDate: now,
      unlockDate: addDays(now, 7),
      isActive: true
    });

    // Create referrals
    this.createReferral({
      referrerId: 1,
      referredId: 2,
      rewardAmount: '150'
    });

    this.createReferral({
      referrerId: 1,
      referredId: 3,
      rewardAmount: '200'
    });

    this.createReferral({
      referrerId: 2,
      referredId: 4,
      rewardAmount: '175'
    });

    // Create leaderboards
    const weeklyStartDate = new Date();
    weeklyStartDate.setDate(weeklyStartDate.getDate() - 7);
    
    const monthlyStartDate = new Date();
    monthlyStartDate.setMonth(monthlyStartDate.getMonth() - 1);

    const endDate = new Date();

    // Weekly referrers leaderboard
    this.createLeaderboard({
      type: 'referral',
      period: 'weekly',
      startDate: weeklyStartDate,
      endDate: endDate,
      data: [
        {
          id: 1,
          walletAddress: '0xab...cd12',
          displayAddress: '0xab...cd12',
          value: 5420,
          bonus: '24 referrals',
          percentage: 100
        },
        {
          id: 2,
          walletAddress: '0x12...34ef',
          displayAddress: '0x12...34ef',
          value: 3860,
          bonus: '18 referrals',
          percentage: 75
        },
        {
          id: 3,
          walletAddress: '0x56...78gh',
          displayAddress: '0x56...78gh',
          value: 2140,
          bonus: '12 referrals',
          percentage: 50
        }
      ]
    });

    // Weekly stakers leaderboard
    this.createLeaderboard({
      type: 'staking',
      period: 'weekly',
      startDate: weeklyStartDate,
      endDate: endDate,
      data: [
        {
          id: 4,
          walletAddress: '0x45...67ab',
          displayAddress: '0x45...67ab',
          value: 1250000,
          bonus: '+1% APY',
          percentage: 100
        },
        {
          id: 5,
          walletAddress: '0xcd...ef89',
          displayAddress: '0xcd...ef89',
          value: 980000,
          bonus: '+0.5% APY',
          percentage: 82
        },
        {
          id: 6,
          walletAddress: '0x01...23gh',
          displayAddress: '0x01...23gh',
          value: 750000,
          bonus: '+0.25% APY',
          percentage: 65
        }
      ]
    });

    // Monthly referrers leaderboard (similar structure to weekly)
    this.createLeaderboard({
      type: 'referral',
      period: 'monthly',
      startDate: monthlyStartDate,
      endDate: endDate,
      data: [
        {
          id: 1,
          walletAddress: '0xab...cd12',
          displayAddress: '0xab...cd12',
          value: 12540,
          bonus: '65 referrals',
          percentage: 100
        },
        {
          id: 3,
          walletAddress: '0x56...78gh',
          displayAddress: '0x56...78gh',
          value: 9820,
          bonus: '48 referrals',
          percentage: 80
        },
        {
          id: 2,
          walletAddress: '0x12...34ef',
          displayAddress: '0x12...34ef',
          value: 7230,
          bonus: '32 referrals',
          percentage: 60
        }
      ]
    });

    // Monthly stakers leaderboard (similar structure to weekly)
    this.createLeaderboard({
      type: 'staking',
      period: 'monthly',
      startDate: monthlyStartDate,
      endDate: endDate,
      data: [
        {
          id: 4,
          walletAddress: '0x45...67ab',
          displayAddress: '0x45...67ab',
          value: 2100000,
          bonus: '+1.5% APY',
          percentage: 100
        },
        {
          id: 6,
          walletAddress: '0x01...23gh',
          displayAddress: '0x01...23gh',
          value: 1725000,
          bonus: '+0.75% APY',
          percentage: 85
        },
        {
          id: 5,
          walletAddress: '0xcd...ef89',
          displayAddress: '0xcd...ef89',
          value: 1400000,
          bonus: '+0.5% APY',
          percentage: 70
        }
      ]
    });
  }
}

export const storage = new MemStorage();
