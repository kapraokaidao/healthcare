import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Hospital {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  @ApiProperty()
  hid: number;

  @ApiProperty()
  @Column()
  name: string;

  @OneToOne(() => User, { onDelete: "CASCADE", cascade: true })
  @JoinColumn({ name: "user_id" })
  user: User;
}
