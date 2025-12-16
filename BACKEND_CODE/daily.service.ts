import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class DailyService {
    private readonly apiKey = process.env.DAILY_API_KEY;
    private readonly apiUrl = 'https://api.daily.co/v1';

    constructor() {
        if (!this.apiKey) {
            console.warn('[Daily] DAILY_API_KEY not configured. Video sessions will not work.');
        }
    }

    /**
     * Create or get a Daily.co room for a session
     */
    async createRoom(sessionId: string) {
        try {
            const roomName = `k12-session-${sessionId}`;

            // Try to get existing room first
            try {
                const getResponse = await axios.get(
                    `${this.apiUrl}/rooms/${roomName}`,
                    {
                        headers: {
                            Authorization: `Bearer ${this.apiKey}`,
                        }
                    }
                );
                console.log(`[Daily] Room ${roomName} already exists`);
                return getResponse.data;
            } catch (err: any) {
                // Room doesn't exist, create it
                if (err.response?.status === 404) {
                    console.log(`[Daily] Creating new room: ${roomName}`);
                    const createResponse = await axios.post(
                        `${this.apiUrl}/rooms`,
                        {
                            name: roomName,
                            privacy: 'private',
                            properties: {
                                enable_screenshare: true,
                                enable_chat: true,
                                enable_knocking: false,
                                enable_prejoin_ui: false,
                                start_video_off: true,
                                start_audio_off: true,
                                exp: Math.floor(Date.now() / 1000) + 7200 // 2 hours from now
                            }
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${this.apiKey}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    return createResponse.data;
                }
                throw err;
            }
        } catch (error: any) {
            console.error('[Daily] Failed to create/get room:', error.response?.data || error.message);
            throw new HttpException(
                'Failed to create video room',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Generate a meeting token for a user
     */
    async createMeetingToken(
        roomName: string,
        isOwner: boolean,
        userName: string
    ): Promise<string> {
        try {
            const response = await axios.post(
                `${this.apiUrl}/meeting-tokens`,
                {
                    properties: {
                        room_name: roomName,
                        is_owner: isOwner,
                        user_name: userName,
                        enable_screenshare: true,
                        start_video_off: true,
                        start_audio_off: true,
                        exp: Math.floor(Date.now() / 1000) + 7200 // 2 hours
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log(`[Daily] Generated token for ${userName} (owner: ${isOwner})`);
            return response.data.token;
        } catch (error: any) {
            console.error('[Daily] Failed to create meeting token:', error.response?.data || error.message);
            throw new HttpException(
                'Failed to generate meeting token',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
