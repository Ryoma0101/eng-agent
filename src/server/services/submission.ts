import { SubmissionRepository } from '../repositories/submission';

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
};
