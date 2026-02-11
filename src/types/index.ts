// ============================================================
// 型定義 - Firestore スキーマに準拠（doc/SPEC.md）
// ============================================================

// --- Quest ---
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Quest {
  questId: string;
  date: string; // YYYY-MM-DD (JST)
  title: string;
  prompt: string;
  wordCountMin: number;
  wordCountMax: number;
  difficulty: Difficulty;
  category: string;
  isActive: boolean;
}

// --- Scores ---
export interface Scores {
  grammar: number; // 0-25
  logic: number; // 0-25
  context: number; // 0-25
  fluency: number; // 0-25
  total: number; // 0-100
}

// --- Submission ---
export interface Submission {
  submissionId: string;
  questId: string;
  userId: string;
  answer: string;
  wordCount: number;
  scores: Scores;
  feedback: string;
  submittedAt: string;
  scoredAt: string;
  processingTime: number;
}

// --- User ---
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  totalScore: number;
  submissionCount: number;
  badge: string | null;
}

// --- Leaderboard ---
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  score: number;
  submissionCount: number;
}

export interface DailyLeaderboard {
  date: string;
  rankings: LeaderboardEntry[];
  totalUsers: number;
}

// --- User Stats (Dashboard) ---
export interface UserStats {
  todayScore: number;
  rank: number;
  streak: number;
}

// --- User Profile ---
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  totalSubmissions: number;
  averageScore: number;
  streak: number;
  badges: { id: string; label: string; icon: string }[];
  createdAt: string;
  scoreBreakdown: {
    grammar: number; // 0-25 平均
    logic: number;
    context: number;
    fluency: number;
  };
}
