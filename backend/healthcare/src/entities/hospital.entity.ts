import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Hospital {
  @ApiProperty()
  @PrimaryColumn({ length: 9 })
  code9: string;

  @Column({ length: 255 })
  fullname: string;

  @Column({ name: "unitcode", length: 5 })
  unitCode: string;

  @Column({ length: 255 })
  unit: string;

  @Column({ name: "typecode", type: "char", length: 2 })
  typeCode: string;

  @Column({ length: 255 })
  type: string;

  @Column({ length: 10 })
  bed: string;

  @Column({ name: "code_province", type: "char", length: 2 })
  codeProvince: string;

  @Column({ length: 50 })
  province: string;

  @Column({ name: "code_amphur", type: "char", length: 2 })
  codeAmphur: string;

  @Column({ length: 50 })
  amphur: string;

  @Column({ name: "code_tambon", type: "char", length: 2 })
  codeTambon: string;

  @Column({ length: 50 })
  tambon: string;

  @Column({ name: "code_moo", type: "char", length: 2 })
  codeMoo: string;

  @Column({ length: 50 })
  moo: string;

  @Column({ type: "char", length: 2 })
  status: string;

  @Column({ name: "servicestatus", length: 50 })
  serviceStatus: string;

  @Column({ length: 255 })
  address: string;

  @Column({ length: 30 })
  zipcode: string;

  @Column({ length: 50 })
  telephone: string;

  @Column({ length: 25 })
  fax: string;

  @Column({ name: "servicelevelcode", type: "char", length: 2 })
  serviceLevelCode: string;

  @Column({ name: "servicelevel", length: 25 })
  serviceLevel: string;

  @Column({ name: "servicetypecode", type: "char", length: 2 })
  serviceTypeCode: string;

  @Column({ name: "servicetype", length: 25 })
  serviceType: string;

  @Column({ name: "changedcode", length: 300 })
  changedCode: string;

  @Column({ name: "changedname", length: 10 })
  changedName: string;

  @Column({ name: "remark", length: 300 })
  remark: string;

  @Column({ name: "defineddate", length: 10 })
  definedDate: string;

  @Column({ name: "cancledate", length: 10 })
  cancelDate: string;

  @Column({ name: "opendate", length: 10 })
  openDate: string;

  @Column({ name: "closeddate", length: 10 })
  closedDate: string;

  @Column({ name: "updateddate", length: 10 })
  updatedDate: string;

  @Column({ name: "hospitalcode", type: "char", length: 5 })
  hospitalCode: string;

  @Column({ name: "areacode", type: "char", length: 8 })
  areaCode: string;

  @Column({ length: 255 })
  hospital: string;

  @Column({ name: "start_date", type: "datetime", nullable: false })
  startDate: Date;

  @Column({ name: "end_date", type: "datetime" })
  endDate: Date;

  // these attrs just for hot-fix some error
  // must be removed later
  hid: number;
  name: string;
  user: User;

  @OneToMany(() => User, (user) => user.hospital)
  users: User[];
}
