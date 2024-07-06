import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RaffleEntity } from '../../../../../database/entities/raffle.entity';
import { Repository } from 'typeorm';

// TODO_1: Fully implement the RaffleService
@Injectable()
export class RaffleService {
  constructor(
    @InjectRepository(RaffleEntity)
    private readonly raffleRepo: Repository<RaffleEntity>,
  ) {}

  getRaffles() {
    return this.raffleRepo.findAndCount({ relations: { product: true } });
  }
}
