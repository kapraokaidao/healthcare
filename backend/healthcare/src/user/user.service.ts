import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { UserRole } from "../constant/enum/user.enum";
import { Hospital } from "../entities/hospital.entity";
import { NHSO } from "../entities/nhso.entity";
import { Patient } from "../entities/patient.entity";
import { Pagination, PaginationOptions, toPagination } from "../utils/pagination.util";
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";
import { KYC, KycImageType, KycQueryType } from "./user.dto";
import { S3Service } from "../s3/s3.service";
import { ResetPasswordKYC } from "../entities/reset-password-kyc.entity";
import { PatientService } from "./patient.service";

@Injectable()
export class UserService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly patientService: PatientService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Hospital)
    private readonly hospitalRepository: Repository<Hospital>,
    @InjectRepository(NHSO)
    private readonly nhsoRepository: Repository<NHSO>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(ResetPasswordKYC)
    private readonly resetPasswordKycRepository: Repository<ResetPasswordKYC>
  ) {}

  async find(
    user: Partial<User>,
    pageOptions: PaginationOptions
  ): Promise<Pagination<User>> {
    const { role } = user;
    let query = this.userRepository
      .createQueryBuilder("u")
      .leftJoinAndSelect("u.nhso", "n")
      .leftJoinAndSelect("u.hospital", "h")
      .leftJoinAndSelect("u.patient", "p")
      .take(pageOptions.pageSize)
      .skip((pageOptions.page - 1) * pageOptions.pageSize);
    if (role) {
      query = query.andWhere("u.role = :role", { role });
    }
    const [users, totalCount] = await query.getManyAndCount();
    return toPagination<User>(users, totalCount, pageOptions);
  }

  async findById(id: number, relation = false): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail(id);
      if (relation) {
        switch (user.role) {
          case UserRole.NHSO:
            return this.userRepository.findOneOrFail(id, { relations: ["nhso"] });
          case UserRole.Hospital:
            return this.userRepository.findOneOrFail(id, { relations: ["hospital"] });
          case UserRole.Patient:
            return this.userRepository.findOneOrFail(id, { relations: ["patient"] });
        }
      }
      return user;
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException(`User's ID ${id} cannot be found`, e.name);
      } else {
        throw new InternalServerErrorException(e.message, e.name);
      }
    }
  }

  async findPasswordChangedDate(id: number): Promise<Date> {
    const query = this.userRepository
      .createQueryBuilder()
      .where("id = :id", { id })
      .addSelect("password_changed_date", "User_password_changed_date");
    const user = await query.getOne();
    return user.passwordChangedDate;
  }

  async findKyc(
    approved: boolean,
    ready: boolean,
    type: KycQueryType,
    pageOptions: PaginationOptions
  ): Promise<any> {
    const page = pageOptions.page;
    let pageSize = pageOptions.pageSize;
    switch (type) {
      case KycQueryType.All:
        pageSize = Math.ceil(pageSize / 2);
        const [registerKyc, registerKycCount] = await this.findRegisterKyc(
          approved,
          ready,
          { page, pageSize }
        );
        const [
          resetPasswordKyc,
          resetPasswordKycCount,
        ] = await this.findResetPasswordKyc(ready, { page, pageSize });
        const combinedKYCs = [...registerKyc, ...resetPasswordKyc];
        const totalCount = registerKycCount + resetPasswordKycCount;
        return toPagination<KYC>(combinedKYCs, totalCount, { page, pageSize });
      case KycQueryType.Register:
        const [onlyRegisterKyc, onlyRegisterKycCount] = await this.findRegisterKyc(
          approved,
          ready,
          pageOptions
        );
        return toPagination<KYC>(onlyRegisterKyc, onlyRegisterKycCount, {
          page,
          pageSize,
        });
      case KycQueryType.ResetPassword:
        const [
          onlyResetPasswordKyc,
          onlyResetPasswordKycCount,
        ] = await this.findResetPasswordKyc(ready, { page, pageSize });
        return toPagination<KYC>(onlyResetPasswordKyc, onlyResetPasswordKycCount, {
          page,
          pageSize,
        });
      default:
        throw new BadRequestException(`Invalid KYC type [${type}]`);
    }
  }

  async findRegisterKyc(
    approved: boolean,
    ready: boolean,
    pageOptions: PaginationOptions
  ): Promise<[KYC[], number]> {
    let query = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.patient", "patient")
      .where("user.role = :role", { role: UserRole.Patient })
      .take(pageOptions.pageSize)
      .skip((pageOptions.page - 1) * pageOptions.pageSize);
    if (ready) {
      query = query.andWhere("patient.nationalIdImage is not null");
      query = query.andWhere("patient.selfieImage is not null");
    }
    if (approved) {
      query = query.andWhere("patient.approved = :approved", { approved });
    }
    const [users, totalCount] = await query.getManyAndCount();
    const KYCs: KYC[] = users.map((user) => ({
      type: "RegisterKyc",
      id: user.id,
      user,
      nationalIdImage: user.patient.nationalIdImage,
      selfieImage: user.patient.selfieImage,
    }));
    return [KYCs, totalCount];
  }

  async findResetPasswordKyc(
    ready: boolean,
    pageOptions: PaginationOptions
  ): Promise<[KYC[], number]> {
    let query = this.resetPasswordKycRepository
      .createQueryBuilder("reset_password_kyc")
      .leftJoinAndSelect("reset_password_kyc.patient", "patient")
      .leftJoinAndSelect("patient.user", "user")
      .take(pageOptions.pageSize)
      .skip((pageOptions.page - 1) * pageOptions.pageSize);
    if (ready) {
      query = query.andWhere("reset_password_kyc.nationalIdImage is not null");
      query = query.andWhere("reset_password_kyc.selfieImage is not null");
    }
    const [resetPasswordKYCs, totalCount] = await query.getManyAndCount();
    const KYCs: KYC[] = resetPasswordKYCs.map((rp) => {
      const user = this.patientService.getUserObject(rp.patient);
      return {
        type: "ResetPasswordKyc",
        id: rp.id,
        nationalIdImage: rp.nationalIdImage,
        selfieImage: rp.selfieImage,
        user,
      };
    });
    return [KYCs, totalCount];
  }

  async approveKyc(id: number): Promise<void> {
    const user = await this.findById(id, true);
    if (user.patient.nationalIdImage === null || user.patient.selfieImage === null) {
      throw new BadRequestException("User has missing kyc image(s)");
    }
    user.patient.approved = true;
    await this.patientRepository.save(user.patient);
  }

  async rejectKyc(id: number): Promise<void> {
    const user = await this.findById(id, true);
    if (user.patient.nationalIdImage === null || user.patient.selfieImage === null) {
      throw new BadRequestException("User has missing kyc image(s)");
    }
    user.patient.approved = false;
    user.patient.selfieImage = null;
    user.patient.nationalIdImage = null;
    const selfiePath = `user_${id}/kyc/selfie.jpg`;
    const nationalIdPath = `user_${id}/kyc/national-id.jpg`;
    await this.s3Service.deleteImage(selfiePath);
    await this.s3Service.deleteImage(nationalIdPath);
    await this.patientRepository.save(user.patient);
  }

  async findByUsername(username: string, password?: boolean): Promise<User> {
    const query = this.userRepository.createQueryBuilder();
    query.where("username = :username", { username });
    if (password) {
      query.addSelect("password", "User_password");
    }
    return query.getOne();
  }

  @Transaction()
  async create(
    user: User,
    @TransactionManager() entityManager?: EntityManager
  ): Promise<User> {
    const newUser = this.userRepository.create(user);
    switch (user.role) {
      case UserRole.Hospital:
        const hospital = await this.hospitalRepository.findOne({
          code9: user.hospital.code9,
        });
        if (!hospital) {
          throw new BadRequestException(`Invalid hospital's code9`);
        }
        newUser.hospital = hospital;
        await entityManager.save(newUser);
        return newUser;

      case UserRole.NHSO:
        const nhso = await this.nhsoRepository.create(user.nhso);
        nhso.user = newUser;
        await entityManager.save(nhso);
        return newUser;

      case UserRole.Patient:
        let patient = await this.patientRepository.findOne({
          nationalId: user.patient.nationalId,
        });
        if (patient) {
          throw new BadRequestException("Duplicate Patient's National ID");
        }
        patient = this.patientRepository.create(user.patient);
        patient.user = newUser;
        await entityManager.save(patient);
        return newUser;

      default:
        throw new BadRequestException("Invalid user's role");
    }
  }

  async search(
    user: Partial<User>,
    pageOptions: PaginationOptions
  ): Promise<Pagination<User>> {
    let query = this.userRepository
      .createQueryBuilder("u")
      .leftJoinAndSelect("u.nhso", "n")
      .leftJoinAndSelect("u.hospital", "h")
      .leftJoinAndSelect("u.patient", "p")
      .take(pageOptions.pageSize)
      .skip((pageOptions.page - 1) * pageOptions.pageSize);
    if (user.role) {
      query = query.andWhere("u.role = :role", { role: user.role });
    }
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
    if (user.patient) {
      if (user.patient.nationalId) {
        query = query.andWhere("p.nationalId like :nationalId", {
          nationalId: `%${user.patient.nationalId}%`,
        });
      }
      if (user.patient.nationalId) {
        query = query.andWhere("p.nationalId like :nationalId", {
          nationalId: `%${user.patient.nationalId}%`,
        });
      }
      if (user.patient.nationalId) {
        query = query.andWhere("p.nationalId like :nationalId", {
          nationalId: `%${user.patient.nationalId}%`,
        });
      }
    }
    if (user.hospital) {
      if (user.hospital.hid) {
        query = query.andWhere("h.hid like :hid", {
          hid: `%${user.hospital.hid}%`,
        });
      }
    }
    const [users, totalCount] = await query.getManyAndCount();
    return toPagination<User>(users, totalCount, pageOptions);
  }

  async updateImage(
    userId: number,
    imageUrl: string,
    imageType: KycImageType
  ): Promise<void> {
    const user = await this.userRepository.findOne(userId, { relations: ["patient"] });
    user.patient[imageType] = imageUrl;
    await this.patientRepository.save(user.patient);
  }

  async findSoftDeletedUsers(): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder("u")
      .where("u.deletedDate is not null")
      .withDeleted()
      .getMany();
  }

  async hardDelete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async softDelete(id: number): Promise<void> {
    await this.userRepository.softDelete(id);
  }

  async restore(id: number): Promise<void> {
    await this.userRepository.restore(id);
  }
}
