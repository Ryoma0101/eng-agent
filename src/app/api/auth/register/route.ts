import { UserService } from '@/server/services/user';
import { UserRepository } from '@/server/repositories/user';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { uid, displayName, email } = body;
    if (!uid || !displayName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 既存ユーザーならそのまま返す（ログインの度に呼ばれるため）
    const existing = await UserRepository.FindUserById(uid);
    if (existing) {
      return NextResponse.json(existing, { status: 200 });
    }

    const user = await UserService.createUser(uid, displayName, email);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
