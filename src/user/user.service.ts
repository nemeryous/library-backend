import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRequestDto } from './dto/user-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();
    return users.map((user) => this.toResponseDto(user));
  }

  async findOne(id: number): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return null;
    }
    return this.toResponseDto(user);
  }

  async create(userRequestDto: UserRequestDto): Promise<UserResponseDto> {
    const createUser = this.userRepository.create(userRequestDto);
    return this.toResponseDto(await this.userRepository.save(createUser));
  }

  async update(
    id: number,
    userRequestDto: UserRequestDto,
  ): Promise<UserResponseDto | null> {
    await this.userRepository.update(id, userRequestDto);
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return null;
    }
    return this.toResponseDto(user);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  private toResponseDto(user: User) {
    const { id, name, email } = user;
    return { id, name, email };
  }
}
