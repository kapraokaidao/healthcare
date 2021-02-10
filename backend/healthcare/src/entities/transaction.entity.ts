import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../entities/user.entity";
import { HealthcareToken } from "./healthcare-token.entity";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  amount: number;

  @ApiProperty()
  @Column({ name: "source_public_key" })
  sourcePublicKey: string;

  @ApiProperty()
  @Column({ name: "destination_public_key" })
  destinationPublicKey: string;

  @ManyToOne(() => HealthcareToken, (healthcareToken) => healthcareToken.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "healthcare_token_id" })
  healthcareToken: HealthcareToken;

  @ManyToOne(() => User, (user) => user.sourceUserTransactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "source_user_id" })
  sourceUser: User;

  @ManyToOne(() => User, (user) => user.destinationUserTransactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "destination_user_id" })
  destinationUser: User;

  @CreateDateColumn({ update: false, name: "created_date" })
  createdDate!: Date;
}
