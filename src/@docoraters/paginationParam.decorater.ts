import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';
export interface Pagination {
  page: number;
  size: number;
  limit: number;
  offset: number;
}

export const PaginationParams = createParamDecorator(
  (data, ctx: ExecutionContext): Pagination => {
    const req: Request = ctx.switchToHttp().getRequest();
    const page = parseInt(req.query.page as string);
    const size = parseInt(req.query.size as string);

    // check if the page and size are valid or not
    if (isNaN(page) || page < 0 || isNaN(size) || size < 0)
      throw new BadRequestException('Invalid Pagination Param');

    // dont allow to fetch the large slices of dataset
    if (size > 100)
      throw new BadRequestException(
        'Invalid Pagination Param: Max Size is 100',
      );

    // Calculate the pagination parameter
    const limit = size;
    const offset = limit * page;
    return { page, limit, size, offset };
  },
);
