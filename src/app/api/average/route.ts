import { NextResponse } from 'next/server';
import { SubmissionService } from '@/server/services/submission';

export async function GET(request: Request) {
  try {
    const user = request.headers.get('userId');
    if (!user) {
      return NextResponse.json({ error: 'Missing userId in headers' }, { status: 400 });
    }

    const submissions = await SubmissionService.GetSubmissionListByUser(user);
    if (!submissions || submissions.length === 0) {
      return NextResponse.json({ error: 'No submissions found for user' }, { status: 404 });
    }

    console.log('Submissions for user:', submissions);

    let totalScore = 0;
    for (const submission of submissions) {
      totalScore += submission.score?.total ?? 0;
    }
    const averageScore = totalScore / submissions.length;

    return NextResponse.json({ averageScore: averageScore }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
