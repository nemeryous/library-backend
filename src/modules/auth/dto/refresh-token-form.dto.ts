import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { RefreshTokenForm } from '../domain/refresh-token-form';

export class RefreshTokenFormDto {
    @ApiProperty()
    @IsString()
    refreshToken: string;

    public static toRefreshTokenForm(dto: RefreshTokenFormDto): RefreshTokenForm {
        return {
            refreshToken: dto.refreshToken,
        };
    }
}
