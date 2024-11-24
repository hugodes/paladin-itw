import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';
import ical, { ICalEventData } from 'ical-generator';
import { reasonMapping } from '../lib/reasonMapping';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private serviceEmail: string;

  constructor(private configService: ConfigService) {
    this.serviceEmail = this.configService.get<string>('app.serviceEmail');
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.serviceEmail,
        pass: this.configService.get<string>('app.emailPassword'),
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    templateName: string,
    templateData: any,
    icsContent: string,
  ) {
    const templatePath = path.join(
      __dirname,
      'templates',
      `${templateName}.ejs`,
    );
    const template = fs.readFileSync(templatePath, 'utf8');
    const html = ejs.render(template, { ...templateData, reasonMapping });

    const mailOptions = {
      from: this.serviceEmail, // Sender address
      to: to, // List of recipients
      subject: subject, // Subject line
      html: html, // HTML body
      alternatives: [
        {
          contentType: 'text/calendar',
          content: icsContent,
          method: 'REQUEST',
        },
      ],
    };

    return this.transporter.sendMail(mailOptions);
  }

  generateIcsFile(
    date: Date,
    startTime: string,
    endTime: string,
    summary: string,
    description: string,
    location: string,
  ): string {
    const event: ICalEventData = {
      start: new Date(`${date.toISOString().split('T')[0]}T${startTime}:00`),
      end: new Date(`${date.toISOString().split('T')[0]}T${endTime}:00`),
      summary: summary,
      description: description,
      location: location,
      url: location,
    };

    const calendar = ical();
    calendar.createEvent(event);

    return calendar.toString();
  }
}
