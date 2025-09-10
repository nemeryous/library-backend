import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRequestDto } from './dto/user-request.dto';
import { UserResponse } from './domain/user.response';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UserResponse[]> {
    return UserResponse.fromUsers(await this.userService.findAll());
  }

  @Post()
  async create(@Body() userRequestDto: UserRequestDto): Promise<UserResponse> {
    return UserResponse.fromUser(
      await this.userService.create(
        UserRequestDto.toUserRequest(userRequestDto),
      ),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.delete(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<UserResponse> {
    return UserResponse.fromUser(await this.userService.findOne(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() userRequestDto: UserRequestDto,
  ): Promise<UserResponse> {
    return UserResponse.fromUser(
      await this.userService.update(
        id,
        UserRequestDto.toUserRequest(userRequestDto),
      ),
    );
  }
}
