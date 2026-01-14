import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { NotificationService } from '../notification/notification.service';
import {
  INCIDENT_ALERT_QUEUE,
  NOTE_ALERT_QUEUE,
} from '../common/constants/bull.constants';
import { AlertWorker, NoteAlertWorker } from './alert.worker';

@Module({
  imports: [
    BullModule.registerQueue({ name: INCIDENT_ALERT_QUEUE }),
    BullModule.registerQueue({ name: NOTE_ALERT_QUEUE }),
  ],
  controllers: [AlertController],
  providers: [
    AlertService,
    NotificationService,
    AlertWorker,
    NoteAlertWorker,
  ],
  exports: [AlertService],
})
export class AlertModule {}
