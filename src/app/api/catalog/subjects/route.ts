import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import api from '@/app/lib/api';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const response = await api.get('/catalog/subjects');
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch subjects' },
      { status: error.response?.status || 500 }
    );
  }
}
