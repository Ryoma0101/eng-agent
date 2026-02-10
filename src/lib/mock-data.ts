// ============================================================
// モックデータ - API接続前の仮データ
// 将来的に API 呼び出しに差し替え
// ============================================================

import type {
    Quest,
    Submission,
    User,
    DailyLeaderboard,
    UserStats,
} from '@/types';

// --- 現在のユーザー ---
export const mockCurrentUser: User = {
    uid: 'user_current',
    email: 'demo@example.com',
    displayName: 'Demo User',
    photoURL: null,
    isAnonymous: false,
    totalScore: 342,
    submissionCount: 5,
    badge: null,
};

// --- 今日のクエスト ---
export const mockTodayQuest: Quest = {
    questId: '2026-02-10_quest001',
    date: '2026-02-10',
    title: '円安と輸出企業',
    prompt:
        'Discuss the impact of a weaker yen on Japanese export companies from three different perspectives: profitability, competitiveness in global markets, and supply chain management.',
    wordCountMin: 150,
    wordCountMax: 200,
    difficulty: 'medium',
    category: 'economics',
    isActive: true,
};

// --- ユーザー統計 ---
export const mockUserStats: UserStats = {
    todayScore: 87,
    rank: 4,
    streak: 3,
};

// --- 最近の提出 ---
export const mockRecentSubmissions: Submission[] = [
    {
        submissionId: 'sub_001',
        questId: '2026-02-10_quest001',
        userId: 'user_current',
        answer:
            'The depreciation of the Japanese yen has multifaceted implications for export companies...',
        wordCount: 175,
        scores: {
            grammar: 22,
            logic: 24,
            context: 20,
            fluency: 21,
            total: 87,
        },
        feedback:
            'Good logical structure with clear three-perspective approach. Consider using more specific business terminology in your analysis of supply chain impacts. The transition between your second and third points could be smoother.',
        submittedAt: '2026-02-10T09:30:00Z',
        scoredAt: '2026-02-10T09:30:45Z',
        processingTime: 2300,
    },
    {
        submissionId: 'sub_002',
        questId: '2026-02-09_quest001',
        userId: 'user_current',
        answer: 'Remote work has fundamentally changed how businesses operate...',
        wordCount: 160,
        scores: {
            grammar: 23,
            logic: 22,
            context: 21,
            fluency: 22,
            total: 88,
        },
        feedback:
            'Well-organized arguments with good use of business vocabulary. Try to incorporate more data-driven examples to strengthen your points.',
        submittedAt: '2026-02-09T10:15:00Z',
        scoredAt: '2026-02-09T10:15:38Z',
        processingTime: 1900,
    },
    {
        submissionId: 'sub_003',
        questId: '2026-02-08_quest001',
        userId: 'user_current',
        answer:
            'The integration of AI in customer service presents both opportunities and challenges...',
        wordCount: 185,
        scores: {
            grammar: 24,
            logic: 23,
            context: 22,
            fluency: 23,
            total: 92,
        },
        feedback:
            'Excellent grammar and natural flow. Your analysis of AI in customer service was comprehensive and well-supported.',
        submittedAt: '2026-02-08T14:20:00Z',
        scoredAt: '2026-02-08T14:20:52Z',
        processingTime: 2100,
    },
];

// --- ランキング ---
export const mockDailyLeaderboard: DailyLeaderboard = {
    date: '2026-02-10',
    rankings: [
        {
            rank: 1,
            userId: 'user_alice',
            displayName: 'Alice',
            score: 95,
            submissionCount: 2,
        },
        {
            rank: 2,
            userId: 'user_bob',
            displayName: 'Bob',
            score: 92,
            submissionCount: 1,
        },
        {
            rank: 3,
            userId: 'user_charlie',
            displayName: 'Charlie',
            score: 89,
            submissionCount: 1,
        },
        {
            rank: 4,
            userId: 'user_current',
            displayName: 'Demo User',
            score: 87,
            submissionCount: 1,
        },
        {
            rank: 5,
            userId: 'user_david',
            displayName: 'David',
            score: 85,
            submissionCount: 2,
        },
        {
            rank: 6,
            userId: 'user_emily',
            displayName: 'Emily',
            score: 83,
            submissionCount: 1,
        },
        {
            rank: 7,
            userId: 'user_frank',
            displayName: 'Frank',
            score: 81,
            submissionCount: 1,
        },
        {
            rank: 8,
            userId: 'user_grace',
            displayName: 'Grace',
            score: 79,
            submissionCount: 1,
        },
        {
            rank: 9,
            userId: 'user_henry',
            displayName: 'Henry',
            score: 76,
            submissionCount: 1,
        },
        {
            rank: 10,
            userId: 'user_ivy',
            displayName: 'Ivy',
            score: 74,
            submissionCount: 1,
        },
    ],
    totalUsers: 42,
};
