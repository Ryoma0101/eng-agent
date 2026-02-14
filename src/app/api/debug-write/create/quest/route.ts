import { UserService } from '@/server/services/user';
import { QuestService } from '@/server/services/quest';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId in headers' }, { status: 400 });
    }

    const user = await UserService.FindUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const body = await request.json();
    const { title, prompt, wordCountMin, wordCountMax, difficulty, category } = body;
    await QuestService.CreateQuest(
      userId,
      title,
      prompt,
      wordCountMin,
      wordCountMax,
      difficulty,
      category
    );
    return NextResponse.json({ message: 'Quest created successfully' }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
