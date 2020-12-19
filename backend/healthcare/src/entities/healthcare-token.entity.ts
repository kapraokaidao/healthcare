import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { UserGender } from "../constant/enum/user.enum";
import { TokenType } from "../constant/enum/token.enum";

@Entity()
export class HealthcareToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ name: "token_type", type: "enum", enum: TokenType })
  token_type: TokenType;

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
  @Column("date", { name: "start_birthdate", nullable: true, default: null })
  startBirthdate: Date;

  @ApiProperty()
  @Column("date", { name: "end_birthdate", nullable: true, default: null })
  endBirthdate: Date;

  @ApiProperty()
  @Column({ type: "enum", enum: UserGender, nullable: true })
  gender: UserGender;

  @ApiProperty()
  @Column("int", { name: "token_per_person" })
  tokenPerPerson: number;

  @CreateDateColumn({ update: false, name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ name: "updated_date" })
  updatedDate: Date;

  @DeleteDateColumn({ name: "deleted_date" })
  deletedDate: Date;
}
