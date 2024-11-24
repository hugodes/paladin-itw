import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const now = new Date();
    if (date < now || (date.toDateString() === now.toDateString() && startTime < now.toTimeString().slice(0, 5))) {
      console.log('You cannot book in the past');
      throw new HttpException("Vous ne pouvez pas réserver dans le passé", HttpStatus.BAD_REQUEST);
    }

    const start = new Date(`${date.toISOString().split('T')[0]}T${startTime}:00`);
    const end = new Date(`${date.toISOString().split('T')[0]}T${endTime}:00`);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60); // duration in minutes

    if (duration < 15) {
      console.log('The availability slot must be at least 15 minutes long');
      throw new HttpException("La plage horaire doit durer au moins 15 minutes", HttpStatus.BAD_REQUEST);
    }

    const overlappingAvailabilities = await this.availabilityRepository
      .createQueryBuilder("availability")
      .where("availability.date = :date", { date })
      .andWhere("availability.startTime < :endTime AND availability.endTime > :startTime", { startTime, endTime })
      .getCount();

    if (overlappingAvailabilities > 0) {
      console.log('There is already a booking for this period');
      throw new HttpException("Il y a déjà une réservation pour cette période", HttpStatus.CONFLICT);
    }

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
    if (!reason) {
      throw new Error("La raison est obligatoire");
    }

    const availability = await this.availabilityRepository.findOneBy({ id });
    if (!availability) {
      throw new Error('Availability not found');
    }
    availability.booked = true;
    availability.reason = reason;
    availability.comment = comment || null;
    const savedAvailability = await this.availabilityRepository.save(availability);

    const googleMeetLink = 'https://meet.google.com/cnc-jaog-fwy'; // Replace with actual Google Meet link
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
      '📆 Confirmation de votre RDV Paladin',
      'booking-confirmation',
      {
        name: 'Employé.e',
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
      '🔔 Nouvelle prise de RDV',
      'new-booking-notification',
      {
        name: 'Médecin',
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
