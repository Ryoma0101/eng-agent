import { NextResponse } from 'next/server';
import { QuestService } from '@/server/services/quest';

export async function GET(request: Request) {
  try {
    const today = new Date();
    const todayQuest = await QuestService.GetDailyQuest(today);
    if (!todayQuest) {
      return NextResponse.json({ error: 'No quest found for today' }, { status: 404 });
    }
    return NextResponse.json(
      {
        questId: todayQuest.id,
        date: todayQuest.date,
        title: todayQuest.title,
        prompt: todayQuest.prompt,
        wordCountMin: todayQuest.wordCountMin,
        wordCountMax: todayQuest.wordCountMax,
        difficulty: todayQuest.difficulty,
        category: todayQuest.category,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
