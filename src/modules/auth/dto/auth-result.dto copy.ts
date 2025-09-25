import { TokenDto } from "./token.dto";
import { CurrentUserDto } from "./current-user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { AuthResult } from "../domain/auth-result";

export class AuthResultDto {
    @ApiProperty()
    token: TokenDto;

    @ApiProperty()
    user: CurrentUserDto;

    public static fromAuthResult(authResult: AuthResult): AuthResultDto {
        return {
            token: TokenDto.fromToken(authResult.token),
            user: CurrentUserDto.fromUser(authResult.user),
        };
    }
}
