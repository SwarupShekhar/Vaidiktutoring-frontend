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

    // Add debugging
    console.log('[Payment API] Creating order for user:', userId, 'package:', packageId);
    console.log('[Payment API] Backend URL:', process.env.NEXT_PUBLIC_API_URL || 'https://k-12-backend.onrender.com');

    // Use existing API instance which handles auth automatically
    const response = await api.post('/payments/create-order', { packageId });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Create order error:', error);
    
    // Add more detailed error logging
    if (error.code === 'ECONNABORTED') {
      console.error('[Payment API] Request timeout - backend may be down');
      return NextResponse.json(
        { error: 'Backend service is temporarily unavailable. Please try again.' },
        { status: 503 }
      );
    }
    
    if (error.response?.status === 401) {
      console.error('[Payment API] Authentication failed');
      return NextResponse.json(
        { error: 'Authentication failed. Please log in again.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to create order' },
      { status: error.response?.status || 500 }
    );
  }
}
