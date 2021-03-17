import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  ManyToMany,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../entities/user.entity";
import { HealthcareToken } from "./healthcare-token.entity";
import { TxType } from "src/constant/enum/transaction.enum";
import { IsEnum } from "class-validator";
import { BillDetail } from "./bill-detail.entity";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  amount: number;

  @Column()
  outstanding: number;

  @ApiProperty()
  @Column({ name: "source_public_key" })
  sourcePublicKey: string;

  @ApiProperty()
  @Column({ name: "destination_public_key" })
  destinationPublicKey: string;

  @IsEnum(TxType)
  @ApiProperty({ enum: TxType, required: true })
  @Column({ name: "type", type: "enum", enum: TxType })
  type: TxType;

  @ManyToOne(() => HealthcareToken, (healthcareToken) => healthcareToken.transactions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "healthcare_token_id" })
  healthcareToken: HealthcareToken;

  @ManyToOne(() => User, (user) => user.sourceUserTransactions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "source_user_id" })
  sourceUser: User;

  @ManyToOne(() => User, (user) => user.destinationUserTransactions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "destination_user_id" })
  destinationUser: User;


  @CreateDateColumn({ update: false, name: "created_date" })
  createdDate!: Date;
}
