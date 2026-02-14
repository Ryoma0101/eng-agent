export type Submission = {
  userId: string;
  queestId: string;
  answer: string;
  wordCount: number;
  feedback: string;
  submittedAt: Date;
  processedAt: Date;
};
