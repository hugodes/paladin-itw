import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Availability } from './availability/availability.entity';
import { MailService } from './mail/mail.service';
import appConfig from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Availability],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Availability]),
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
