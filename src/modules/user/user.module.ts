import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { KeycloakService } from '../keycloak/keycloak.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule],
  controllers: [UserController],
  providers: [UserService, KeycloakService],
  exports: [UserService, KeycloakService],
})
export class UserModule {}
