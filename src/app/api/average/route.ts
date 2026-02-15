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
    let totalContext = 0;
    let totalFluency = 0;
    let totalGrammar = 0;
    let totalLogic = 0;
    for (const submission of submissions) {
      totalScore += submission.score?.total ?? 0;
      totalContext += submission.score?.context ?? 0;
      totalFluency += submission.score?.fluency ?? 0;
      totalGrammar += submission.score?.grammar ?? 0;
      totalLogic += submission.score?.logic ?? 0;
    }
    const averageTotal = totalScore / submissions.length;
    const averageContext = totalContext / submissions.length;
    const averageFluency = totalFluency / submissions.length;
    const averageGrammar = totalGrammar / submissions.length;
    const averageLogic = totalLogic / submissions.length;
    return NextResponse.json(
      {
        averageTotal: averageTotal,
        averageContext: averageContext,
        averageFluency: averageFluency,
        averageGrammar: averageGrammar,
        averageLogic: averageLogic,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
