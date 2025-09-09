import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRequestDto } from './dto/user-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponse } from './response/user.response';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepository.find();
    return users.map((user) => UserResponse.toUserResponse(user));
  }

  async findOne(id: number): Promise<UserResponse | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return null;
    }
    return UserResponse.toUserResponse(user);
  }

  async create(userRequestDto: UserRequestDto): Promise<UserResponse> {
    const createUser = this.userRepository.create(userRequestDto);
    return UserResponse.toUserResponse(
      await this.userRepository.save(createUser),
    );
  }

  async update(
    id: number,
    userRequestDto: UserRequestDto,
  ): Promise<UserResponse | null> {
    await this.userRepository.update(id, userRequestDto);
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return null;
    }
    return UserResponse.toUserResponse(user);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
