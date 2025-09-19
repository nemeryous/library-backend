import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { User } from './domain/user';
import { UserRequest } from './domain/user-request';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    return User.fromEntities(await this.userRepository.find());
  }

  async findOne(id: number): Promise<User> {
    return User.fromEntity(await this.findOneOrThrow(id));
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      return null;
    }
    return User.fromEntity(user);
  }

  async create(userRequest: UserRequest): Promise<User> {
    return User.fromEntity(
      await this.userRepository.save(
        this.userRepository.create(UserRequest.toEntity(userRequest)),
      ),
    );
  }

  async update(id: number, userRequest: UserRequest): Promise<User> {
    const updatedUser = this.userRepository.save({
      ...(await this.findOneOrThrow(id)),
      ...UserRequest.toEntity(userRequest),
    });

    return User.fromEntity(await updatedUser);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(await this.findOneOrThrow(id));
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async findOneOrThrow(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
