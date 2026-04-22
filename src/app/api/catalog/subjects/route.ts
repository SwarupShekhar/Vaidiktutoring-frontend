import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import api from '@/app/lib/api';

export async function GET() {
  try {
    const { userId, getToken } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = await getToken();
    const response = await api.get('/subjects', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch subjects' },
      { status: error.response?.status || 500 }
    );
  }
}
