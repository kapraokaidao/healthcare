import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Agency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => User, (user) => user.agency, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;
}
