import { UserService } from '@/server/services/user';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { uid, displayName, email } = body;
    if (!uid || !displayName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const user = await UserService.createUser(uid, displayName, email);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
