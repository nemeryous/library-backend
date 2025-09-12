import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '@user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@user/domain/user';
import { UserRequest } from '@user/domain/user-request';

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

  private async findOneOrThrow(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
