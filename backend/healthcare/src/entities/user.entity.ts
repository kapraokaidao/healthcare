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
} from "typeorm";
import { hashSync } from "bcryptjs";
import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../constant/enum/user.enum";
import { NHSO } from "./nhso.entity";
import { Hospital } from "./hospital.entity";
import { Patient } from "./patient.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ required: true })
  @Column()
  username: string;

  @ApiProperty({ required: true })
  @Column({ select: false })
  password: string;

  @ApiProperty({ required: true })
  @Column()
  firstname: string;

  @ApiProperty({ required: true })
  @Column()
  lastname: string;

  @ApiProperty({ enum: UserRole, required: true, default: "" })
  @Column({ type: "enum", enum: UserRole, update: false })
  role: UserRole;

  @ApiProperty({ required: true })
  @Column()
  phone: string;

  @ApiProperty()
  @Column()
  address: string;

  @ApiProperty()
  @OneToOne(() => NHSO, (nhso) => nhso.user)
  nhso: NHSO;

  @ApiProperty()
  @ManyToOne(() => Hospital, (hospital) => hospital.users)
  @JoinColumn({ name: "hospital_code9" })
  hospital: Hospital;

  @ApiProperty()
  @OneToOne(() => Patient, (patient) => patient.user)
  patient: Patient;

  @CreateDateColumn({ update: false, name: "created_date" })
  createdDate!: Date;

  @UpdateDateColumn({ name: "updated_date" })
  updatedDate!: Date;

  @DeleteDateColumn({ name: "deleted_date" })
  deletedDate!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  private hashPassword() {
    if (this.password && this.password.slice(0, 7) !== "$2a$10$") {
      this.password = hashSync(this.password);
    }
  }
}
