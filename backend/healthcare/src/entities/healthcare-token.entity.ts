import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { UserGender } from "../constant/enum/user.enum";
import { TokenType } from "../constant/enum/token.enum";
import { UserToken } from "./user-token.entity";
import { Transaction } from "./transaction.entity";
import { User } from "./user.entity";
import { Member } from "./member.entity";

@Entity()
export class HealthcareToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true, name: "asset_code" })
  assetCode: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ name: "token_type", type: "enum", enum: TokenType })
  tokenType: TokenType;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ApiProperty()
  @Column("int", { name: "total_token" })
  totalToken: number;

  @ApiProperty()
  @Column("int", { name: "remaining_token" })
  remainingToken: number;

  @ApiProperty()
  @Column("boolean", { name: "is_active", default: true })
  isActive: boolean;

  @ApiProperty()
  @Column({ name: "issuing_public_key" })
  issuingPublicKey: string;

  @ApiProperty()
  @Column({ name: "receiving_public_key" })
  receivingPublicKey: string;

  @ApiProperty()
  @Column("date", { name: "start_date", nullable: true, default: null })
  startDate: Date;

  @ApiProperty()
  @Column("date", { name: "end_date", nullable: true, default: null })
  endDate: Date;

  @ApiProperty()
  @Column({ name: "start_age", nullable: true, default: null })
  startAge: number;

  @ApiProperty()
  @Column({ name: "end_age", nullable: true, default: null })
  endAge: number;

  @ApiProperty()
  @Column({ type: "enum", enum: UserGender, nullable: true })
  gender: UserGender;

  @ApiProperty()
  @Column("int", { name: "token_per_person" })
  tokenPerPerson: number;

  @ApiProperty()
  @OneToMany(() => UserToken, (userToken) => userToken.healthcareToken)
  userTokens: UserToken[];

  @ApiProperty()
  @OneToMany(() => Transaction, (transaction) => transaction.healthcareToken)
  transactions: Transaction[];

  @ApiProperty()
  @OneToMany(() => Member, (member) => member.healthcareToken)
  members: Member[];

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  createdBy: User;

  @CreateDateColumn({ update: false, name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ name: "updated_date" })
  updatedDate: Date;

  @DeleteDateColumn({ name: "deleted_date" })
  deletedDate: Date;
}
