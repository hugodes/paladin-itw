
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Reason {
  PREMIERE_CONSULTATION = 'premiere_consultation',
  CONSULTATION_DE_SUIVI = 'consultation_de_suivi',
  CONSULTATION_AUTRE = 'consultation_autre',
}

@Entity()
export class Availability {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({ default: false })
  booked: boolean;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  reason: Reason | null;

  @Column({ nullable: true })
  comment: string;
}