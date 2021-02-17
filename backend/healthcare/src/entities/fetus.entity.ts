import {
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
import { Patient } from "./patient.entity";
import { User } from "./user.entity";

@Entity()
export class Fetus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  weight: number;

  @Column()
  amount: number;

  @ManyToOne(() => Patient, (patient) => patient.fetuses, { onDelete: "CASCADE" })
  patient: Patient;

  @CreateDateColumn({ update: false, name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ name: "updated_date" })
  updatedDate: Date;

  @DeleteDateColumn({ name: "deleted_date" })
  deletedDate: Date;
}
