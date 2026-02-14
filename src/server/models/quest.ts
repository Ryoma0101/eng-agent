export type quest = {
  date: Date;
  title: string;
  prompt: string;
  wordCountMin: number;
  wordCountMax: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  createdAt: Date;
  updatedAt: Date;
};
