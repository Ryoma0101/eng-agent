import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  limit,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import app from '@/lib/firebase/config';
import type { Quest, Submission } from '@/types';

const db = getFirestore(app);

/**
 * 今日の日付を JST で YYYY-MM-DD 形式で返す
 */
export function getTodayJST(): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().slice(0, 10);
}

/**
 * questId でクエストを取得
 */
export async function getQuest(questId: string): Promise<Quest | null> {
  const q = query(collection(db, 'quests'), where('questId', '==', questId), limit(1));
  const snapshot = await getDocs(q);
  const docSnap = snapshot.docs[0];
  if (!docSnap) return null;
  return { questId, ...docSnap.data() } as Quest;
}

/**
 * 指定日にアクティブなクエストを取得
 */
export async function getActiveQuestByDate(date: string): Promise<Quest | null> {
  const q = query(
    collection(db, 'quests'),
    where('date', '==', date),
    where('isActive', '==', true),
    limit(1)
  );
  const snapshot = await getDocs(q);
  const docSnap = snapshot.docs[0];
  if (!docSnap) return null;
  return { questId: docSnap.data().questId, ...docSnap.data() } as Quest;
}

/**
 * submissionId で提出を取得（ドキュメントID または submissionId フィールドで検索）
 */
export async function getSubmission(submissionIdOrDocId: string): Promise<Submission | null> {
  // まずドキュメントIDとして直接取得を試行
  const directRef = doc(db, 'submissions', submissionIdOrDocId);
  const directSnap = await getDoc(directRef);
  if (directSnap.exists()) {
    const d = directSnap.data();
    return {
      submissionId: d?.submissionId ?? directSnap.id,
      questId: d?.questId ?? '',
      userId: d?.userId ?? '',
      answer: d?.answer ?? '',
      wordCount: d?.wordCount ?? 0,
      scores: d?.scores ?? { grammar: 0, logic: 0, context: 0, fluency: 0, total: 0 },
      feedback: d?.feedback ?? '',
      submittedAt: (d?.submittedAt as { toDate?: () => Date })?.toDate?.()?.toISOString() ?? '',
      scoredAt: (d?.scoredAt as { toDate?: () => Date })?.toDate?.()?.toISOString() ?? '',
      processingTime: d?.processingTime ?? 0,
    } as Submission;
  }

  // submissionId フィールドで検索
  const q = query(
    collection(db, 'submissions'),
    where('submissionId', '==', submissionIdOrDocId),
    limit(1)
  );
  const snapshot = await getDocs(q);
  const docSnap = snapshot.docs[0];
  if (!docSnap) return null;

  const d = docSnap.data();
  return {
    submissionId: d.submissionId ?? docSnap.id,
    questId: d.questId ?? '',
    userId: d.userId ?? '',
    answer: d.answer ?? '',
    wordCount: d.wordCount ?? 0,
    scores: d.scores ?? { grammar: 0, logic: 0, context: 0, fluency: 0, total: 0 },
    feedback: d.feedback ?? '',
    submittedAt: d.submittedAt?.toDate?.()?.toISOString() ?? '',
    scoredAt: d.scoredAt?.toDate?.()?.toISOString() ?? '',
    processingTime: d.processingTime ?? 0,
  } as Submission;
}

/**
 * 提出データを作成
 * any → Record<string, unknown> に修正
 */
export const createSubmission = async (
  submissionData: Record<string, unknown>
): Promise<{ id: string }> => {
  try {
    const submissionsRef = collection(db, 'submissions');
    const docRef = await addDoc(submissionsRef, submissionData);
    return { id: docRef.id };
  } catch (error) {
    console.error('Error creating submission:', error);
    throw error;
  }
};

/**
 * 提出データを更新
 * any → Record<string, unknown> に修正
 */
export const updateSubmission = async (
  submissionId: string,
  updates: Record<string, unknown>
): Promise<void> => {
  try {
    const docRef = doc(db, 'submissions', submissionId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating submission:', error);
    throw error;
  }
};

/**
 * ユーザーの統計情報を更新 (合計スコア加算、提出回数+1)
 */
export const updateUserStats = async (userId: string, scoreToAdd: number): Promise<void> => {
  // guestユーザーの場合はスキップ
  if (userId === 'guest') return;

  try {
    const userRef = doc(db, 'users', userId);

    // アトミックなインクリメント処理
    await updateDoc(userRef, {
      totalScore: increment(scoreToAdd),
      submissionCount: increment(1),
      lastActiveAt: serverTimestamp(),
    });
  } catch (error) {
    // ユーザーが存在しない場合などのエラーハンドリング
    console.error('Error updating user stats:', error);
    // 必要であればここでユーザー作成処理を入れることも可能
  }
};
