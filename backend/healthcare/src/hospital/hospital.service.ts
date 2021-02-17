import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Hospital } from "../entities/hospital.entity";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { Pagination, PaginationOptions, toPagination } from "../utils/pagination.util";
import { User } from "../entities/user.entity";
import { UserRole } from "../constant/enum/user.enum";
import { CreateHospitalDto } from "./hospital.dto";
import { UserService } from "../user/user.service";
import { KeypairService } from "src/keypair/keypair.service";

@Injectable()
export class HospitalService {
  constructor(
    private readonly userService: UserService,
    private readonly keypairService: KeypairService,
    @InjectRepository(Hospital)
    private readonly hospitalRepository: Repository<Hospital>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
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
    return toPagination<Hospital>(hospitals, totalCount, pageOptions);
  }

  @Transaction()
  async create(
    creatorId: number,
    dto: CreateHospitalDto,
    @TransactionManager() entityManager?: EntityManager
  ): Promise<User> {
    const { username, password, firstname, lastname, phone, address, isAdmin } = dto;
    const creator = await this.userService.findById(creatorId, true);
    const newUser = this.userRepository.create({
      username,
      password,
      firstname,
      lastname,
      phone,
      address,
      role: isAdmin ? UserRole.HospitalAdmin : UserRole.Hospital,
    });
    const hospital = await this.hospitalRepository.findOne({
      code9: creator.hospital.code9,
    });
    if (!hospital) {
      throw new BadRequestException(`Invalid hospital's code9`);
    }
    const keypair = await this.keypairService.findActiveKeypair(creatorId);
    if (!keypair) {
      throw new BadRequestException("Creator have to create keypair first");
    }
    newUser.hospital = hospital;
    newUser.keypairs = [keypair];
    await entityManager.save(newUser);
    return newUser;
  }
}
