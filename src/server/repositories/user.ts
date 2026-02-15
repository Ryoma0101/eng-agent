// src/server/repositories/user-repository.ts
import { db } from '../firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore';

export const UserRepository = {
  async createUser(
    userId: string,
    displayName: string,
    email: string,
    photoURL: string | null = null
  ): Promise<void> {
    // collection(db, "path") ではなく doc(db, "path", id)
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      displayName,
      email,
      photoURL,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },

  async FindByEmail(
    email: string
  ): Promise<{ id: string; displayName: string; email: string; photoURL: string | null } | null> {
    const usersRef = collection(db, 'users');
    // query関数にdbインスタンスと条件を渡す
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as {
      id: string;
      displayName: string;
      email: string;
      photoURL: string | null;
    };
  },

  async FindUserById(
    uid: string
  ): Promise<{ id: string; displayName: string; email: string; photoURL: string | null } | null> {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) return null;

    return { id: docSnap.id, ...docSnap.data() } as {
      id: string;
      displayName: string;
      email: string;
      photoURL: string | null;
    };
  },

  async updateUserProfile(
    uid: string,
    payload: { displayName?: string; email?: string; photoURL?: string | null }
  ): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await setDoc(
      userRef,
      {
        ...payload,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  },
};
