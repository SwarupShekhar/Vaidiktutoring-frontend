// Add this endpoint to your SessionsController

import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DailyService } from '../daily/daily.service';

@Controller('sessions')
export class SessionsController {
    constructor(
        private readonly dailyService: DailyService,
        // ... other services
    ) { }

    /**
     * GET /sessions/:id/daily-token
     * Generate Daily.co room and token for a session
     */
    @Get(':id/daily-token')
    @UseGuards(JwtAuthGuard)
    async getDailyToken(@Param('id') sessionId: string, @Req() req) {
        const user = req.user; // From JWT

        console.log(`[Daily] Token requested for session ${sessionId} by user ${user.email}`);

        // Create or get room
        const room = await this.dailyService.createRoom(sessionId);

        // Determine if user is owner (tutor/admin)
        const isOwner = user.role === 'tutor' || user.role === 'admin';

        // Generate meeting token
        const userName = user.first_name || user.email || 'User';
        const token = await this.dailyService.createMeetingToken(
            room.name,
            isOwner,
            userName
        );

        return {
            roomUrl: room.url,
            token: token,
            debug: {
                isOwner,
                role: user.role,
                userName
            }
        };
    }

    // ... other endpoints
}
