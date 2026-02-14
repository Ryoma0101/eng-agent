export type Submission = {
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
};
