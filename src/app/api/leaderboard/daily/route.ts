import { UserService } from '@/server/services/user';
import { QuestService } from '@/server/services/quest';
import { SubmissionService } from '@/server/services/submission';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const today = new Date();
    const quest = await QuestService.GetDailyQuest(today);
    if (!quest) {
      return NextResponse.json({ error: 'No quest found for today' }, { status: 404 });
    }

    const submissionList = await SubmissionService.GetSubmissionListByQuest(quest.id);
    if (!submissionList) {
      return NextResponse.json({ error: 'No submissions found for today' }, { status: 404 });
    }

    const date = quest.date;
    const rankingList = [...submissionList].sort(
      (a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0)
    );

    const ranking = await Promise.all(
      rankingList.map(async (s, index) => {
        const user = await UserService.FindUserById(s.userId);
        return {
          rank: index + 1,
          userId: s.userId,
          displayName: user?.displayName || 'Unknown',
          score: s.score?.total ?? 0,
        };
      })
    );

    const response = {
      date: date,
      ranking: ranking,
      totalUsers: submissionList.length,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
