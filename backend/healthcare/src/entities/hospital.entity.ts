import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Hospital {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column('int')
  hospitalId: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
