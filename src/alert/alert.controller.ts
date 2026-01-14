import { Controller, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AlertService } from './alert.service';
import {
  INCIDENT_ALERT_JOB,
  INCIDENT_ALERT_QUEUE,
} from '../common/constants/bull.constants';

@Controller('alert')
export class AlertController {
  constructor(
    private readonly alertService: AlertService,
    @InjectQueue(INCIDENT_ALERT_QUEUE)
    private readonly incidentAlertQueue: Queue,
  ) {}

  @Post('create')
  async createAlert() {
    await this.incidentAlertQueue.add(INCIDENT_ALERT_JOB, {
      alertId: 0,
      incidentId: 0,
      emails: [],
      residentName: 'Test Resident',
      incidentDetails: {},
    });
    return {
      message: 'Alert created successfully',
    };
  }
}
