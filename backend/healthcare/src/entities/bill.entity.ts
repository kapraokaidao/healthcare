import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BillDetail } from "./bill-detail.entity";
import { Hospital } from "./hospital.entity";

@Entity()
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => BillDetail, (billDetail) => billDetail.bill)
  billDetails: BillDetail[];

  @ManyToOne(() => Hospital, { onDelete: "CASCADE" })
  @JoinColumn({ name: "hospital_id" })
  hospital: Hospital;

  @CreateDateColumn({ update: false, name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ name: "updated_date" })
  updatedDate: Date;

  @DeleteDateColumn({ name: "deleted_date" })
  deletedDate: Date;
}
