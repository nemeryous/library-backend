/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ExecutionContext } from '@nestjs/common';
import { BadRequestException, createParamDecorator } from '@nestjs/common';
import type { ClassConstructor } from 'class-transformer';
import { plainToInstance } from 'class-transformer';
import { languageFromCode, languageFromCodeOrUndefined } from '../utils/language.utils';


export const AcceptedLanguage = createParamDecorator(
  (value: ClassConstructor<unknown>, ctx: ExecutionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const headers = ctx.switchToHttp().getRequest().headers;

    const headersObj = plainToInstance(value, headers, {
      excludeExtraneousValues: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const language = (headersObj as any)['accept-language'];

    return languageFromCode(language as string);
  },
);

export const ValidLanguage = createParamDecorator(
  (_data, ctx: ExecutionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const lang = request.params.lang;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const validLang = languageFromCodeOrUndefined(lang);

    if (!validLang) {
      throw new BadRequestException(`Invalid language: ${lang}`);
    }

    return validLang;
  },
);
