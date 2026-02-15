import { SubmissionRepository } from '../repositories/submission';
import { Quest } from '@/types';

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

function buildPrompt(prompt: string, answer: string, wordCountMin: number, wordCountMax: number) {
  return `${SYSTEM_PROMPT}

  ---
QUESTION: ${prompt ?? '(No explicit question provided.)'}
WORD COUNT REQUIREMENT: ${wordCountMin}-${wordCountMax}
---
ESSAY: ${answer}
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

interface GeminiResponse {
  text?: string;
  candidates?: { output: string }[];
}

interface RawLlmScores {
  grammar: number;
  logic: number;
  context: number;
  fluency: number;
  feedback: string;
}

export const SubmissionService = {
  async GetSubmissionListByQuest(questId: string) {
    return await SubmissionRepository.GetSubmissionListByQuest(questId);
  },

  async GetSubmissionListByUser(userId: string) {
    return await SubmissionRepository.GetSubmissionListByUser(userId);
  },

  // デバッグ用の関数。実際の実装では、スコアリングやフィードバックの生成も行うべき。
  async createSubmission(userId: string, questId: string, answer: string): Promise<void> {
    return await SubmissionRepository.createSubmission(userId, questId, answer);
  },

  async createNewSubmission(
    userId: string,
    questId: string,
    answer: string,
    todayQuest: Quest
  ): Promise<{
    submissionId: string;
    score: { grammar: number; logic: number; context: number; fluency: number; total: number };
    feedback: string;
  } | null> {
    const apiKey = process.env.GEMINI_API_KEY;
    const controller = new AbortController();
    const input = {
      pronpt: todayQuest.prompt,
      answer: answer,
      wordCountMin: todayQuest.wordCountMin,
      wordCountMax: todayQuest.wordCountMax,
      signal: controller.signal,
    };

    const fullPrompt = buildPrompt(
      input.pronpt,
      input.answer,
      input.wordCountMin,
      input.wordCountMax
    );
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization' ヘッダーは削除してください
      },
      body: JSON.stringify({
        // 2. bodyの内容をクイックスタートと同じ構造に修正
        contents: [
          {
            parts: [{ text: fullPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json', // JSONで返却させる設定
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = (await response.json()) as GeminiResponse;
    const content = data.candidates?.[0]?.output ?? data.text ?? '';
    const jsonMatch = String(content).match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content) as RawLlmScores;
    const newSubmission = {
      questId,
      userId,
      answer,
      wordCount: answer.split(' ').length,
      score: {
        grammar: parsed.grammar,
        logic: parsed.logic,
        context: parsed.context,
        fluency: parsed.fluency,
        total: parsed.grammar + parsed.logic + parsed.context + parsed.fluency,
      },
      feedback: parsed.feedback,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const submissionId = await SubmissionRepository.createNewSubmission(
      questId,
      userId,
      answer,
      newSubmission.wordCount,
      newSubmission.score,
      newSubmission.feedback
    );
    return {
      submissionId,
      score: newSubmission.score,
      feedback: newSubmission.feedback,
    };
  },

  async GetSubmissionByUserIdAndQuestId(userId: string, questId: string) {
    return await SubmissionRepository.GetSubmissionByUserIdAndQuestId(userId, questId);
  },

  async GetSubmissionsByUserId(userId: string) {
    return await SubmissionRepository.GetSubmissionsByUserId(userId);
  },
};
