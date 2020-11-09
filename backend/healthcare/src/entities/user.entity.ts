import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { hashSync } from 'bcryptjs';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../constant/enum/user.enum';
import { NHSO } from './nhso.entity';
import { Hospital } from './hospital.entity';
import { Patient } from './patient.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  username: string;

  @ApiProperty()
  @Column({ select: false })
  password: string;

  @Column()
  firstname: string;

  @Column()
  surname: string;

  @Column({ type: 'enum', enum: UserRole, update: false })
  role: UserRole;

  @Column()
  phone: string;

  @OneToOne(() => NHSO)
  nhso: NHSO;

  @OneToOne(() => Hospital)
  hospital: Hospital;

  @OneToOne(() => Patient)
  patient: Patient;

  @CreateDateColumn({ readonly: true })
  createdAt!: Date;

  @UpdateDateColumn({ readonly: true })
  updatedAt!: Date;

  @DeleteDateColumn({ readonly: true })
  deletedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  private hashPassword() {
    if (this.password) {
      this.password = hashSync(this.password);
    }
  }
}
