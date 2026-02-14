import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import app from './config';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/**
 * Google認証でサインイン
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: unknown) {
    // ユーザーがポップアップをキャンセルした場合
    if (error instanceof Error && 'code' in error && error.code === 'auth/popup-closed-by-user') {
      throw new Error('auth/popup-closed-by-user');
    }
    throw error;
  }
}

/**
 * 現在のユーザーを取得
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * サインアウト
 */
export async function signOut(): Promise<void> {
  return firebaseSignOut(auth);
}

/**
 * 認証状態の変化を監視
 */
export function onAuthStateChanged(callback: (user: User | null) => void) {
  return auth.onAuthStateChanged(callback);
}

export default auth;
