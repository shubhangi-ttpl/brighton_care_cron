import { Logger, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { PrismaClient } from '@prisma/client';
import { CronService } from './cron.service';
import {
  INCIDENT_ALERT_QUEUE,
  NOTE_ALERT_QUEUE,
} from '../common/constants/bull.constants';
import { RedisService } from '../utils/redis.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.registerQueue({ name: INCIDENT_ALERT_QUEUE }),
    BullModule.registerQueue({ name: NOTE_ALERT_QUEUE }),
  ],
  providers: [CronService, PrismaClient, Logger, RedisService],
})
export class CronModule {}
