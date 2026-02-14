// src/server/repositories/user-repository.ts
import { db } from '../firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore';

export const QuestRepository = {
  async FindQuestByDate(
    userId: string,
    date: string
  ): Promise<{
    id: string;
    userId: string;
    date: string;
    title: string;
    prompt: string;
    wordCountMin: number;
    wordCountMax: number;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
  } | null> {
    const queestsRef = collection(db, 'queests');
    const q = query(queestsRef, where('userId', '==', userId), where('date', '==', date));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as {
      id: string;
      userId: string;
      date: string;
      title: string;
      prompt: string;
      wordCountMin: number;
      wordCountMax: number;
      difficulty: 'easy' | 'medium' | 'hard';
      category: string;
    };
  },

  async FindQuestByQuestId(questId: string): Promise<{
    id: string;
    userId: string;
    date: string;
    title: string;
    prompt: string;
    wordCountMin: number;
    wordCountMax: number;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
  } | null> {
    const questRef = doc(db, 'queests', questId);
    const docSnap = await getDoc(questRef);

    if (!docSnap.exists()) return null;

    return { id: docSnap.id, ...docSnap.data() } as {
      id: string;
      userId: string;
      date: string;
      title: string;
      prompt: string;
      wordCountMin: number;
      wordCountMax: number;
      difficulty: 'easy' | 'medium' | 'hard';
      category: string;
    };
  },

  async CreateQuest(
    userId: string,
    date: string,
    title: string,
    prompt: string,
    wordCountMin: number,
    wordCountMax: number,
    difficulty: 'easy' | 'medium' | 'hard',
    category: string
  ): Promise<void> {
    const questRef = doc(collection(db, 'queests'));
    await setDoc(questRef, {
      userId,
      date,
      title,
      prompt,
      wordCountMin,
      wordCountMax,
      difficulty,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },
};
