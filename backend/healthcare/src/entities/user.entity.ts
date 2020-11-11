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

  @ApiProperty({ required: true })
  @Column()
  username: string;

  @ApiProperty({ required: true })
  @Column({ select: false })
  password: string;

  @ApiProperty({ required: true })
  @Column()
  firstname: string;

  @ApiProperty({ required: true })
  @Column()
  surname: string;

  @ApiProperty({ enum: UserRole, required: true, default: '' })
  @Column({ type: 'enum', enum: UserRole, update: false })
  role: UserRole;

  @ApiProperty({ required: true })
  @Column()
  phone: string;

  @ApiProperty()
  @OneToOne(() => NHSO, { onDelete: "CASCADE" })
  nhso: NHSO;

  @ApiProperty()
  @OneToOne(() => Hospital,  { onDelete: "CASCADE" })
  hospital: Hospital;

  @ApiProperty()
  @OneToOne(() => Patient, { onDelete: "CASCADE" })
  patient: Patient;

  @CreateDateColumn({ readonly: true, name: 'created_date' })
  createdDate!: Date;

  @UpdateDateColumn({ readonly: true, name: 'updated_date' })
  updatedDate!: Date;

  @DeleteDateColumn({ readonly: true, name: 'deleted_date' })
  deletedDate!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  private hashPassword() {
    if (this.password) {
      this.password = hashSync(this.password);
    }
  }
}
