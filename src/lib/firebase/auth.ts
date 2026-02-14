import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User,
  type Auth,
} from 'firebase/auth';
import getFirebaseApp from './config';

// Auth を遅延初期化（ビルド時のプリレンダリングでの実行を防ぐ）
function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

const googleProvider = new GoogleAuthProvider();

/**
 * Google認証でサインイン
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(getFirebaseAuth(), googleProvider);
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
  return getFirebaseAuth().currentUser;
}

/**
 * サインアウト
 */
export async function signOut(): Promise<void> {
  return firebaseSignOut(getFirebaseAuth());
}

/**
 * 認証状態の変化を監視
 */
export function onAuthStateChanged(callback: (user: User | null) => void) {
  return getFirebaseAuth().onAuthStateChanged(callback);
}

export { getFirebaseAuth as auth };
