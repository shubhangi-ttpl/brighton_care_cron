import { Injectable, Logger } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly sesClient: SESClient;
  private readonly senderEmail: string;
  private readonly isConfigured: boolean;

  constructor() {
    const region = process.env.AWS_REGION;
    const isLocal = process.env.NODE_ENV === 'local';

    if (!region) {
      this.isConfigured = false;
      this.logger.warn('AWS_REGION is not configured; email sending disabled.');
      return;
    }

    this.senderEmail = String(process.env.AWS_EMAIL_SOURCE || '');
    if (!this.senderEmail) {
      this.isConfigured = false;
      this.logger.warn(
        'AWS_EMAIL_SOURCE is not configured; email sending disabled.',
      );
      return;
    }

    this.sesClient = new SESClient({
      region,
      ...(isLocal && {
        credentials: {
          accessKeyId: String(process.env.AWS_ACCESS_KEY),
          secretAccessKey: String(process.env.AWS_SECRET_KEY),
        },
      }),
    });
    this.isConfigured = true;
  }

  async sendEmail(
    email: string,
    subject: string,
    body: string,
    isHtml = true,
  ): Promise<void> {
    if (!this.isConfigured) {
      this.logger.debug(
        `Email skipped for ${email}; notification service not configured.`,
      );
      return;
    }

    try {
      const command = new SendEmailCommand({
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Subject: { Data: subject },
          Body: isHtml
            ? { Html: { Data: body } }
            : {
                Text: { Data: body },
              },
        },
        Source: this.senderEmail,
      });

      await this.sesClient.send(command);
      this.logger.log(`Notification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}`, error as Error);
      throw error;
    }
  }

  async sendBulkEmail(
    emails: string[],
    subject: string,
    body: string,
  ): Promise<void> {
    const uniqueEmails = Array.from(new Set(emails));
    const tasks = uniqueEmails.map((email) =>
      this.sendEmail(email, subject, body),
    );

    const results = await Promise.allSettled(tasks);
    const failed = results.filter((result) => result.status === 'rejected');
    if (failed.length > 0) {
      this.logger.warn(
        `${failed.length} alert notification(s) failed to send via SES`,
      );
    }
  }
}

