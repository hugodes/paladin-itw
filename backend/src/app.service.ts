import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Availability, Reason } from './availability/availability.entity';
import { MailService } from './mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private patientEmail: string;
  private doctorEmail: string;

  constructor(
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {
    this.patientEmail = this.configService.get<string>('app.patientEmail');
    this.doctorEmail = this.configService.get<string>('app.doctorEmail');
    console.log('Patient email:', this.patientEmail);
    console.log('Doctor email:', this.doctorEmail);
  }

  getHello(): string {
    return 'Hello World!';
  }

  async addAvailabilitySlot(date: Date, startTime: string, endTime: string): Promise<Availability> {
    const availability = new Availability();
    availability.date = date;
    availability.startTime = startTime;
    availability.endTime = endTime;
    availability.booked = false;
    return this.availabilityRepository.save(availability);
  }

  async getAllAvailabilities(): Promise<Availability[]> {
    return this.availabilityRepository.find();
  }

  async getAvailableAvailabilities(): Promise<Availability[]> {
    return this.availabilityRepository.find({ where: { booked: false } });
  }

  async bookAvailabilitySlot(id: number, reason: Reason, comment?: string): Promise<Availability> {
    const availability = await this.availabilityRepository.findOneBy({ id });
    if (!availability) {
      throw new Error('Availability not found');
    }
    availability.booked = true;
    availability.reason = reason;
    availability.comment = comment || null;
    const savedAvailability = await this.availabilityRepository.save(availability);

    const googleMeetLink = 'https://meet.google.com/your-meeting-id'; // Replace with actual Google Meet link
    const icsContent = this.mailService.generateIcsFile(
      availability.date,
      availability.startTime,
      availability.endTime,
      'Booking Confirmation',
      `Your appointment is booked for ${availability.date} from ${availability.startTime} to ${availability.endTime}. Reason: ${reason}. Comment: ${comment || 'N/A'}`,
      googleMeetLink,
    );

    // Send confirmation email to patient
    await this.mailService.sendMail(
      this.patientEmail,
      'Booking Confirmation',
      'booking-confirmation',
      {
        name: 'Patient',
        date: availability.date,
        startTime: availability.startTime,
        endTime: availability.endTime,
        reason: reason,
        comment: comment || 'N/A',
        link: googleMeetLink,
      },
      icsContent,
    );

    // Send notification email to doctor
    await this.mailService.sendMail(
      this.doctorEmail,
      'New Booking Notification',
      'new-booking-notification',
      {
        name: 'Doctor',
        date: availability.date,
        startTime: availability.startTime,
        endTime: availability.endTime,
        reason: reason,
        comment: comment || 'N/A',
        link: googleMeetLink,
      },
      icsContent,
    );

    return savedAvailability;
  }
}
