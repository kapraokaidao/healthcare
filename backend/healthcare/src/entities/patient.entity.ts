import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { UserGender } from "../constant/enum/user.enum";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: "national_id" })
  nationalId: string;

  @ApiProperty({ enum: UserGender })
  @Column({ type: "enum", enum: UserGender, update: false })
  gender: UserGender;

  @ApiProperty()
  @Column("date", { name: "birth_date" })
  birthDate: Date;

  @Column("boolean")
  approved: boolean;

  @Column({ name: "national_id_image", nullable: true, default: null })
  nationalIdImage: string;

  @Column({ name: "selfie_image", nullable: true, default: null })
  selfieImage: string;

  @OneToOne(() => User, { onDelete: "CASCADE", cascade: true })
  @JoinColumn({ name: "user_id" })
  user: User;
}
