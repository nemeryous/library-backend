import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRequestDto } from './dto/user-request.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async create(userRequestDto: UserRequestDto): Promise<User> {
    const newUser = this.userRepository.create(userRequestDto);
    return this.userRepository.save(newUser);
  }

  async update(
    id: number,
    userRequestDto: UserRequestDto,
  ): Promise<User | null> {
    await this.userRepository.update(id, userRequestDto);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
