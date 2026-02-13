import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { AlertModule } from './alert/alert.module';
import { CronModule } from './cron/cron.module';
import { Module } from '@nestjs/common';

const getRedisConnection = () => {
  const useTls =
    process.env.REDIS_TLS === 'true' || process.env.REDIS_TLS === '1';

  return {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT ?? '6379'),
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME ?? 'default',
    maxRetriesPerRequest: null,
    ...(useTls
      ? {
          tls: {
            rejectUnauthorized: false,
          },
        }
      : {}),
    enableReadyCheck: true,
    lazyConnect: false,
    connectTimeout: 10000,
    skipVersionCheck: true,
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 200, 2000);
      return delay;
    },
  };
};

@Module({
  imports: [
    BullModule.forRoot({
      connection: getRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 1000,
        removeOnFail: 1000,
        backoff: 2000,
      },
    }),
    AlertModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
