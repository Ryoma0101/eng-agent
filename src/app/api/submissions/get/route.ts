import { NextResponse } from 'next/server';
import { SubmissionService } from '@/server/services/submission';
import { QuestService } from '@/server/services/quest';

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId in headers' }, { status: 400 });
    }

    const today = new Date();
    const quest = await QuestService.GetDailyQuest(today);
    if (!quest) {
      return NextResponse.json({ error: 'No quest found for today' }, { status: 404 });
    }

    const submission = await SubmissionService.GetSubmissionByUserIdAndQuestId(userId, quest.id);
    if (!submission) {
      return NextResponse.json({ error: 'No submission found for today' }, { status: 404 });
    }

    if (userId !== submission.userId) {
      return NextResponse.json({ error: 'Unauthorized access to submission' }, { status: 403 });
    }

    return NextResponse.json(
      {
        submissionId: submission.id,
        questId: submission.questId,
        questDate: quest.date,
        questTitle: quest.title,
        prompt: quest.prompt,
        userId: submission.userId,
        answer: submission.answer,
        wordCount: submission.wordCount,
        scores: {
          grammar: submission.score?.grammar ?? 0,
          logic: submission.score?.logic ?? 0,
          context: submission.score?.context ?? 0,
          fluency: submission.score?.fluency ?? 0,
          total: submission.score?.total ?? 0,
        },
        feedback: submission.feedback,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
