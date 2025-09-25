
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";
import _ from "lodash";
import { RegisterForm } from "../domain/register-form";

export class RegisterFormDto {
    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    password: string;

    public static toRegisterForm(_this: RegisterFormDto): RegisterForm {
        return {
            ..._this,
            email: _.toLower(_this.email)
        };
    }
}
