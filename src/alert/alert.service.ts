import { Injectable, Logger } from '@nestjs/common';
import { IncidentAlertJobData } from './interfaces/incident-alert-job.interface';
import { NoteAlertJobData } from './interfaces/note-alert-job.interface';
import { NotificationService } from '../notification/notification.service';
import {
  generateIncidentEmailBody,
  generateNoteEmailBody,
} from '../utils/email-template';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);

  constructor(private readonly notificationService: NotificationService) {}

  async sendIncidentAlert(jobData: IncidentAlertJobData): Promise<void> {
    if (!jobData.emails.length) {
      this.logger.warn(
        `No email recipients found for incident alert ${jobData.alertId}`,
      );
      return;
    }

    const subject = `Incident Alert Reminder - ${jobData.residentName}`;
    const incidentDate =
      jobData.incidentDateLabel || new Date().toLocaleDateString();
    const incidentTime = jobData.incidentTime || '';

    const incidentBody = generateIncidentEmailBody(
      jobData.residentName,
      jobData.incidentDetails,
      incidentDate,
      incidentTime,
    );

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
        <h2 style="color: #2c3e50; margin-bottom: 8px;">Incident Alert Reminder</h2>
        <p style="margin: 0 0 12px 0;">
          This is a reminder that the following incident alert remains active.
        </p>
        ${
          jobData.alertInstructions
            ? `<div style="background-color:#f8f9fa;padding:12px;border-left:4px solid #3498db;margin-bottom:16px;">
              <strong>Instructions:</strong>
              <p style="margin:8px 0 0 0;">${jobData.alertInstructions}</p>
            </div>`
            : ''
        }
        ${incidentBody}
      </div>
    `;

    await this.notificationService.sendBulkEmail(
      jobData.emails,
      subject,
      htmlBody,
    );
    this.logger.log(
      `Incident alert notification enqueued for alert ${jobData.alertId}`,
    );
  }

  async sendNoteAlert(jobData: NoteAlertJobData): Promise<void> {
    this.logger.log(
      `sendNoteAlert called for alertId=${jobData.alertId}, noteId=${jobData.noteId}, emails=${jobData.emails.length}`,
    );
    if (!jobData.emails.length) {
      this.logger.warn(
        `No email recipients found for note alert ${jobData.alertId}`,
      );
      return;
    }

    const subject = `Note Alert Reminder - ${jobData.residentName}`;
    const noteDate = jobData.noteDateLabel || new Date().toLocaleDateString();
    const noteTime = jobData.noteTime || '';

    const noteBody = generateNoteEmailBody(
      jobData.residentName,
      jobData.noteDetails,
      noteDate,
      noteTime,
    );

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
        <h2 style="color: #2c3e50; margin-bottom: 8px;">Note Alert Reminder</h2>
        <p style="margin: 0 0 12px 0;">
          This is a reminder that the following note alert remains active.
        </p>
        ${
          jobData.alertInstructions
            ? `<div style="background-color:#f8f9fa;padding:12px;border-left:4px solid #3498db;margin-bottom:16px;">
              <strong>Instructions:</strong>
              <p style="margin:8px 0 0 0;">${jobData.alertInstructions}</p>
            </div>`
            : ''
        }
        ${noteBody}
      </div>
    `;

    this.logger.log(
      `Sending note alert email to ${jobData.emails.join(', ')} for alert ${jobData.alertId}`,
    );
    await this.notificationService.sendBulkEmail(
      jobData.emails,
      subject,
      htmlBody,
    );
    this.logger.log(
      `Note alert notification sent successfully for alert ${jobData.alertId}`,
    );
  }
}
