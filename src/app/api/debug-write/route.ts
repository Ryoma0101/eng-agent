import { NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../server/firebase';

export async function GET() {
  const ref = await addDoc(collection(db, 'submissions'), {
    userId: 'dummy-user',
    theme: 'hello',
    score: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return NextResponse.json({ ok: true, id: ref.id });
}
