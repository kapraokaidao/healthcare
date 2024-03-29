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
export class TransferRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: TransferRequestType })
  type: TransferRequestType;

  @Column()
  amount: number;

  @Column({ name: "is_confirmed", default: false })
  isConfirmed: boolean;

  @Column({ name: "expired_date" })
  expiredDate: Date;

  @ManyToOne(() => HealthcareToken, { onDelete: "CASCADE" })
  @JoinColumn({ name: "healthcare_token_id" })
  healthcareToken: HealthcareToken;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "patient_id" })
  patient: User;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "hospital_id" })
  hospital: User;

  @DeleteDateColumn({ name: "deleted_date" })
  deletedDate!: Date;
}
