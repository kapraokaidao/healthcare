import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TxType } from "src/constant/enum/transaction.enum";
import { BillDetail } from "src/entities/bill-detail.entity";
import { Bill } from "src/entities/bill.entity";
import { Transaction } from "src/entities/transaction.entity";
import { UserToken } from "src/entities/user-token.entity";
import { HealthcareTokenService } from "src/healthcare-token/healthcare-token.service";
import { KeypairService } from "src/keypair/keypair.service";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { BillDetailResponse, CreateBillDto, SearchBillDto, SearchBillResponse, ServiceItem } from "./bill.dto";

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
    @InjectRepository(BillDetail)
    private readonly billDetailRepository: Repository<BillDetail>,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly healthcareTokenService: HealthcareTokenService,
    private readonly userService: UserService,
    private readonly keypairService: KeypairService
  ) {}

  async createBill(userId: number, dto: CreateBillDto) {
    for (let withdraw of dto.withdrawItems) {
      console.log(withdraw);
      const userToken = await this.healthcareTokenService.getBalanceByServiceId(
        userId,
        withdraw.serviceId
      );
      console.log("after");
      if (!userToken || userToken.balance < withdraw.amount) {
        throw new BadRequestException("Cannot withdraw exceed your balance");
      }
    }

    //create bill
    const user = await this.userService.findById(userId, true);
    const newBill = this.billRepository.create();
    newBill.hospital = user.hospital;
    const bill = await this.billRepository.save(newBill);

    for (let withdraw of dto.withdrawItems) {
      //withdraw on stellar, adjust balance
      await this.healthcareTokenService.withDraw(
        userId,
        withdraw.serviceId,
        withdraw.amount,
        dto.pin
      );

      //create billDetail
      const healthcareToken = await this.healthcareTokenService.findById(
        withdraw.serviceId
      );
      const newBillDetail = this.billDetailRepository.create();
      newBillDetail.bill = bill;
      newBillDetail.amount = withdraw.amount;
      newBillDetail.healthcareToken = healthcareToken;
      newBillDetail.transactions = [];

      const publicKey = await this.keypairService.findPublicKey(userId);

      let query = this.transactionRepository
        .createQueryBuilder("tx")
        .leftJoinAndSelect(
          "tx.healthcareToken",
          "healthcareToken",
          "healthcareToken.id = tx.healthcare_token_id"
        )
        .andWhere("tx.type = :type", { type: TxType.Redeem })
        .andWhere("tx.healthcare_token_id = :serviceId", {
          serviceId: withdraw.serviceId,
        })
        .andWhere("tx.outstanding  > 0")
        .andWhere("tx.destination_public_key = :publicKey", {
          publicKey,
        })
        .orderBy("tx.created_date", "ASC");

      const transactions = await query.getMany();
      console.log(transactions);

      for (let tx of transactions) {
        if (tx.outstanding < withdraw.amount) {
          withdraw.amount -= tx.outstanding;
          tx.outstanding = 0;
          await this.transactionRepository.save(tx);
          newBillDetail.transactions = [...newBillDetail.transactions, tx];
        } else {
          tx.outstanding -= withdraw.amount;
          withdraw.amount = 0;
          await this.transactionRepository.save(tx);
          newBillDetail.transactions = [...newBillDetail.transactions, tx];
          break;
        }
      }
      console.log(newBillDetail);
      await this.billDetailRepository.save(newBillDetail);
    }
    return;
  }

  async searchBill(dto: SearchBillDto): Promise<Bill[]> {
    const query = this.billRepository
      .createQueryBuilder("bill")
      .leftJoinAndSelect("bill.hospital", "hospital", "hospital.code9 = bill.hospital_id")
      .leftJoinAndSelect("bill.billDetails", "billDetail", "billDetail.bill_id = bill.id")
      .leftJoinAndSelect(
        "billDetail.healthcareToken",
        "healthcareToken",
        "healthcareToken.id = billDetail.healthcare_token_id"
      )
      .select(["bill.id", "hospital.code9", "hospital.fullname", "hospital.type", "bill.createdDate"])

    if (dto.startDate) {
      query.andWhere("CAST(bill.created_date as date) >= :startDate", {
        startDate: dto.startDate,
      });
    }

    if (dto.endDate) {
      query.andWhere("CAST(bill.created_date as date) <= :endDate", {
        endDate: dto.endDate,
      });
    }

    if (dto.hospitalCode) {
      query.andWhere("hospital.code9 = :hospitalCode", 
        {hospitalCode: dto.hospitalCode}
      );
    }

    if (dto.serviceName) {
      query.andWhere("healthcareToken.name like :name", {
        name: `%${dto.serviceName}%`,
      });
    }

    const queryResult = await query.getMany();

    return queryResult;
  }

  async getBillDetails(id: number): Promise<BillDetailResponse> {
    const bill = await this.billRepository.findOneOrFail(id, {relations: ["billDetails", "billDetails.healthcareToken"]})
    const result = new BillDetailResponse()
    result.id = bill.id
    result.services = []
    bill.billDetails.forEach((billDetail) => {
      const serviceItem = new ServiceItem()
      serviceItem.billDetailId = billDetail.id
      serviceItem.serviceName = billDetail.healthcareToken.name
      serviceItem.amount = billDetail.amount
      result.services.push(serviceItem)
    })
    return result
  }

  // async getTransactionsFromBillDetailId(id: number) {

  // }

}
