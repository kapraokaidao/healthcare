import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import {
  Brackets,
  EntityManager,
  Repository,
  Transaction,
  TransactionManager,
} from "typeorm";
import { UserRole } from "../constant/enum/user.enum";
import { Hospital } from "../entities/hospital.entity";
import { NHSO } from "../entities/nhso.entity";
import { Patient } from "../entities/patient.entity";
import { Pagination, PaginationOptions, toPagination } from "../utils/pagination.util";
import { KYC } from "./user.dto";
import { S3Service } from "../s3/s3.service";
import { ResetPasswordKYC } from "../entities/reset-password-kyc.entity";
import { KycQueryType } from "../constant/enum/kyc.enum";
import { Agency } from "../entities/agency.entity";
import { getUserObject } from "../utils/patient.util";
import { SmsService } from "../sms/sms.service";

@Injectable()
export class UserService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly s3Service: S3Service,
    private readonly smsService: SmsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
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
    const user = await this.userRepository.findOneOrFail(id);
    if (relation) {
      return this.userRepository.findOneOrFail(id, {
        relations: [UserService.getRelations(user)],
      });
    }
    return user;
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
    const { page, pageSize } = pageOptions;
    switch (type) {
      // case KycQueryType.All:
      //   pageSize = Math.ceil(pageSize / 2);
      //   const [registerKyc, registerKycCount] = await this.findRegisterKyc(
      //     approved,
      //     ready,
      //     { page, pageSize }
      //   );
      //   const [
      //     resetPasswordKyc,
      //     resetPasswordKycCount,
      //   ] = await this.findResetPasswordKyc(ready, { page, pageSize });
      //   const combinedKYCs = [...registerKyc, ...resetPasswordKyc];
      //   const totalCount = registerKycCount + resetPasswordKycCount;
      //   return toPagination<KYC>(combinedKYCs, totalCount, { page, pageSize });
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
    const query = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.patient", "patient")
      .where("user.role = :role", { role: UserRole.Patient })
      .andWhere("patient.approved = :approved", { approved })
      .take(pageOptions.pageSize)
      .skip((pageOptions.page - 1) * pageOptions.pageSize);
    if (ready) {
      query.andWhere("patient.nationalIdImage is not null");
      query.andWhere("patient.selfieImage is not null");
    } else {
      query.andWhere(
        new Brackets((qb) => {
          qb.where("patient.nationalIdImage is null")
            .orWhere("patient.selfieImage is null");
        })
      );
    }
    const [users, totalCount] = await query.getManyAndCount();
    const KYCs: KYC[] = users.map((user) => ({
      type: KycQueryType.Register,
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
    const query = this.resetPasswordKycRepository
      .createQueryBuilder("reset_password_kyc")
      .leftJoinAndSelect("reset_password_kyc.patient", "patient")
      .leftJoinAndSelect("patient.user", "user")
      .take(pageOptions.pageSize)
      .skip((pageOptions.page - 1) * pageOptions.pageSize);
    if (ready) {
      query.andWhere("reset_password_kyc.nationalIdImage is not null");
      query.andWhere("reset_password_kyc.nationalIdImage <> ''");
      query.andWhere("reset_password_kyc.selfieImage is not null");
      query.andWhere("reset_password_kyc.selfieImage <> ''");
    }
    const [resetPasswordKYCs, totalCount] = await query.getManyAndCount();
    const KYCs: KYC[] = resetPasswordKYCs.map((rp) => {
      const user = getUserObject(rp.patient);
      return {
        type: KycQueryType.ResetPassword,
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
    if (!user.patient.nationalIdImage || !user.patient.selfieImage) {
      throw new BadRequestException("User has missing kyc image(s)");
    }
    user.patient.approved = true;
    await this.patientRepository.save(user.patient);
    this.smsService.sendSms(
      user.phone,
      "บัญชี healthcare token ของคุณได้รับการยืนยันแล้ว"
    );
  }

  async rejectKyc(id: number): Promise<void> {
    const user = await this.findById(id, true);
    if (!user.patient.nationalIdImage || !user.patient.selfieImage) {
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

  async findByUsernameAndRole(
    username: string,
    role: UserRole,
    password?: boolean
  ): Promise<User> {
    const query = this.userRepository.createQueryBuilder();
    query.where("username = :username", { username });
    if (role === UserRole.Hospital || role === UserRole.HospitalAdmin) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where("role = :hospital", { hospital: UserRole.Hospital });
          qb.orWhere("role = :hospitalAdmin", { hospitalAdmin: UserRole.HospitalAdmin });
        })
      );
    } else {
      query.andWhere("role = :role", { role });
    }
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
    const newUser = this.userRepository.create(UserService.excludeUserRoleFields(user));
    switch (user.role) {
      case UserRole.HospitalAdmin:
      case UserRole.Hospital:
        newUser.role = UserRole.HospitalAdmin;
        const hospital = await this.hospitalRepository.findOne({
          code9: user.hospital.code9,
        });
        if (!hospital) {
          throw new BadRequestException(`Invalid hospital's code9`);
        }
        const existingUser = await this.userRepository.findOne({
          hospital,
        });
        if (existingUser) {
          throw new BadRequestException(
            `There is already hospital admin for this hospital`
          );
        }
        newUser.hospital = hospital;
        return entityManager.save(newUser);

      case UserRole.NHSO:
        newUser.nhso = this.nhsoRepository.create(user.nhso);
        return entityManager.save(newUser);

      case UserRole.Agency:
        newUser.agency = this.agencyRepository.create(user.agency);
        return entityManager.save(newUser);

      case UserRole.Patient:
        const existed = await this.patientRepository.findOne({
          nationalId: user.patient.nationalId,
        });
        if (existed) {
          throw new BadRequestException("Duplicate Patient's National ID");
        }
        newUser.patient = this.patientRepository.create(user.patient);
        return entityManager.save(newUser);

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

  async approveResetPassword(id: number): Promise<void> {
    const resetPasswordKYC = await this.resetPasswordKycRepository
      .createQueryBuilder("reset_password_kyc")
      .leftJoinAndSelect("reset_password_kyc.patient", "patient")
      .leftJoinAndSelect("patient.user", "user")
      .where("reset_password_kyc.id = :id", { id })
      .getOneOrFail();
    const updatedUser = this.userRepository.create(resetPasswordKYC.patient.user);
    const updatedPatient = this.patientRepository.create(resetPasswordKYC.patient);
    updatedPatient.nationalIdImage = resetPasswordKYC.nationalIdImage;
    updatedPatient.selfieImage = resetPasswordKYC.selfieImage;
    updatedPatient.requiredRecovery = true;
    updatedUser.password = resetPasswordKYC.newPassword;
    updatedUser.passwordChangedDate = new Date();
    updatedUser.patient = updatedPatient
    await this.userRepository.save(updatedUser)
    await this.resetPasswordKycRepository.softDelete(id)
    this.smsService.sendSms(
      updatedUser.phone,
      "รหัสผ่าน healthcare token ของคุณถูกรีเซตแล้ว"
    );
  }

  async rejectResetPassword(id: number): Promise<void> {
    await this.resetPasswordKycRepository.softDelete(id);
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
    const user = await this.findById(id, true);
    await this.userRepository.softRemove(user);
  }

  async restore(id: number): Promise<void> {
    await this.userRepository.restore(id);
  }

  public static excludeUserRoleFields(user: User) {
    const { nhso, agency, hospital, patient, ...dto } = user;
    return dto;
  }

  private static getRelations(user: User) {
    if (user.role === UserRole.HospitalAdmin) {
      return UserRole.Hospital.toLowerCase();
    }
    return user.role.toLowerCase();
  }
}
