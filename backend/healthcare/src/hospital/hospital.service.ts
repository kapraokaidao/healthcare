import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { KeypairService } from "src/keypair/keypair.service";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { UserRole } from "../constant/enum/user.enum";
import { Hospital } from "../entities/hospital.entity";
import { User } from "../entities/user.entity";
import { UserService } from "../user/user.service";
import { Pagination, PaginationOptions, toPagination } from "../utils/pagination.util";
import { CreateHospitalDto } from "./hospital.dto";

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

  async searchHospitalAccount(
    userId: number,
    user: Partial<User>,
    pageOptions: PaginationOptions
  ): Promise<Pagination<User>> {
    const { hospital } = await this.userService.findById(userId, true);
    let query = this.userRepository
      .createQueryBuilder("u")
      .leftJoinAndSelect("u.hospital", "h")
      .take(pageOptions.pageSize)
      .skip((pageOptions.page - 1) * pageOptions.pageSize)
      .where("u.role = :role", { role: UserRole.Hospital })
      .andWhere("h.code9 = :code9", { code9: hospital.code9 });
    if (user.username) {
      query = query.andWhere("u.username like :username", {
        username: `%${user.username}%`,
      });
    }
    if (user.firstname) {
      query = query.andWhere("u.firstname like :firstname", {
        firstname: `%${user.firstname}%`,
      });
    }
    if (user.lastname) {
      query = query.andWhere("u.lastname like :lastname", {
        lastname: `%${user.lastname}%`,
      });
    }
    if (user.phone) {
      query = query.andWhere("u.phone like :phone", {
        phone: `%${user.phone}%`,
      });
    }
    if (user.address) {
      query = query.andWhere("u.address like :address", {
        address: `%${user.address}%`,
      });
    }
    const [users, totalCount] = await query.getManyAndCount();
    return toPagination<User>(users, totalCount, pageOptions);
  }

  async delete(adminUserId: number, userId: number): Promise<void> {
    const adminUser = await this.userService.findById(adminUserId, true);
    const user = await this.userService.findById(userId, true);
    if (user.role !== UserRole.Hospital) {
      throw new BadRequestException(`You can't delete ${user.role} role`);
    }
    if (user.hospital.code9 === adminUser.hospital.code9) {
      await this.userRepository.softDelete(userId);
    } else {
      throw new BadRequestException("Hospital code9 doesn't match with yours");
    }
  }

  @Transaction()
  async create(
    creatorId: number,
    dto: CreateHospitalDto,
    @TransactionManager() entityManager?: EntityManager
  ): Promise<User> {
    const { username, password, firstname, lastname, phone, address } = dto;
    const creator = await this.userService.findById(creatorId, true);
    const newUser = this.userRepository.create({
      username,
      password,
      firstname,
      lastname,
      phone,
      address,
      role: UserRole.Hospital,
    });
    const hospital = await this.hospitalRepository.findOne({
      code9: creator.hospital.code9,
    });
    if (!hospital) {
      throw new BadRequestException(`Invalid hospital's code9`);
    }
    const checkUser = await this.userService.findByUsername(username);
    if (checkUser) {
      throw new BadRequestException(`Username already exists`);
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
