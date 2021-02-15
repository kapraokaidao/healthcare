import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

@Entity()
export class Keypair {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: "public_key" })
  publicKey: string;

  @ApiProperty()
  @Column({ name: "encrypted_private_key" })
  encryptedPrivateKey: string;

  @ApiProperty()
  @Column({ name: "account_merge_xdr" })
  accountMergeXdr: string;

  @ApiProperty()
  @Column("boolean", { name: "is_active", default: true })
  isActive: boolean;

  @ApiProperty()
  @Column({ name: "hash_pin" })
  hashPin: string;

  @ManyToMany(() => User, (user) => user.keypairs, { onDelete: "CASCADE" })
  @JoinTable({name: "user_keypair"})
  users: User[];

  @OneToOne(() => User)
  @JoinColumn({ name: "agency_id" })
  agency: User;
}
