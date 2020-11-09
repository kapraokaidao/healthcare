import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { UserGender } from '../constant/enum/user.enum';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nationalId: string;

  @Column({ type: 'enum', enum: UserGender, update: false })
  gander: UserGender;

  @Column('date')
  birthDate: Date;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
