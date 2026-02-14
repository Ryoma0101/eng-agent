export type Submission = {
  questId: string;
  date: Date;
  title: string;
  prompt: string;
  wordCountMin: number;
  wordCountMax: number;
  score: {
    grammar: number;
    logic: number;
    context: number;
    fluency: number;
    total: number;
  };
  feedback: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  updatedAt: Date;
  processingTime: number;
};
