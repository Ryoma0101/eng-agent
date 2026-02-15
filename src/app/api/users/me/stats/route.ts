import { UserService } from '@/server/services/user';
import { QuestService } from '@/server/services/quest';
import { SubmissionService } from '@/server/services/submission';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // 1. ヘッダーからのユーザーID取得とバリデーション
    const userId = request.headers.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId in headers' }, { status: 400 });
    }

    // 2. ユーザーの存在確認
    const user = await UserService.FindUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 3. 今日のクエスト取得（管理者作成の共通クエスト）
    const todayQuest = await QuestService.GetDailyQuest(new Date());
    if (!todayQuest) {
      return NextResponse.json({ error: 'No quest found for today' }, { status: 404 });
    }

    // 4. 今日の全提出データを取得してランキングを算出
    const todaySubmissions = await SubmissionService.GetSubmissionListByQuest(todayQuest.id);
    if (!todaySubmissions || todaySubmissions.length === 0) {
      return NextResponse.json({ error: 'No submissions found for today' }, { status: 404 });
    }

    // 自分の提出を確認
    const myTodaySubmission = todaySubmissions.find((s) => s.userId === userId);
    if (!myTodaySubmission) {
      return NextResponse.json({ error: 'Your submission not found' }, { status: 404 });
    }

    // スコア順にソートして順位を確定
    const sortedAll = [...todaySubmissions].sort(
      (a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0)
    );
    const rank = sortedAll.findIndex((s) => s.userId === userId) + 1;

    // 5. 連続日数 (Streak) の計算ロジック
    const userSubmissionList = await SubmissionService.GetSubmissionListByUser(userId);

    // 最新順にソート (createdAt: Date をミリ秒に変換して比較)
    const sortedUserSubs = [...userSubmissionList].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    let streak = 0;
    // 起点となる日付を今日（または最新の提出日）に設定
    // ここでは quest.date が YYYYMMDD (number) であると仮定したロジック
    let lastCheckDate: number = 0;

    for (const sub of sortedUserSubs) {
      // 自分の提出履歴から「今日のクエスト」を探す
      if (sub.questId === todayQuest.id) {
        streak = 1;
        // モデル定義に合わせて submission に date があるか確認
        // なければ sub.createdAt から算出
        lastCheckDate = Number(todayQuest.date);
        continue;
      }

      // 1日ずつ遡れているかチェック (数値として計算する場合)
      // submission.date が YYYYMMDD 形式ならこれで動作
      const subDate = Number(sub.createdAt.toISOString().split('T')[0].replace(/-/g, ''));
      if (streak > 0 && subDate === lastCheckDate - 1) {
        streak += 1;
        lastCheckDate = subDate;
      } else if (streak > 0) {
        break; // 連続が途切れた
      }
    }

    // 6. 最終レスポンス
    return NextResponse.json(
      {
        todayScore: myTodaySubmission.score.total ?? 0,
        rank: rank,
        streak: streak,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('API Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
