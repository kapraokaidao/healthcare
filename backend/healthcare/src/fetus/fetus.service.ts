import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fetus } from 'src/entities/fetus.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { FetusGroupByDateResponse } from './fetus.dto';

@Injectable()
export class FetusService {
    constructor(
        @InjectRepository(Fetus)
        private readonly fetusRepository: Repository<Fetus>,
        private readonly userService: UserService,

    ){}

    async create(userId: number, amount: number, weight: number):Promise<Fetus> {
        const user = await this.userService.findById(userId, true);
        const fetus = this.fetusRepository.create();
        fetus.amount = amount;
        fetus.weight = weight;
        fetus.patient = user.patient;
        return this.fetusRepository.save(fetus);
    }

    async findGroupByDate(userId: number): Promise<FetusGroupByDateResponse[]> {
        const user = await this.userService.findById(userId, true);
        let query = this.fetusRepository
        .createQueryBuilder("fetus")
        .where({patient: {id: user.patient.id}})
        .addSelect("SUM(fetus.amount) as amount")
        .addSelect("AVG(fetus.weight) as weight")
        .groupBy("CAST(fetus.created_date AS DATE)");
      const queryResult = await query.getRawMany();
      const fetuses = queryResult.map((e) => {
          const fetus = new FetusGroupByDateResponse();
          fetus.amount = e.amount;
          fetus.weight = e.weight;
          fetus.date = e.fetus_created_date;
         return fetus;
      })
      return fetuses;
    }

}
