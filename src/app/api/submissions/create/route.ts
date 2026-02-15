import { NextResponse } from 'next/server';
import { UserService } from '@/server/services/user';
import { QuestService } from '@/server/services/quest';
import { SubmissionService } from '@/server/services/submission';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { questId, answer } = body;
    const userId = request.headers.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId in headers' }, { status: 400 });
    }

    const user = await UserService.FindUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const quest = await QuestService.FindQuestByQuestId(questId);
    if (!quest) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
    }

    const now = new Date();
    const jstOffset = 9 * 60; // 日本時間はUTC+9
    const localTime = new Date(now.getTime() + jstOffset * 60 * 1000);
    console.log('Local Time (JST):', localTime.toISOString().split('T')[0]);
    if (quest.date !== localTime.toISOString().split('T')[0]) {
      return NextResponse.json({ error: 'Quest is not active today' }, { status: 400 });
    }

    const questData = {
      questId: quest.id,
      date: quest.date,
      title: quest.title,
      prompt: quest.prompt,
      wordCountMin: quest.wordCountMin,
      wordCountMax: quest.wordCountMax,
      difficulty: quest.difficulty,
      category: quest.category,
    };
    const newSubmission = await SubmissionService.createNewSubmission(
      userId,
      questId,
      answer,
      questData
    );
    if (newSubmission === null) {
      return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
    }
    const response = {
      submissionId: newSubmission.submissionId,
      questId: newSubmission.questId,
      userId: newSubmission.userId,
      answer: newSubmission.answer,
      wordCount: newSubmission.wordCount,
      score: {
        grammar: newSubmission.score?.grammar ?? 0,
        logic: newSubmission.score?.logic ?? 0,
        context: newSubmission.score?.context ?? 0,
        fluency: newSubmission.score?.fluency ?? 0,
        total: newSubmission.score?.total ?? 0,
      },
      feedback: newSubmission.feedback,
      createdAt: newSubmission.createdAt,
      updatedAt: newSubmission.updatedAt,
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
