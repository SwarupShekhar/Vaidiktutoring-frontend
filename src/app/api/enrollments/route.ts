import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import api from '@/app/lib/api';

export async function POST(req: Request) {
  try {
    const { userId, getToken } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = await getToken();
    const body = await req.json();
    const response = await api.post('/enrollments', body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Enrollment failed' },
      { status: error.response?.status || 500 }
    );
  }
}
