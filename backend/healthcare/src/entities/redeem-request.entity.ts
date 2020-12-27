import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { User } from "../entities/user.entity";
import { HealthcareToken } from "./healthcare-token.entity";

@Entity()
export class RedeemRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({ name: "is_confirmed", default: false })
  isConfirmed: boolean;

  @Column({ name: "expired_date" })
  expiredDate: Date;

  @ManyToOne(() => HealthcareToken)
  @JoinColumn({ name: "healthcare_token_id" })
  healthcareToken: HealthcareToken;

  @ManyToOne(() => User)
  @JoinColumn({ name: "patient_id" })
  patient: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "hospital_id" })
  hospital: User;
}
