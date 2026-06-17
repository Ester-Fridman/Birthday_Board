import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export interface JwtPayload {
  userId: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
}
