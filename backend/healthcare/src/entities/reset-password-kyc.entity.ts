import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import { Patient } from "./patient.entity";
import { hashSync } from "bcryptjs";

@Entity({ name: "reset_password_kyc" })
export class ResetPasswordKYC extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nationalIdImage: string;

  @Column()
  selfieImage: string;

  @Column()
  newPassword: string;

  @ManyToOne(
    () => Patient,
    (patient) => patient.resetPasswordKYCs,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "patient_id" })
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
    if (this.newPassword && this.newPassword.slice(0, 7) !== "$2a$10$") {
      this.newPassword = hashSync(this.newPassword);
    }
  }
}
