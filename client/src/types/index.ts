export type ErrorType = 'network' | 'validation' | 'conflict' | 'not_found' | 'rate_limited' | 'server' | 'unknown';

export interface AppError {
  type: ErrorType;
  message: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Birthday {
  _id: string;
  name: string;
  birthDate: string;
  note?: string;
  isToday: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BirthdayFormData {
  name: string;
  birthDate: string;
  note?: string;
}
