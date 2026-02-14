// src/server/repositories/user-repository.ts
import { Quest } from '@/types';
import { db } from '../firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { Submission } from '../models/submission';

export const SubmissionRepository = {
  async GetSubmissionListByQuest(questId: string): Promise<Submission[]> {
    const submissionsRef = collection(db, 'submissions');
    const q = query(submissionsRef, where('questId', '==', questId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return [];

    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as unknown as Submission[];
  },

  async GetSubmissionListByUser(userId: string): Promise<Submission[]> {
    const submissionsRef = collection(db, 'submissions');
    const q = query(submissionsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return [];

    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as unknown as Submission[];
  },

  // デバッグ用の提出作成関数。実際の提出作成はSubmissionService.createNewSubmissionで行う。
  async createSubmission(userId: string, questId: string, answer: string): Promise<void> {
    const submissionsRef = collection(db, 'submissions');
    const newSubmission = {
      questId: questId,
      userId: userId,
      answer: answer,
      wordCount: answer.split(' ').length,
      score: {
        grammar: 0,
        logic: 0,
        context: 0,
        fluency: 0,
        total: 0,
      },
      feedback: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const submissionDocRef = doc(submissionsRef);
    await setDoc(submissionDocRef, newSubmission);
  },

  async createNewSubmission(
    questId: string,
    userId: string,
    answer: string,
    wordCount: number,
    score: { grammar: number; logic: number; context: number; fluency: number; total: number },
    feedback: string
  ): Promise<void> {
    const submissionsRef = collection(db, 'submissions');
    const submissionDocRef = doc(submissionsRef);
    const newSubmission = {
      questId,
      userId,
      answer,
      wordCount,
      score,
      feedback,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await setDoc(submissionDocRef, newSubmission);
  },
};
