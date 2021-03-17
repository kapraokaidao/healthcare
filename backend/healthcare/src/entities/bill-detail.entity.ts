import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BillDetailLine } from "./bill-detail-line.entity";
import { Bill } from "./bill.entity";
import { HealthcareToken } from "./healthcare-token.entity";
import { Transaction } from "./transaction.entity";

@Entity()
export class BillDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @OneToMany(() => BillDetailLine, (billDetailLine) => billDetailLine.billDetail, { cascade: true })
  billDetailLines: BillDetailLine[];

  @ManyToOne(() => Bill, (bill) => bill.billDetails, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "bill_id" })
  bill: Bill;

  @ManyToOne(() => HealthcareToken, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "healthcare_token_id" })
  healthcareToken: HealthcareToken;

  @CreateDateColumn({ update: false, name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ name: "updated_date" })
  updatedDate: Date;

  @DeleteDateColumn({ name: "deleted_date" })
  deletedDate: Date;
}
