import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// ===== Types =====

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
  total: number; // 0-100, -1 の場合は「採点保留」
  isCorrect: boolean;
};

type SubmissionRequestBody = {
  questId: string;
  answer: string;
  prompt?: string;
  wordCountMin?: number;
  wordCountMax?: number;
};

type SubmissionResponseBody = {
  submissionId: string;
  questId: string;
  userId: string | null;
  answer: string;
  wordCount: number;
  scores: Scores;
  feedback: string;
  submittedAt: string;
  scoredAt: string;
  processingTime: number;
};

// ===== 採点アルゴリズム設定 =====
// SYSTEM_PROMPT の配点: Accuracy 25 + Logic 30 + Content 20 + Impact 25 = 100

const DEFAULT_MIN_WORDS = 120;
const DEFAULT_MAX_WORDS = 250;

// ===== ユーティリティ =====

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

  // 字数不足 → -5点
  if (wordCount < wordCountMin) {
    scores.total = Math.max(0, scores.total - 5);
  }

  // 字数超過 → -3点
  if (wordCount > wordCountMax) {
    scores.total = Math.max(0, scores.total - 3);
  }

  // 極端に短い（50語未満）→ 採点保留
  if (wordCount < 50) {
    return { ...scores, total: -1, isCorrect: false };
  }

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
   - Does it effectively achieve a communicative goal (persuading, informing, etc.)?
`.trim();

function buildPrompt({
  prompt,
  answer,
  wordCountMin,
  wordCountMax,
}: {
  prompt?: string;
  answer: string;
  wordCountMin: number;
  wordCountMax: number;
}): string {
  return `
${SYSTEM_PROMPT}

---
QUESTION:
${prompt ?? '(No explicit question provided. Evaluate the essay as a business English response.)'}

WORD COUNT REQUIREMENT: ${wordCountMin}-${wordCountMax}

---
ESSAY:
${answer}

---
Return a JSON object with this exact format (use these exact key names):
{
  "grammer": <0-25>,
  "logic": <0-25>,
  "context": <0-25>,
  "fluency": <0-25>,
  "feedback": "<Provide 2-3 sentences and up to 50 words of constructive feedback explaining the score and how to improve for practical usage.>"
}
`.trim();
}

async function callOpenAiForScores(input: {
  prompt?: string;
  answer: string;
  wordCountMin: number;
  wordCountMax: number;
  signal: AbortSignal;
}): Promise<RawLlmScores> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  const fullPrompt = buildPrompt(input);
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo',
      temperature: 0.3,
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: fullPrompt,
        },
      ],
    }),
    signal: input.signal,
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('OpenAI API error', response.status, text);
    throw new Error('OpenAI API request failed');
  }

  const data = (await response.json()) as {
    choices: { message?: { content?: string | null } }[];
  };

  const content = data.choices[0]?.message?.content ?? '';

  try {
    // LLM からのレスポンスがテキスト中に JSON を含むケースを考慮
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : content;
    const parsed = JSON.parse(jsonText) as RawLlmScores;

    return {
      grammar: Number(parsed.grammar) || 0,
      logic: Number(parsed.logic) || 0,
      context: Number(parsed.context) || 0,
      fluency: Number(parsed.fluency) || 0,
      feedback: parsed.feedback ?? '',
    };
  } catch (error) {
    console.error('Failed to parse LLM response as JSON', { content, error });
    throw new Error('Failed to parse scoring result from LLM');
  }
}

// ===== Route Handler =====

export async function POST(request: Request) {
  const startedAt = Date.now();

  try {
    const body = (await request.json()) as SubmissionRequestBody;
    const { questId, answer, prompt, wordCountMin, wordCountMax } = body;

    if (!questId || !answer) {
      return NextResponse.json({ error: 'questId and answer are required' }, { status: 400 });
    }

    const minWords = wordCountMin ?? DEFAULT_MIN_WORDS;
    const maxWords = wordCountMax ?? DEFAULT_MAX_WORDS;
    const wordCount = countWords(answer);

    // Timeout 30秒
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    let rawScores: RawLlmScores;
    try {
      rawScores = await callOpenAiForScores({
        prompt,
        answer,
        wordCountMin: minWords,
        wordCountMax: maxWords,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    let scores = normalizeTotalScore(rawScores);
    scores = applyRuleCorrection(scores, answer, minWords, maxWords);

    const nowIso = new Date().toISOString();
    const responseBody: SubmissionResponseBody = {
      submissionId: `sub_${Math.random().toString(36).slice(2, 10)}`,
      questId,
      userId: null, // TODO: Firebase Auth と連携して userId を付与
      answer,
      wordCount,
      scores,
      feedback: rawScores.feedback,
      submittedAt: nowIso,
      scoredAt: nowIso,
      processingTime: Date.now() - startedAt,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error: unknown) {
    console.error('/api/submissions error', error);

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'LLM scoring timeout' }, { status: 504 });
    }

    return NextResponse.json({ error: 'Failed to score submission' }, { status: 500 });
  }
}
