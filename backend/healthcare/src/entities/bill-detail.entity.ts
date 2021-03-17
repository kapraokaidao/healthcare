import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Bill } from "./bill.entity";
import { HealthcareToken } from "./healthcare-token.entity";
import { Transaction } from "./transaction.entity";

@Entity()
export class BillDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @ManyToOne(() => Bill, (bill) => bill.billDetails, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "bill_id" })
  bill: Bill;

  @ManyToOne(() => HealthcareToken, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "healtcare_token_id" })
  healthcareToken: HealthcareToken;

  @ManyToMany(() => Transaction, (transaction) => transaction.billDetails, { onDelete: "CASCADE" })
  @JoinTable({
    name: "transaction_bill_detail",
    joinColumn: {
      name: "bill_detail_id",
    },
    inverseJoinColumn: {
      name: "transaction_id",
    },
  })
  transactions: Transaction[];

  @CreateDateColumn({ update: false, name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ name: "updated_date" })
  updatedDate: Date;

  @DeleteDateColumn({ name: "deleted_date" })
  deletedDate: Date;

}
