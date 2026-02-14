// src/server/repositories/user-repository.ts
import { db } from '../firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore';

export const UserRepository = {
  async createUser(userId: string, displayName: string, email: string) {
    // collection(db, "path") ではなく doc(db, "path", id)
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      displayName,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },

  async FindByEmail(email: string) {
    const usersRef = collection(db, 'users');
    // query関数にdbインスタンスと条件を渡す
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  },
};
