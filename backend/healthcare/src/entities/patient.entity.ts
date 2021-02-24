import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { UserGender } from "../constant/enum/user.enum";
import { ApiProperty } from "@nestjs/swagger";
import { ResetPasswordKYC } from "./reset-password-kyc.entity";
import { Fetus } from "./fetus.entity";
import { BloodRh, BloodType } from "../constant/enum/patient.enum";

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: "national_id" })
  nationalId: string;

  @ApiProperty({ enum: UserGender })
  @Column({ type: "enum", enum: UserGender, update: false })
  gender: UserGender;

  @ApiProperty()
  @Column("date", { name: "birth_date" })
  birthDate: Date;

  @Column("decimal", { unsigned: true, precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column("decimal", { unsigned: true, precision: 5, scale: 2, nullable: true })
  height: number;

  @Column("enum", { enum: BloodType, nullable: true })
  bloodType: BloodType;

  @Column("int", { unsigned: true, nullable: true })
  systolic: number;

  @Column("int", { unsigned: true, nullable: true })
  diastolic: number;

  @Column("int", { name: 'hearth_rate', unsigned: true, nullable: true })
  hearthRate: number;

  @Column("decimal", { unsigned: true, precision: 5, scale: 2, nullable: true })
  temperature: number;
  
  @Column("decimal", {name: 'pregnant_bmi', unsigned: true, precision: 5, scale: 2, nullable: true })
  pregnantBMI: number;

  @Column("enum", { enum: BloodRh, nullable: true })
  bloodRh: BloodRh;

  @Column({ length: 500, nullable: true })
  allergies: string;

  @Column({ length: 500, nullable: true })
  medications: string;

  @Column("boolean")
  approved: boolean;

  @Column("boolean", { name: "required_recovery", default: false })
  requiredRecovery: boolean;

  @Column({ name: "national_id_image", nullable: true, default: null })
  nationalIdImage: string;

  @Column({ name: "selfie_image", nullable: true, default: null })
  selfieImage: string;

  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => ResetPasswordKYC, (resetPasswordKYC) => resetPasswordKYC.patient)
  resetPasswordKYCs: ResetPasswordKYC[];

  @OneToMany(() => Fetus, (fetus) => fetus.patient)
  fetuses: Fetus[];

  @CreateDateColumn({ update: false, name: "created_date" })
  createdDate!: Date;

  @UpdateDateColumn({ name: "updated_date" })
  updatedDate!: Date;

  @DeleteDateColumn({ name: "deleted_date" })
  deletedDate!: Date;
}
