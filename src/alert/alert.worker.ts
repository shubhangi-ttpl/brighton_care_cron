import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { AlertService } from './alert.service';
import { IncidentAlertJobData } from './interfaces/incident-alert-job.interface';
import { NoteAlertJobData } from './interfaces/note-alert-job.interface';
import {
  INCIDENT_ALERT_JOB,
  INCIDENT_ALERT_QUEUE,
  NOTE_ALERT_JOB,
  NOTE_ALERT_QUEUE,
} from '../common/constants/bull.constants';

@Processor(INCIDENT_ALERT_QUEUE)
export class AlertWorker extends WorkerHost {
  constructor(private readonly alertService: AlertService) {
    super();
  }

  async process(job: Job<IncidentAlertJobData>): Promise<void> {
    if (job.name !== INCIDENT_ALERT_JOB) {
      return;
    }
    await this.alertService.sendIncidentAlert(job.data);
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(`Incident alert job ${job.id} is active`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Incident alert job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.log(`Incident alert job ${job.id} failed`, err);
  }
}

@Processor(NOTE_ALERT_QUEUE)
export class NoteAlertWorker extends WorkerHost {
  constructor(private readonly alertService: AlertService) {
    super();
  }

  async process(job: Job<NoteAlertJobData>): Promise<void> {
    console.log(
      `NoteAlertWorker: Processing job ${job.id}, name: ${job.name}, expected: ${NOTE_ALERT_JOB}`,
    );
    if (job.name !== NOTE_ALERT_JOB) {
      console.log(
        `NoteAlertWorker: Job name mismatch. Skipping job ${job.id}`,
      );
      return;
    }
    console.log(
      `NoteAlertWorker: Sending note alert for alertId=${job.data.alertId}, noteId=${job.data.noteId}, emails=${job.data.emails.join(', ')}`,
    );
    await this.alertService.sendNoteAlert(job.data);
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(`Note alert job ${job.id} is active`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Note alert job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.log(`Note alert job ${job.id} failed`, err);
  }
}
