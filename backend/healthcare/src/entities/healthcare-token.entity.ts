import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class HealthcareToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  assetName: string;

  @ApiProperty()
  @Column("boolean")
  isActive: boolean;

  @ApiProperty()
  @Column("int")
  quantity: number;

  @ApiProperty()
  @Column()
  issuingPublicKey: string;

  @ApiProperty()
  @Column()
  receivingPublicKey: string;

  @CreateDateColumn({ update: false, name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ name: "updated_date" })
  updatedDate: Date;

  @DeleteDateColumn({ name: "deleted_date" })
  deletedDate: Date;
}
