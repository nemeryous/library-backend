import type { PipeTransform } from '@nestjs/common';
import { applyDecorators, Param, ParseUUIDPipe, SetMetadata, UseGuards, } from '@nestjs/common';
import type { Type } from '@nestjs/common/interfaces';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from './jwt-auth-guard';
import { RolesGuard } from '../guards/roles.guard';
import { RoleType } from "../guards/role-type";

export function Auth(roles: RoleType[] = []): MethodDecorator & ClassDecorator {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function UUIDParam(
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
  return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}
