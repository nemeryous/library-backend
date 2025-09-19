import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Register } from '../domain/register';

export class RegisterDto {
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  static toRegister(dto: RegisterDto): Register {
    return {
      name: dto.name,
      email: dto.email,
      password: dto.password,
    };
  }
}
