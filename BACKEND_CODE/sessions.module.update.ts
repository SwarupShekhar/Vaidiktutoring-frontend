// Add DailyService to your SessionsModule

import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { DailyService } from '../daily/daily.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [SessionsController],
    providers: [
        SessionsService,
        DailyService,  // <-- Add this
        PrismaService
    ],
    exports: [SessionsService]
})
export class SessionsModule { }
