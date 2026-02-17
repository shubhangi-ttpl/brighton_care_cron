/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { RedisService } from './utils/redis.service';

@Injectable()
export class AppService {
  constructor(
    private redisService: RedisService,
    private logger: Logger,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async selfHealRedis() {
    return await this.selfHealRedisSapeyData();
  }

  async selfHealRedisSapeyData() {
    try {
      this.logger.log(
        'selfHealRedisSapeyData | Starting self-heal process for Redis Sapey data',
      );

      const sessionCookie = await this.loginAndGetSessionCookie();
      if (!sessionCookie) {
        this.logger.warn(
          'selfHealRedisSapeyData | Login failed, skipping self-heal',
        );
        return;
      }

      const sapeyFacilityCodes = process.env.SAPEY_FACILITY_CODES;
      if (!sapeyFacilityCodes) {
        this.logger.warn(
          'selfHealRedisSapeyData | SAPEY_FACILITY_CODES env variable not set, skipping self-heal',
        );
        return;
      }

      const facilityCodes: Array<{
        name: string;
        code: string;
        'facility-id': string;
      }> = JSON.parse(sapeyFacilityCodes);

      if (!facilityCodes.length) {
        this.logger.warn(
          'selfHealRedisSapeyData | No facility codes found in env, skipping',
        );
        return;
      }

      this.logger.log(
        `selfHealRedisSapeyData | Loaded ${facilityCodes.length} facility codes from env`,
      );

      let apiKeys: any[] = [];
      try {
        this.logger.log(
          `selfHealRedisSapeyData | ${process.env.SAPEY_BASE_URL}/api/auth/api-key/list}`,
        );
        const response = await axios.get(
          `${process.env.SAPEY_BASE_URL}/api/auth/api-key/list`,
          { headers: { Cookie: sessionCookie } },
        );
        apiKeys = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        this.logger.warn(
          `selfHealRedisSapeyData | Failed to fetch API keys from Sapey API: ${(error as Error).message}`,
        );
      }

      this.logger.log(
        `selfHealRedisSapeyData | Fetched ${apiKeys.length} API keys from Sapey API`,
      );

      if (!apiKeys.length) {
        this.logger.log(
          'selfHealRedisSapeyData | No API keys found in Sapey API, creating tokens for all facilities',
        );
        for (const facility of facilityCodes) {
          await this.createAndCacheToken(facility, sessionCookie);
        }
        this.logger.log(
          'selfHealRedisSapeyData | Self-heal completed - created all tokens from env',
        );
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
        `selfHealRedisSapeyData | Deduplicated API keys: ${latestByName.size} unique names from ${apiKeys.length} total`,
      );

      for (const facility of facilityCodes) {
        const cachedToken = await this.redisService.getData(facility.name);

        if (cachedToken) {
          this.logger.log(
            `selfHealRedisSapeyData | Token already cached in Redis for: ${facility.name}`,
          );
          continue;
        }

        const existsInApi = latestByName.has(facility.name);
        if (existsInApi) {
          this.logger.log(
            `selfHealRedisSapeyData | Token exists in API but missing from Redis for: ${facility.name}. Creating new token.`,
          );
        } else {
          this.logger.log(
            `selfHealRedisSapeyData | Token missing from both API and Redis for: ${facility.name}. Creating new token.`,
          );
        }

        await this.createAndCacheToken(facility, sessionCookie);
      }

      this.logger.log(
        'selfHealRedisSapeyData | Self-heal process for Redis Sapey data completed',
      );
    } catch (error) {
      this.logger.error(
        'selfHealRedisSapeyData | Self-heal process failed',
        (error as Error).stack,
      );
    }
  }

  private async createAndCacheToken(
    facility: { name: string; code: string; 'facility-id': string },
    sessionCookie: string,
  ): Promise<void> {
    try {
      this.logger.log(
        `createAndCacheToken | ${process.env.SAPEY_BASE_URL}/api/auth/api-key/create`,
      );
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
      this.logger.log(
        `createAndCacheToken | Created and cached token for: ${facility.name}`,
      );
    } catch (error) {
      this.logger.error(
        `createAndCacheToken | Failed to create/cache token for ${facility.name}: ${(error as Error).message}`,
      );
    }
  }

  private async loginAndGetSessionCookie(): Promise<string | null> {
    try {
      const email = process.env.SAPEY_LOGIN_EMAIL;
      const password = process.env.SAPEY_LOGIN_PASSWORD;

      if (!email || !password) {
        this.logger.warn(
          'loginAndGetSessionCookie | SAPEY_LOGIN_EMAIL or SAPEY_LOGIN_PASSWORD env variable not set',
        );
        return null;
      }

      this.logger.log(
        `loginAndGetSessionCookie | ${process.env.SAPEY_BASE_URL}/api/auth/sign-in/email`,
      );
      const response = await axios.post(
        `${process.env.SAPEY_BASE_URL}/api/auth/sign-in/email`,
        { email, password },
      );

      const setCookieHeaders = response.headers['set-cookie'];
      if (!setCookieHeaders || !setCookieHeaders.length) {
        this.logger.warn(
          'loginAndGetSessionCookie | No set-cookie header in login response',
        );
        return null;
      }

      const cookies = setCookieHeaders
        .map((cookie: string) => cookie.split(';')[0])
        .join('; ');

      this.logger.log(`loginAndGetSessionCookie | Logged in as ${email}`);
      return cookies;
    } catch (error) {
      this.logger.error(
        `loginAndGetSessionCookie | Failed to login: ${(error as Error).message}`,
      );
      return null;
    }
  }
}
