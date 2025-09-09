import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserRequestDto } from './dto/user-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.domain';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();

    return users.map(User.fromEntities);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({
      id,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return User.fromEntities(user);
  }

  async create(
    userRequestDto: UserRequestDto,
  ): Promise<User> {
    const createUser = this.userRepository.create(userRequestDto);

    return User.fromEntities(await this.userRepository.save(createUser));
  }

  async update(
    id: number,
    userRequestDto: UserRequestDto,
  ): Promise<User> {
    await this.userRepository.update(id, userRequestDto);

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return User.fromEntities(user);
  }

  async delete(id: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(id);
  }
}
