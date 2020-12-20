import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Hospital } from "../entities/hospital.entity";
import { Repository } from "typeorm";
import { Pagination, PaginationOptions } from "../utils/pagination.util";

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(Hospital)
    private readonly hospitalRepository: Repository<Hospital>
  ) {}

  async search(
    hospital: Partial<Hospital>,
    pageOptions: PaginationOptions
  ): Promise<Pagination<Hospital>> {
    let query = this.hospitalRepository
      .createQueryBuilder("hospital")
      .take(pageOptions.pageSize)
      .skip((pageOptions.page - 1) * pageOptions.pageSize);
    if (hospital.code9) {
      query = query.andWhere("hospital.code9 = :code9", { code9: hospital.code9 });
    }
    if (hospital.fullname) {
      query = query.andWhere("hospital.fullname like :fullname", {
        fullname: `%${hospital.fullname}%`,
      });
    }
    if (hospital.hospital) {
      query = query.andWhere("hospital.hospital = :hospital", {
        hospital: `%${hospital.hospital}%`,
      });
    }
    const [hospitals, totalCount] = await query.getManyAndCount();
    const pageCount = Math.ceil(totalCount / pageOptions.pageSize);
    return {
      data: hospitals,
      itemCount: hospitals.length,
      page: pageOptions.page,
      pageSize: pageOptions.pageSize,
      totalCount,
      pageCount,
    };
  }
}
