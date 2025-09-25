import { Module } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';

@Module({
  imports: [],
  controllers: [],
  providers: [KeycloakService],
  exports: [KeycloakService],
})
export class KeycloakModule {}
