/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */

import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaClient, Prisma } from '@prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import axios from 'axios';

import { CommonStatus } from '../common/enums/common-status.enum';
import {
  INCIDENT_ALERT_JOB,
  INCIDENT_ALERT_QUEUE,
  NOTE_ALERT_JOB,
  NOTE_ALERT_QUEUE,
} from '../common/constants/bull.constants';
import { IncidentAlertJobData } from '../alert/interfaces/incident-alert-job.interface';
import { NoteAlertJobData } from '../alert/interfaces/note-alert-job.interface';
import { RedisService } from '../utils/redis.service';

@Injectable()
export class CronService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly logger: Logger,
    @InjectQueue(INCIDENT_ALERT_QUEUE)
    private readonly incidentAlertQueue: Queue,
    @InjectQueue(NOTE_ALERT_QUEUE)
    private readonly noteAlertQueue: Queue,
    private redisService: RedisService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async enqueueAlerts(): Promise<void> {
    const now = new Date();
    try {
      this.logger.log(
        'Alert cron triggered - processing incident and note alerts',
      );

      // Process incident alerts
      await this.processIncidentAlerts(now);

      // Process note alerts
      await this.processNoteAlerts(now);

      this.logger.log('Alert cron completed successfully');
    } catch (error) {
      this.logger.error(
        'Failed to enqueue alert notifications',
        (error as Error).stack,
      );
    }
  }

  private async processIncidentAlerts(now: Date): Promise<void> {
    try {
      this.logger.log('Processing incident alerts');
      const incidentAlerts = await this.prisma.incidentAlert.findMany({
        where: {
          status: CommonStatus.ACTIVE,
          startDate: { lte: now },
          endDate: { gte: now },
          afterHourAction: { not: null },
          incidentId: { not: null },
        },
        include: {
          incident: {
            select: {
              id: true,
              incident: true,
              incidentDate: true,
              incidentTime: true,
              location: true,
              relatedInjuries: true,
              witnessToIncident: true,
              firstAid: true,
              firstAidDescription: true,
              nurseProgress: true,
              notify: true,
              resident: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      console.log(incidentAlerts, 'incidentAlerts');

      this.logger.log(
        `Fetched ${incidentAlerts.length} eligible incident alerts for processing`,
      );

      if (!incidentAlerts.length) {
        return;
      }

      for (const alert of incidentAlerts) {
        if (!alert.incident) {
          continue;
        }

        const intervalHours = this.parseIntervalHours(alert.afterHourAction);
        if (!intervalHours) {
          continue;
        }

        if (!this.shouldSendAlert(now, intervalHours, alert.lastSentAt)) {
          continue;
        }

        const emails = this.extractEmails(alert.incident.notify);
        if (!emails.length) {
          continue;
        }

        const residentName = this.getResidentName(alert.incident);
        const incidentDateLabel = this.formatIncidentDate(
          alert.incident.incidentDate,
        );
        const incidentTime = alert.incident.incidentTime || '';

        const payload: IncidentAlertJobData = {
          alertId: alert.id,
          incidentId: alert.incident.id,
          emails,
          residentName,
          alertInstructions: alert.alertInstructions,
          incidentDateLabel,
          incidentTime,
          incidentDetails: {
            incident: alert.incident.incident,
            location: alert.incident.location,
            relatedInjuries: alert.incident.relatedInjuries,
            witnessToIncident: alert.incident.witnessToIncident,
            firstAid: alert.incident.firstAid,
            firstAidDescription: alert.incident.firstAidDescription,
            nurseProgress: alert.incident.nurseProgress,
          },
        };

        await this.incidentAlertQueue.add(INCIDENT_ALERT_JOB, payload, {
          removeOnComplete: 1000,
          removeOnFail: 500,
          attempts: 3,
          backoff: {
            type: 'fixed',
            delay: 2000,
          },
        });

        await this.prisma.incidentAlert.update({
          where: { id: alert.id },
          data: {
            lastSentAt: now,
            isSent: true,
          },
        });

        this.logger.log(
          `Enqueued incident alert job for alertId=${alert.id}, incidentId=${alert.incident.id}`,
        );
      }
      this.logger.log('Incident alerts processing completed');
    } catch (error) {
      this.logger.error(
        'Failed to enqueue incident alert notifications',
        (error as Error).stack,
      );
    }
  }

  private async processNoteAlerts(now: Date): Promise<void> {
    try {
      this.logger.log('Processing note alerts');
      const noteAlerts = await this.prisma.incidentAlert.findMany({
        where: {
          status: CommonStatus.ACTIVE,
          startDate: { lte: now },
          endDate: { gte: now },
          afterHourAction: { not: null },
          noteId: { not: null },
          incidentId: null, // Ensure this is a note alert, not an incident alert
        },
        include: {
          note: {
            select: {
              id: true,
              noteName: true,
              tags: true,
              date: true,
              time: true,
              resident: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  responsiblePerson: {
                    where: {
                      email: { not: null },
                    },
                    select: {
                      email: true,
                      roles: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      this.logger.log(
        `Fetched ${noteAlerts.length} eligible note alerts for processing`,
      );

      if (!noteAlerts.length) {
        this.logger.log('No note alerts found matching criteria');
        return;
      }

      for (const alert of noteAlerts) {
        if (!alert.note) {
          this.logger.warn(`Note alert ${alert.id} has no associated note`);
          continue;
        }

        const intervalHours = this.parseIntervalHours(alert.afterHourAction);
        if (!intervalHours) {
          this.logger.warn(
            `Note alert ${alert.id} has invalid afterHourAction: ${alert.afterHourAction}`,
          );
          continue;
        }

        if (!this.shouldSendAlert(now, intervalHours, alert.lastSentAt)) {
          continue;
        }
        console.log(alert, 'alert');
        this.logger.log(JSON.stringify(alert, null, 2), 'alert');

        const responsiblePersons = alert.note.resident?.responsiblePerson || [];
        console.log(
          'Responsible persons from resident:',
          JSON.stringify(responsiblePersons, null, 2),
        );
        this.logger.log(
          `Note alert ${alert.id}: Found ${responsiblePersons.length} responsible persons with  Resident ID: ${alert.note.resident?.id}. Checking roles...`,
        );
        if (responsiblePersons.length > 0) {
          responsiblePersons.forEach((person, index) => {
            console.log(
              `Person ${index + 1}:`,
              JSON.stringify(person, null, 2),
            );
            this.logger.log(
              `  Person ${index + 1}: email=${person.email}, roles=${JSON.stringify(person.roles)}`,
            );
          });
        }

        const emails =
          this.extractEmailsFromResponsiblePersons(responsiblePersons);
        if (!emails.length) {
          this.logger.warn(
            `Note alert ${alert.id} skipped - no email recipients found with allowed roles (Responsible person, Primary Care Provider). Resident ID: ${alert.note.resident?.id}, Total responsible persons: ${responsiblePersons.length}`,
          );
          continue;
        }

        this.logger.log(
          `Processing note alert ${alert.id} with ${emails.length} email recipients`,
        );

        const residentName = this.getResidentNameFromNote(alert.note);
        const noteDateLabel = this.formatNoteDate(alert.note.date);
        const noteTime = alert.note.time || '';

        const payload: NoteAlertJobData = {
          alertId: alert.id,
          noteId: alert.note.id,
          emails,
          residentName,
          alertInstructions: alert.alertInstructions,
          noteDateLabel,
          noteTime,
          noteDetails: {
            noteName: alert.note.noteName,
            tags: alert.note.tags,
            date: alert.note.date,
            time: alert.note.time,
          },
        };

        await this.noteAlertQueue.add(NOTE_ALERT_JOB, payload, {
          removeOnComplete: 1000,
          removeOnFail: 500,
          attempts: 3,
          backoff: {
            type: 'fixed',
            delay: 2000,
          },
        });

        await this.prisma.incidentAlert.update({
          where: { id: alert.id },
          data: {
            lastSentAt: now,
            isSent: true,
          },
        });

        this.logger.log(
          `Enqueued note alert job for alertId=${alert.id}, noteId=${alert.note.id}, emails=${emails.join(', ')}`,
        );
      }
      this.logger.log('Note alerts processing completed');
    } catch (error) {
      this.logger.error(
        'Failed to enqueue note alert notifications',
        (error as Error).stack,
      );
    }
  }

  private shouldSendAlert(
    now: Date,
    intervalHours: number,
    lastSentAt?: Date | null,
  ): boolean {
    if (!lastSentAt) {
      return true;
    }

    const intervalMs = intervalHours * 60 * 60 * 1000;
    return now.getTime() - new Date(lastSentAt).getTime() >= intervalMs;
  }

  private extractEmails(notify: Prisma.JsonValue | null): string[] {
    if (!notify || !Array.isArray(notify)) {
      return [];
    }

    const emails: string[] = [];
    notify.forEach((detail) => {
      if (this.isNotifyDetail(detail) && detail.email) {
        emails.push(String(detail.email));
      }
    });

    return Array.from(new Set(emails));
  }

  private getResidentName(
    incident?: {
      resident?: { firstName?: string | null; lastName?: string | null } | null;
    } | null,
  ): string {
    const firstName = incident?.resident?.firstName ?? '';
    const lastName = incident?.resident?.lastName ?? '';
    const name = `${firstName} ${lastName}`.trim();
    return name || 'Resident';
  }

  private getResidentNameFromNote(
    note?: {
      resident?: { firstName?: string | null; lastName?: string | null } | null;
    } | null,
  ): string {
    const firstName = note?.resident?.firstName ?? '';
    const lastName = note?.resident?.lastName ?? '';
    const name = `${firstName} ${lastName}`.trim();
    return name || 'Resident';
  }

  private formatIncidentDate(date?: Date | null): string {
    if (!date) {
      return new Date().toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  }

  private formatNoteDate(date?: Date | null): string {
    if (!date) {
      return new Date().toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  }

  private extractEmailsFromResponsiblePersons(
    responsiblePersons: Array<{
      email?: string | null;
      roles?: Prisma.JsonValue | null;
    }>,
  ): string[] {
    const emails: string[] = [];
    const allowedRoles = ['Responsible Person', 'Primary Care Provider'];

    console.log(
      'responsiblePersons',
      JSON.stringify(responsiblePersons, null, 2),
    );
    responsiblePersons.forEach((person) => {
      if (!person.email) {
        return;
      }

      // Check if person has one of the allowed roles
      let hasAllowedRole = false;

      if (person.roles && Array.isArray(person.roles)) {
        hasAllowedRole = person.roles.some((role) => {
          if (typeof role === 'string') {
            const roleLower = role.trim().toLowerCase();
            return allowedRoles.some(
              (allowed) => roleLower === allowed.toLowerCase(),
            );
          }
          return false;
        });
      }

      if (hasAllowedRole) {
        emails.push(String(person.email));
        this.logger.log(
          `Including email ${person.email} with roles: ${JSON.stringify(person.roles)}`,
        );
      } else {
        this.logger.log(
          `Excluding email ${person.email} - roles ${JSON.stringify(person.roles)} do not match allowed roles: ${allowedRoles.join(', ')}`,
        );
      }
    });

    const uniqueEmails = Array.from(new Set(emails));
    this.logger.log(
      `extractEmailsFromResponsiblePersons: Processed ${responsiblePersons.length} persons, found ${uniqueEmails.length} emails with allowed roles. Emails: ${uniqueEmails.length > 0 ? uniqueEmails.join(', ') : 'none'}`,
    );
    return uniqueEmails;
  }

  private parseIntervalHours(value?: string | null): number | null {
    if (!value) {
      return null;
    }
    const match = String(value).match(/[\d.]+/);
    if (!match) {
      return null;
    }
    const result = Number(match[0]);
    if (Number.isNaN(result) || result <= 0) {
      return null;
    }
    return result;
  }

  private isNotifyDetail(detail: unknown): detail is { email?: string | null } {
    if (typeof detail !== 'object' || detail === null) {
      return false;
    }
    if (!('email' in detail)) {
      return true;
    }
    const emailValue = (detail as { email?: unknown }).email;
    return emailValue === null || typeof emailValue === 'string';
  }

  @Cron(CronExpression.EVERY_HOUR)
  async logHourly(): Promise<void> {
    this.logger.log('Hourly cron job executed');
    await this.selfHealRedisSapeyData();
  }

  async selfHealRedisSapeyData() {
    try {
      this.logger.log('Starting self-heal process for Redis Sapey data');

      const sessionCookie = await this.loginAndGetSessionCookie();
      if (!sessionCookie) {
        this.logger.warn('Login failed, skipping self-heal');
        return;
      }

      const sapeyFacilityCodes = process.env.SAPEY_FACILITY_CODES;
      if (!sapeyFacilityCodes) {
        this.logger.warn(
          'SAPEY_FACILITY_CODES env variable not set, skipping self-heal',
        );
        return;
      }

      const facilityCodes: Array<{
        name: string;
        code: string;
        'facility-id': string;
      }> = JSON.parse(sapeyFacilityCodes);

      if (!facilityCodes.length) {
        this.logger.warn('No facility codes found in env, skipping');
        return;
      }

      this.logger.log(`Loaded ${facilityCodes.length} facility codes from env`);

      let apiKeys: any[] = [];
      try {
        const response = await axios.get(
          `${process.env.SAPEY_BASE_URL}/api/auth/api-key/list`,
          { headers: { Cookie: sessionCookie } },
        );
        apiKeys = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        this.logger.warn(
          `Failed to fetch API keys from Sapey API: ${(error as Error).message}`,
        );
      }

      this.logger.log(`Fetched ${apiKeys.length} API keys from Sapey API`);

      if (!apiKeys.length) {
        this.logger.log(
          'No API keys found in Sapey API, creating tokens for all facilities',
        );
        for (const facility of facilityCodes) {
          await this.createAndCacheToken(facility, sessionCookie);
        }
        this.logger.log('Self-heal completed - created all tokens from env');
        return;
      }

      const sortedKeys = [...apiKeys].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      const latestByName = new Map<string, any>();
      for (const key of sortedKeys) {
        if (key.name && !latestByName.has(key.name)) {
          latestByName.set(key.name, key);
        }
      }

      this.logger.log(
        `Deduplicated API keys: ${latestByName.size} unique names from ${apiKeys.length} total`,
      );

      for (const facility of facilityCodes) {
        const cachedToken = await this.redisService.getData(facility.name);

        if (cachedToken) {
          this.logger.log(
            `Token already cached in Redis for: ${facility.name}`,
          );
          continue;
        }

        const existsInApi = latestByName.has(facility.name);
        if (existsInApi) {
          this.logger.log(
            `Token exists in API but missing from Redis for: ${facility.name}. Creating new token.`,
          );
        } else {
          this.logger.log(
            `Token missing from both API and Redis for: ${facility.name}. Creating new token.`,
          );
        }

        await this.createAndCacheToken(facility, sessionCookie);
      }

      this.logger.log('Self-heal process for Redis Sapey data completed');
    } catch (error) {
      this.logger.error('Self-heal process failed', (error as Error).stack);
    }
  }

  private async createAndCacheToken(
    facility: { name: string; code: string; 'facility-id': string },
    sessionCookie: string,
  ): Promise<void> {
    try {
      const response = await axios.post(
        `${process.env.SAPEY_BASE_URL}/api/auth/api-key/create`,
        {
          name: facility.name,
          expiresIn: null,
          metadata: {
            organizationId: process.env.SAPEY_ORG_ID,
            facilityId: facility['facility-id'],
            ehrSystem: facility.code,
          },
        },
        { headers: { Cookie: sessionCookie } },
      );

      await this.redisService.setData(
        facility.name,
        JSON.stringify(response.data),
      );
      this.logger.log(`Created and cached token for: ${facility.name}`);
    } catch (error) {
      this.logger.error(
        `Failed to create/cache token for ${facility.name}: ${(error as Error).message}`,
      );
    }
  }

  private async loginAndGetSessionCookie(): Promise<string | null> {
    try {
      const email = process.env.SAPEY_LOGIN_EMAIL;
      const password = process.env.SAPEY_LOGIN_PASSWORD;

      if (!email || !password) {
        this.logger.warn(
          'SAPEY_LOGIN_EMAIL or SAPEY_LOGIN_PASSWORD env variable not set',
        );
        return null;
      }

      const response = await axios.post(
        `${process.env.SAPEY_BASE_URL}/api/auth/sign-in/email`,
        { email, password },
      );

      const setCookieHeaders = response.headers['set-cookie'];
      if (!setCookieHeaders || !setCookieHeaders.length) {
        this.logger.warn('No set-cookie header in login response');
        return null;
      }

      const cookies = setCookieHeaders
        .map((cookie: string) => cookie.split(';')[0])
        .join('; ');

      this.logger.log(`Logged in as ${email}`);
      return cookies;
    } catch (error) {
      this.logger.error(`Failed to login: ${(error as Error).message}`);
      return null;
    }
  }
}
