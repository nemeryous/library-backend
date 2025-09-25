import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { LoginForm } from "../domain/login-form";
import _ from 'lodash';

export class LoginFormDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    password: string;

    public static toLoginForm(dto: LoginFormDto): LoginForm {
        return {
            ...dto,
            email: _.toLower(dto.email)
        };
    }
}
