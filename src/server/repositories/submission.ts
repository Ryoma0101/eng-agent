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
};
