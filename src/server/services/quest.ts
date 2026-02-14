import { QuestRepository } from '../repositories/quest';

export const QuestService = {
  async FindQuestByDate(userId: string, date: string) {
    return await QuestRepository.FindQuestByDate(userId, date);
  },

  async FindQuestByQuestId(questId: string) {
    return await QuestRepository.FindQuestByQuestId(questId);
  },
};
