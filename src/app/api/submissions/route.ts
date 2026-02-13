import { NextResponse } from 'next/server';
import { Timestamp } from 'firebase/firestore';
import {
  createSubmission,
  getSubmission,
  updateSubmission,
  updateUserStats,
} from '@/services/firestore';

export const runtime = 'nodejs';

// ===== 1. 型定義 =====
type SubmissionStatus = 'pending' | 'completed' | 'error';

type RawLlmScores = {
  grammar: number;
  logic: number;
  context: number;
  fluency: number;
  feedback: string;
};

type Scores = {
  grammar: number;
  logic: number;
  context: number;
  fluency: number;
  total: number;
  isCorrect: boolean;
};

type SubmissionRequestBody = {
  questId: string;
  answer: string;
  name: string;
  prompt?: string;
  wordCountMin?: number;
  wordCountMax?: number;
};

// "declared but never used" を防ぐために export して利用可能にする
export type SubmissionResponseBody = {
  submissionId: string;
  questId: string;
  userId: string;
  userName: string;
  answer: string;
  wordCount: number;
  scores: Scores | null;
  feedback: string | null;
  status: SubmissionStatus;
  submittedAt: string; // ISO string
  scoredAt: string | null; // ISO string
  processingTime: number | null;
};

interface GeminiResponse {
  candidates?: Array<{
    output?: string;
  }>;
  text?: string;
}

// ===== 2. 設定値 & ユーティリティ =====

const DEFAULT_MIN_WORDS = 120;
const DEFAULT_MAX_WORDS = 250;

function countWords(answer: string): number {
  return answer.trim().length === 0 ? 0 : answer.trim().split(/\s+/).length;
}

function applyRuleCorrection(
  scores: Scores,
  answer: string,
  wordCountMin: number,
  wordCountMax: number
): Scores {
  const wordCount = countWords(answer);
  if (wordCount < wordCountMin) scores.total = Math.max(0, scores.total - 5);
  if (wordCount > wordCountMax) scores.total = Math.max(0, scores.total - 3);
  if (wordCount < 50) return { ...scores, total: -1, isCorrect: false };
  return scores;
}

function normalizeTotalScore(raw: RawLlmScores): Scores {
  const total = Math.round(raw.grammar + raw.logic + raw.context + raw.fluency);
  return {
    grammar: raw.grammar,
    logic: raw.logic,
    context: raw.context,
    fluency: raw.fluency,
    total: Math.min(100, Math.max(0, total)),
    isCorrect: true,
  };
}

const SYSTEM_PROMPT = `
You are a versatile, intelligent, and neutral AI assistant designed for a general audience. Your primary goal is to provide clear, logical, and helpful responses that are accessible to anyone, regardless of their professional or academic background.

# Core Instructions

1. Grammar (0-25 points)
   - Evaluate syntax, spelling, punctuation, and vocabulary precision.
   - Is the language professional, accurate, and free of errors?
   - Focus on correct usage rather than overly complex words.

2. Logic (0-25 points)
   - Evaluate the structure, clarity, and coherence of the argument.
   - Is the message unambiguous and easy to understand for a global audience or an AI agent?
   - Deduct points for logical fallacies or confusing narrative flow.

3. Context (0-25 points)
   - Evaluate relevance to the provided News Topic.
   - Does the submission directly address the prompt?
   - Does the content align with the subject matter and intent of the news?

4. Fluency (0-25 points)
   - Evaluate the natural flow, tone, and overall effectiveness of the communication.
   - Does the writing sound natural (like a skilled professional) rather than robotic or translated?
   - Does it effectively achieve a communicative goal (persuading, informing, etc.)?`.trim();

function buildPrompt(input: {
  prompt?: string;
  answer: string;
  wordCountMin: number;
  wordCountMax: number;
}): string {
  return `
${SYSTEM_PROMPT}
---
QUESTION: ${input.prompt ?? '(No explicit question provided.)'}
WORD COUNT REQUIREMENT: ${input.wordCountMin}-${input.wordCountMax}
---
ESSAY: ${input.answer}
---
Return a JSON object with this exact format (use these exact key names):
{
  "grammar": <0-25>,
  "logic": <0-25>,
  "context": <0-25>,
  "fluency": <0-25>,
  "feedback": "<Provide 2-3 sentences and up to 150~300 words of constructive feedback explaining the score and how to improve for practical usage in Japanese.>"
`.trim();
}

// ===== 3. Gemini API 呼び出し =====

async function callGeminiForScoresOnce(input: {
  prompt?: string;
  answer: string;
  wordCountMin: number;
  wordCountMax: number;
  signal: AbortSignal;
}): Promise<RawLlmScores> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

  const fullPrompt = buildPrompt(input);
  const url = `https://generativelanguage.googleapis.com/v1/models/text-bison-001:generateText?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: { text: fullPrompt }, temperature: 0.3 }),
    signal: input.signal,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${text}`);
  }

  const data = (await response.json()) as GeminiResponse;
  const content = data.candidates?.[0]?.output ?? data.text ?? '';
  const jsonMatch = String(content).match(/\{[\s\S]*\}/);
  const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content) as RawLlmScores;

  return {
    grammar: Number(parsed.grammar) || 0,
    logic: Number(parsed.logic) || 0,
    context: Number(parsed.context) || 0,
    fluency: Number(parsed.fluency) || 0,
    feedback: parsed.feedback ?? '',
  };
}

