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

    /*
        const today = new Date();
        if (quest.date !== today.toDateString()) {
            return NextResponse.json({ error: 'Quest is not active today' }, { status: 400 });
        }
        */

    const new_submission = await SubmissionService.createNewSubmission(
      userId,
      questId,
      answer,
      quest
    );
    if (new_submission === null) {
      return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
    }
    return NextResponse.json({ new_submission }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
