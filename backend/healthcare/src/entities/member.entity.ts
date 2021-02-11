import { TransferRequestType } from "src/constant/enum/token.enum";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from "typeorm";
import { User } from "../entities/user.entity";
import { HealthcareToken } from "./healthcare-token.entity";

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "notified_url" })
  notifiedUrl: string;

  @Column({ default: false })
  transferred: boolean;

  @ManyToOne(() => HealthcareToken, (healthcareToken) => healthcareToken.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "healthcare_token_id" })
  healthcareToken: HealthcareToken;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "patient_id" })
  patient: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "agency_id" })
  agency: User;

  @DeleteDateColumn({ name: "deleted_date" })
  deletedDate!: Date;
}
