import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../entities/user.entity";
import { HealthcareToken } from "./healthcare-token.entity";

@Entity()
export class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  balance: number;

  @ManyToOne(() => HealthcareToken, (healthcareToken) => healthcareToken.userTokens)
  @JoinColumn({ name: "healthcare_token_id" })
  healthcareToken: HealthcareToken;

  @ManyToOne(() => User, (user) => user.userTokens)
  @JoinColumn({ name: "user_id" })
  user: User;
}
