import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Hospital {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  @ApiProperty()
  hid: number;

  @ApiProperty()
  @Column()
  name: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
