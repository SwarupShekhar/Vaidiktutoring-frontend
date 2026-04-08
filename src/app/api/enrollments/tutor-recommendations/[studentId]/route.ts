import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import api from '@/app/lib/api';

export async function GET(
  req: Request,
  props: { params: Promise<{ studentId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = await props.params;
    const studentId = params.studentId;
    const response = await api.get(`/enrollments/tutor-recommendations/${studentId}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch recommendations' },
      { status: error.response?.status || 500 }
    );
  }
}
