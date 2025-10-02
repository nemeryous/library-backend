import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { KeycloakService } from './keycloak.service';

@Module({
  imports: [SharedModule],
  providers: [KeycloakService],
  exports: [KeycloakService],
})
export class KeycloakModule { }
