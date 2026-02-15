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
}
`.trim(); // プロンプトの最後に閉じカッコを追加してJSON形式であることを強調
}

// DeepSeek (OpenAI互換) のレスポンス型定義
interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
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
    questId: string;
    userId: string;
    answer: string;
    wordCount: number;
    score: {
      grammar: number;
      logic: number;
      context: number;
      fluency: number;
      total: number;
    };
    feedback: string;
    createdAt: Date;
    updatedAt: Date;
  } | null> {
    const apiKey = process.env.DEEPSEEK_API_KEY; // 名前を修正
    const controller = new AbortController();

    const fullPrompt = buildPrompt(
      todayQuest.prompt,
      answer,
      todayQuest.wordCountMin,
      todayQuest.wordCountMax
    );

    const url = `https://api.deepseek.com/chat/completions`; // タイポ修正

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: fullPrompt,
            },
          ],
          response_format: {
            type: 'json_object',
          },
          temperature: 0.3,
          max_tokens: 2000,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DeepSeek API Error: ${response.status} - ${errorText}`);
      }

      const data = (await response.json()) as DeepSeekResponse;
      const content = data.choices?.[0]?.message?.content ?? '';

      // JSON文字列をパース（念のため正規表現で抽出）
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Failed to parse JSON from model response');

      const parsed = JSON.parse(jsonMatch[0]) as RawLlmScores;

      const newSubmission = {
        questId,
        userId,
        answer,
        // 単語数カウントを改善（空白文字で分割）
        wordCount: answer.trim() === '' ? 0 : answer.trim().split(/\s+/).length,
        score: {
          grammar: parsed.grammar,
          logic: parsed.logic,
          context: parsed.context,
          fluency: parsed.fluency,
          total: parsed.grammar + parsed.logic + parsed.context + parsed.fluency,
        },
        feedback: parsed.feedback,
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
        submissionId: submissionId.submissionId,
        questId: submissionId.questId,
        userId: submissionId.userId,
        answer: submissionId.answer,
        wordCount: newSubmission.wordCount,
        score: newSubmission.score,
        feedback: newSubmission.feedback,
        createdAt: submissionId.createdAt,
        updatedAt: submissionId.updatedAt,
      };
    } catch (error) {
      console.error('Submission creation failed:', error);
      throw error;
    }
  },

  async GetSubmissionByUserIdAndQuestId(userId: string, questId: string) {
    return await SubmissionRepository.GetSubmissionByUserIdAndQuestId(userId, questId);
  },

  async GetSubmissionsByUserId(userId: string) {
    return await SubmissionRepository.GetSubmissionsByUserId(userId);
  },
};
