import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async find(conditions = {}): Promise<User[]> {
    return this.userRepository.find(conditions);
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async findOne(conditions): Promise<User> {
    return this.userRepository.findOne(conditions);
  }

  async findByUsername(username: string, password?: boolean): Promise<User> {
    const query = this.userRepository.createQueryBuilder();
    query.where('username = :username', { username });
    if (password) {
      query.addSelect('password', 'User_password');
    }
    return query.getOne();
  }

  async create(user: User): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }
}
