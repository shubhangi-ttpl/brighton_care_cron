/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, Logger } from '@nestjs/common';
import { createClient } from 'redis';

export const redisClient = createClient({
  socket: {
    host: String(process.env.REDIS_HOST || 'localhost'),
    port: Number(process.env.REDIS_PORT || 6379),
  },
  // password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on('error', (error) => {
  Logger.error('Redis connection error:', error);
});

redisClient.on('connect', () => {
  Logger.debug('Connected to Redis');
});

redisClient.connect().catch(() => {
  // Don't crash if Redis fails
  Logger.error('Failed to connect to Redis');
});

@Injectable()
export class RedisService {
  async getToken(key: string) {
    return await redisClient.get(key);
  }

  getClient() {
    return redisClient;
  }

  async setData(key: string, value: any) {
    return await redisClient.set(key, value);
  }

  async getData(key: string) {
    return await redisClient.get(key);
  }

  async removeData(key: string) {
    return await redisClient.del(key);
  }
}
