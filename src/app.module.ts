import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { AlertModule } from './alert/alert.module';
import { CronModule } from './cron/cron.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
      defaultJobOptions: {
        attempts: 3, //if the job fails, it will be retried 3 times
        removeOnComplete: 1000, //remove the job from the queue if it is completed
        removeOnFail: 1000, //remove the job from the queue if it fails
        backoff: 2000, //backoff the job if it fails
      },
    }),
    AlertModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
