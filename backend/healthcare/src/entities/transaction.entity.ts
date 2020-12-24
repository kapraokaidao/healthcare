import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../entities/user.entity";
import { HealthcareToken } from "./healthcare-token.entity";
import { TransactionStatus } from "src/constant/enum/token.enum";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  amount: number;

  @ApiProperty()
  @Column({name: "source_public_key"})
  sourcePublicKey: string;

  @ApiProperty()
  @Column({name: "destination_public_key"})
  destinationPublicKey: string;

  @ApiProperty({ enum: TransactionStatus, required: false, default: TransactionStatus.Completed })
  @Column({type: "enum", enum: TransactionStatus, name: "destination_public_key", default: TransactionStatus.Completed})
  status: TransactionStatus;

  @ManyToOne(() => HealthcareToken, (healthcareToken) => healthcareToken.id, {
    cascade: true,
  })
  @JoinColumn({ name: "healthcare_token_id" })
  healthcareToken: HealthcareToken;

  @ManyToOne(() => User, (user) => user.keypairs, { cascade: true })
  @JoinColumn({ name: "source_user_id" })
  sourceUser: User;

  @ManyToOne(() => User, (user) => user.keypairs, { cascade: true })
  @JoinColumn({ name: "destination_user_id" })
  destinationUser: User;
}
