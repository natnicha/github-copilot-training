import { NextResponse } from 'next/server';
import { getDb, Score } from '../db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase();

  const db = await getDb();
  let scores = db.data.scores;

  if (search) {
    scores = scores.filter((s: Score) => s.name.toLowerCase().includes(search));
  }

  return NextResponse.json({ scores });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, point, imageUrl } = body;

    if (!name || typeof point !== 'number' || !imageUrl) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    const db = await getDb();
    const newScore: Score = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      point,
      imageUrl,
    };

    db.data.scores.push(newScore);
    await db.write();

    return NextResponse.json(newScore, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

