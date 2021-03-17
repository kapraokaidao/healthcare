
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { BillDetail } from "./bill-detail.entity";
import { User } from "./user.entity";
  
  @Entity()
  export class BillDetailLine {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount: number;

    @Column({name: "effective_date"})
    effectiveDate: Date;

    @ManyToOne(() => BillDetail, { onDelete: "CASCADE" })
    @JoinColumn({ name: "bill_detail_id" })
    billDetail: BillDetail;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;

  
    @CreateDateColumn({ update: false, name: "created_date" })
    createdDate: Date;
  
    @UpdateDateColumn({ name: "updated_date" })
    updatedDate: Date;
  
    @DeleteDateColumn({ name: "deleted_date" })
    deletedDate: Date;
  }
  