async function callGeminiWithRetry(
  input: Parameters<typeof callGeminiForScoresOnce>[0],
  maxRetries = 3
): Promise<RawLlmScores> {
  // ★修正1: any を unknown に変更
  let lastError: unknown;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await callGeminiForScoresOnce(input);
    } catch (error) {
      console.warn(`Gemini attempt ${i + 1} failed.`, error);
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1500 * (i + 1)));
      }
    }
  }
  throw lastError;
}

// ===== 4. Route Handlers (POST & GET) =====

export async function POST(request: Request) {
  const startedAt = Date.now();

  try {
    const body = (await request.json()) as SubmissionRequestBody;
    const { name, questId, answer, prompt, wordCountMin, wordCountMax } = body;
    // ---------------------------------------------------------
    // 1. リクエストバリデーション
    // ---------------------------------------------------------
    if (!questId || !answer || !name) {
      return NextResponse.json(
        { error: 'name, questId, and answer are required' },
        { status: 400 }
      );
    }

    // 単語数チェック
    const minWords = wordCountMin ?? DEFAULT_MIN_WORDS;
    const maxWords = wordCountMax ?? DEFAULT_MAX_WORDS;
    const currentWordCount = countWords(answer);
    const nowTimestamp = Timestamp.now();

    // ---------------------------------------------------------
    // 2. Firestore に submission ドキュメントを作成 (pending)
    // ---------------------------------------------------------
    const initialSubmissionData = {
      questId,
      userId: 'guest', // ※認証実装後は実際のUIDを入れる
      userName: name,
      answer,
      wordCount: currentWordCount,
      // スコアはまだ空、ステータスは pending
      scores: null,
      feedback: null,
      status: 'pending' as SubmissionStatus,
      submittedAt: nowTimestamp,
      scoredAt: null,
      processingTime: null,
    };

    // 先にDBへ保存し、IDを確保する
    const { id: submissionId } = await createSubmission(initialSubmissionData);

    // ---------------------------------------------------------
    // 3. AI API で採点実行 (リトライ最大3回)
    // ---------------------------------------------------------
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60_000); // 採点待ち時間を考慮して長めに

    let rawScores: RawLlmScores;
    try {
      rawScores = await callGeminiWithRetry(
        {
          prompt,
          answer,
          wordCountMin: minWords,
          wordCountMax: maxWords,
          signal: controller.signal,
        },
        3
      ); // 3回リトライ
    } catch (aiError) {
      // AIエラー時はステータスをerrorにして終了
      await updateSubmission(submissionId, { status: 'error' });
      throw aiError;
    } finally {
      clearTimeout(timeoutId);
    }

    // ---------------------------------------------------------
    // 4. スコア計算: total = grammar + logic + context + fluency
    // ---------------------------------------------------------
    let calculatedScores = normalizeTotalScore(rawScores);
    // ルール補正 (字数制限など)
    calculatedScores = applyRuleCorrection(calculatedScores, answer, minWords, maxWords);

    const scoredAtTimestamp = Timestamp.now();
    const processingTime = Date.now() - startedAt;

    // ---------------------------------------------------------
    // 5. Firestore の submission ドキュメントを更新
    // ---------------------------------------------------------
    const updateData = {
      scores: {
        grammar: calculatedScores.grammar,
        logic: calculatedScores.logic,
        context: calculatedScores.context,
        fluency: calculatedScores.fluency,
        total: calculatedScores.total,
        isCorrect: calculatedScores.isCorrect,
      },
      feedback: rawScores.feedback,
      status: 'completed' as SubmissionStatus,
      scoredAt: scoredAtTimestamp,
      processingTime: processingTime,
    };

    await updateSubmission(submissionId, updateData);

    // ---------------------------------------------------------
    // 6. Firestore の users ドキュメントを更新 (Stats加算)
    // ---------------------------------------------------------
    // guest以外の場合のみ実行
    if (initialSubmissionData.userId !== 'guest') {
      await updateUserStats(initialSubmissionData.userId, calculatedScores.total);
    }

    // ---------------------------------------------------------
    // 7. レスポンス返却
    // ---------------------------------------------------------

    // DB保存後の完全なデータを返す
    const responseBody: SubmissionResponseBody = {
      submissionId,
      questId: initialSubmissionData.questId,
      userId: initialSubmissionData.userId,
      userName: initialSubmissionData.userName,
      answer: initialSubmissionData.answer,
      wordCount: initialSubmissionData.wordCount,
      scores: updateData.scores,
      feedback: updateData.feedback,
      status: updateData.status,
      submittedAt: initialSubmissionData.submittedAt.toDate().toISOString(),
      scoredAt: scoredAtTimestamp.toDate().toISOString(),
      processingTime: updateData.processingTime,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error: unknown) {
    console.error('Submission processing error:', error);
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Scoring timeout' }, { status: 504 });
    }
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  try {
    const submission = (await getSubmission(id)) as Record<string, unknown> | null;
    if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // submittedAt と scoredAt を安全に処理
    const formatDate = (val: unknown): string | null => {
      if (val instanceof Timestamp) return val.toDate().toISOString();
      if (typeof val === 'string') return val;
      return null;
    };

    const responseData = {
      ...submission,
      submittedAt: formatDate(submission.submittedAt),
      scoredAt: formatDate(submission.scoredAt),
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    // ★修正2: 定義した error 変数をログ出力に使用 (unused-vars 解消)
    console.error('GET submission error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
