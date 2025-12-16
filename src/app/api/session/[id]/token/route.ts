
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { generateJitsiToken } from '@/app/lib/jitsi';
import { decodeToken } from '@/app/lib/jwt';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://k-12-backend.onrender.com';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id: sessionId } = await context.params;

    // 1. Extract Auth Token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        return NextResponse.json({ message: 'Missing Authorization header' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');

    // 2. Decode User to get ID/Email
    const decodedUser: any = decodeToken(token);
    if (!decodedUser) {
        return NextResponse.json({ message: 'Invalid token format' }, { status: 401 });
    }

    // Adjust based on your JWT payload structure (sub or userId)
    const userId = decodedUser.sub || decodedUser.userId || decodedUser.id;
    const userEmail = decodedUser.email;
    const userName = decodedUser.name || decodedUser.first_name || 'User';

    if (!userId) {
        return NextResponse.json({ message: 'Invalid token payload' }, { status: 401 });
    }

    // 4. NEW: Fetch Token from Backend Service
    // The backend now handles role checks, secrets, and strict token generation.
    try {
        console.log(`[Jitsi Proxy] Fetching token from Backend: ${API_URL}/sessions/${sessionId}/jitsi-token`);

        const backendRes = await axios.get(`${API_URL}/sessions/${sessionId}/jitsi-token`, {
            headers: { Authorization: authHeader }
        });

        const data = backendRes.data;
        const jitsiToken = data.token;

        // Backend might return roomName, or we derive it. 
        // Ideally backend returns the room name encoded in the token.
        // We will default to the standard format if missing.
        const JITSI_APP_ID = process.env.JITSI_APP_ID || 'my-app-id';
        const isJaaS = JITSI_APP_ID.startsWith('vpaas-magic-cookie');

        let roomName = data.roomName;
        if (!roomName) {
            roomName = `K12Session${sessionId.replace(/-/g, '').slice(0, 16)}`;
            if (isJaaS) roomName = `${JITSI_APP_ID}/${roomName}`;
        }

        let scriptUrl = data.scriptUrl;
        if (!scriptUrl) {
            scriptUrl = isJaaS
                ? `https://8x8.vc/${JITSI_APP_ID}/external_api.js`
                : 'https://meet.jit.si/external_api.js';
        }

        console.log('[Jitsi Proxy] Success. Room:', roomName);

        return NextResponse.json({
            token: jitsiToken,
            roomName: roomName,
            scriptUrl: scriptUrl,
            debug: { proxy: true, backendData: data }
        });

    } catch (error: any) {
        console.error('[Jitsi Proxy] Backend Failed:', error.message);
        if (error.response) {
            console.error('[Jitsi Proxy] Status:', error.response.status);
            console.error('[Jitsi Proxy] Data:', error.response.data);
            return NextResponse.json(error.response.data, { status: error.response.status });
        }
        return NextResponse.json({ message: 'Failed to fetch token from backend', error: error.message }, { status: 500 });
    }
}
