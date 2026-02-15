import { QuestRepository } from '../repositories/quest';
import { Quest } from '@/types';

export const QuestService = {
  async FindQuestByDate(userId: string, date: string) {
    return await QuestRepository.FindQuestByDate(userId, date);
  },

  async FindQuestByQuestId(questId: string) {
    const quest = await QuestRepository.FindQuestByQuestId(questId);
    return quest;
  },

  async CreateQuest(
    userId: string,
    title: string,
    prompt: string,
    wordCountMin: number,
    wordCountMax: number,
    difficulty: 'easy' | 'medium' | 'hard',
    category: string
  ) {
    const nowJst = new Date().toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });
    const date = new Date(nowJst).toISOString().split('T')[0]; // YYYY-MM-DD形式の文字列を生成
    return await QuestRepository.CreateQuest(
      userId,
      date,
      title,
      prompt,
      wordCountMin,
      wordCountMax,
      difficulty,
      category
    );
  },

  async GetDailyQuest(today: Date) {
    const date = today.toISOString().split('T')[0]; // YYYY-MM-DD形式の文字列を生成
    const quest = await QuestRepository.GetQuestByDate(date);
    if (!quest) {
      throw new Error('No quest found for today');
    }
    return quest;
  },
};
