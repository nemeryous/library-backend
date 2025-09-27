import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserEntity } from '../user/entity/user.entity';
import { RoleType } from '../../guards/role-type';

export const guestUser: Partial<UserEntity> = {
    id: 0,
    keyCloakId: undefined,
    firstName: 'Guest',
    lastName: 'User',
    email: 'guest@local',
    role: RoleType.GUEST,
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private static jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

        constructor(
            config: ApiConfigService,
            @InjectRepository(UserEntity)
            private readonly userRepository: Repository<UserEntity>,
        ) {
            super({
                ignoreExpiration: false,
                algorithms: ['RS256'],
                jwtFromRequest: JwtStrategy.jwtFromRequest,
                secretOrKeyProvider: passportJwtSecret({
                    cache: true,
                    rateLimit: true,
                    jwksRequestsPerMinute: 5,
                    jwksUri: config.keycloakJwtConfig.jwksUri,
                }),
            });
        }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
            authenticate(req: any, options?: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
                const token = JwtStrategy.jwtFromRequest(req);

                if (!token) {
                    req.user = guestUser; // eslint-disable-line @typescript-eslint/no-unsafe-member-access
                    return (this as any).success(guestUser); // passport adds success at runtime; cast to any
                }

                super.authenticate(req, options); // eslint-disable-line @typescript-eslint/no-unsafe-argument
            }

    // noinspection JSUnusedGlobalSymbols
        public async validate(args: IJwtPayload): Promise<UserEntity | null> {
            const keycloakSub = args.sub;

            const user = await this.userRepository.findOne({
                where: { keyCloakId: keycloakSub },
            });

            return user ?? null;
        }
}

interface IJwtPayload {
    exp: number;
    iat: number;
    auth_time: number;
    jti: string;
    iss: string;
    aud: string;
    sub: string;
    typ: string;
    azp: string;
    sid: string;
    acr: string;
    realm_access: {
        roles: string[];
    };
    resource_access: {
        account: {
            roles: string[];
        };
    };
    scope: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    given_name: string;
    family_name: string;
    email: string;
}
