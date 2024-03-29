import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { hashSync } from "bcryptjs";
import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../constant/enum/user.enum";
import { NHSO } from "./nhso.entity";
import { Hospital } from "./hospital.entity";
import { Patient } from "./patient.entity";
import { Keypair } from "./keypair.entity";
import { UserToken } from "./user-token.entity";
import { Transaction } from "./transaction.entity";
import { Agency } from "./agency.entity";
import { IsEnum, IsString, Length } from "class-validator";
import { Trim } from "class-sanitizer";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Trim()
  @IsString()
  @ApiProperty({ required: true })
  @Column({ unique: true, nullable: false })
  username: string;

  @Trim()
  @IsString()
  @ApiProperty({ required: true })
  @Column({ select: false })
  password: string;

  @Trim()
  @IsString()
  @ApiProperty({ required: true })
  @Column()
  firstname: string;

  @Trim()
  @IsString()
  @ApiProperty({ required: true })
  @Column()
  lastname: string;

  @IsEnum(UserRole)
  @ApiProperty({ enum: UserRole, required: true, default: "" })
  @Column({ type: "enum", enum: UserRole, update: false })
  role: UserRole;

  @ApiProperty({ required: true })
  @Column()
  phone: string;

  @IsString()
  @Length(0, 150)
  @ApiProperty()
  @Column()
  address: string;

  @ApiProperty()
  @OneToOne(() => NHSO, (nhso) => nhso.user, {
    cascade: ["insert", "update", "soft-remove"],
  })
  nhso: NHSO;

  @ApiProperty()
  @OneToOne(() => Agency, (agency) => agency.user, {
    cascade: ["insert", "update", "soft-remove"],
  })
  agency: Agency;

  @ApiProperty()
  @ManyToOne(() => Hospital, (hospital) => hospital.users)
  @JoinColumn({ name: "hospital_code9" })
  hospital: Hospital;

  @ApiProperty()
  @OneToOne(() => Patient, (patient) => patient.user, {
    cascade: ["insert", "update", "soft-remove"],
  })
  patient: Patient;

  @ManyToMany(() => Keypair, (keyPair) => keyPair.users)
  keypairs: Keypair[];

  @OneToMany(() => UserToken, (UserToken) => UserToken.user)
  userTokens: UserToken[];

  @OneToMany(() => Transaction, (transaction) => transaction.sourceUser)
  sourceUserTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.destinationUser)
  destinationUserTransactions: Transaction[];

  @CreateDateColumn({ update: false, name: "created_date" })
  createdDate!: Date;

  @UpdateDateColumn({ name: "updated_date" })
  updatedDate!: Date;

  @DeleteDateColumn({ name: "deleted_date" })
  deletedDate!: Date;

  @Column({
    name: "password_changed_date",
    type: "datetime",
    precision: 6,
    nullable: false,
    select: false,
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  passwordChangedDate: Date;

  @BeforeInsert()
  @BeforeUpdate()
  private hashPasswordAndStampTime() {
    if (this.password && this.password.slice(0, 7) !== "$2a$10$") {
      this.password = hashSync(this.password);
      this.passwordChangedDate = new Date();
    }
  }
}
