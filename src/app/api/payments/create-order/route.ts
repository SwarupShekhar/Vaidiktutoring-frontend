import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import api from '@/app/lib/api';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { packageId } = body;

    if (!packageId) {
      return NextResponse.json({ error: 'Package ID required' }, { status: 400 });
    }

    // Use existing API instance which handles auth automatically
    const response = await api.post('/payments/create-order', { packageId });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to create order' },
      { status: error.response?.status || 500 }
    );
  }
}
