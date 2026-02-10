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

const WEIGHTS = {
  grammar: 0.25,
  logic: 0.3,
  context: 0.25,
  fluency: 0.2,
} as const;

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
  const weightedTotal = Math.round(
    raw.grammar * WEIGHTS.grammar +
      raw.logic * WEIGHTS.logic +
      raw.context * WEIGHTS.context +
      raw.fluency * WEIGHTS.fluency
  );

  return {
    grammar: raw.grammar,
    logic: raw.logic,
    context: raw.context,
    fluency: raw.fluency,
    total: weightedTotal,
    isCorrect: true,
  };
}

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
You are an expert English business writing evaluator.
Your task is to score the user's essay based on the provided "Question" and "Essay".
Score the essay on the following 4 dimensions (0-25 points each).

---
### SCORING CRITERIA

1. Grammar & Accuracy (0-25)
   - Focus: Grammatical correctness, spelling, punctuation, and sentence structure.
   - Penalty: Deduct points for basic errors (subject-verb agreement, tense) that impede understanding. Minor slips are acceptable if they don't confuse the reader.

2. Content & Logic (0-25) [CRITICAL]
   - Focus: Task Achievement & Logical Structure.
   - Task Achievement: Does the essay DIRECTLY answer the prompt? (If off-topic, score must be low).
   - Logic: Is the argument persuasive? Is there a clear structure (Introduction -> Body -> Conclusion)?
   - Coherence: Are the ideas logically connected (e.g., using the PREP method)?

3. Vocabulary (0-25)
   - Focus: Lexical Resource & Register.
   - Register: Is the tone appropriate for a business context? (Formal/Semi-formal).
   - Variety: Does the user use precise business terminology instead of generic words (e.g., "profitable" instead of "good money")?

4. Fluency & Flow (0-25)
   - Focus: Naturalness & Cohesion.
   - Flow: Is the text easy to read smoothly? Does it sound natural/native-like or robotic/translated?
   - Cohesion: Are transition words (However, Therefore, In addition) used effectively to connect sentences?
   - Variety: Is there a mix of simple and complex sentence structures?

}

---
QUESTION:
${prompt ?? '(No explicit question provided. Evaluate the essay as a business English response.)'}

WORD COUNT REQUIREMENT: ${wordCountMin}-${wordCountMax}

---
ESSAY:
${answer}

---
Return a JSON object with this exact format:
{
  "grammar": <0-25>,
  "logic": <0-25>,
  "context": <0-25>,
  "fluency": <0-25>,
  "feedback": "<short feedback in English>"
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
