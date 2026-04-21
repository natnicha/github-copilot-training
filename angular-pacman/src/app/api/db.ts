import { JSONFilePreset } from 'lowdb/node';
import { cache } from 'react';

export interface Score {
  id: string;
  name: string;
  point: number;
  imageUrl: string;
}

export interface Data {
  scores: Score[];
}

const defaultData: Data = {
  scores: [
    { id: '1', name: 'Pinky', point: 1200, imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400' },
    { id: '2', name: 'Blinky', point: 1500, imageUrl: 'https://images.unsplash.com/photo-1551103782-8ab0755e3b2b?w=400' },
    { id: '3', name: 'Inky', point: 1100, imageUrl: 'https://images.unsplash.com/photo-1551103782-8f1d3c0c144a?w=400' },
    { id: '4', name: 'Clyde', point: 900, imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b25272ef?w=400' },
  ],
};

let dbPromise: Promise<any> | null = null;

export const getDb = cache(async () => {
  if (!dbPromise) {
    dbPromise = JSONFilePreset<Data>('db.json', defaultData);
  }
  const db = await dbPromise;
  await db.read();

  if (!db.data.scores) {
    db.data.scores = defaultData.scores;
    await db.write();
  }

  return db;
});

