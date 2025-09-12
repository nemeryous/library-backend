import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from '@user/user.service';
import { UserResponseDto } from '@user/dto/user.response.dto';
import { UserRequestDto } from '@user/dto/user-request.dto';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    return UserResponseDto.fromUsers(await this.userService.findAll());
  }

  @Post()
  async create(
    @Body() userRequestDto: UserRequestDto,
  ): Promise<UserResponseDto> {
    return UserResponseDto.fromUser(
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
  async findOne(@Param('id') id: number): Promise<UserResponseDto> {
    return UserResponseDto.fromUser(await this.userService.findOne(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() userRequestDto: UserRequestDto,
  ): Promise<UserResponseDto> {
    return UserResponseDto.fromUser(
      await this.userService.update(
        id,
        UserRequestDto.toUserRequest(userRequestDto),
      ),
    );
  }
}
