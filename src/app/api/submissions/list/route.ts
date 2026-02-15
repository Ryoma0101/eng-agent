import { SubmissionService } from '@/server/services/submission';
import { QuestService } from '@/server/services/quest';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId header is required' }, { status: 401 });
    }

    const submissions = await SubmissionService.GetSubmissionListByUser(userId);

    // Firestore モデル → フロント Submission 型へマッピング
    const mapped = await Promise.all(
      submissions.map(async (sub) => {
        // questId からクエスト情報を取得（タイトル表示用）
        const quest = await QuestService.FindQuestByQuestId(sub.questId).catch(() => null);

        return {
          submissionId: (sub as unknown as { id?: string }).id ?? sub.questId,
          questId: sub.questId,
          questTitle: quest?.title ?? null,
          userId: sub.userId,
          answer: sub.answer,
          wordCount: sub.wordCount,
          scores: sub.score,
          feedback: sub.feedback,
          submittedAt:
            sub.createdAt instanceof Date
              ? sub.createdAt.toISOString()
              : typeof sub.createdAt === 'object' && 'toDate' in sub.createdAt
                ? (sub.createdAt as { toDate: () => Date }).toDate().toISOString()
                : String(sub.createdAt),
          scoredAt:
            sub.updatedAt instanceof Date
              ? sub.updatedAt.toISOString()
              : typeof sub.updatedAt === 'object' && 'toDate' in sub.updatedAt
                ? (sub.updatedAt as { toDate: () => Date }).toDate().toISOString()
                : String(sub.updatedAt),
        };
      })
    );

    // 新しい順にソート
    mapped.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return NextResponse.json({ submissions: mapped }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
