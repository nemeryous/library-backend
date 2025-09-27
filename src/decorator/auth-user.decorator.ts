import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

import type { UserEntity } from '../modules/user/entity/user.entity';

export type IAuthUser = UserEntity;

export function AuthUser() {
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user: unknown = request.user;

    if (user) {
      return user as IAuthUser;
    }

    return null;
  })();
}
