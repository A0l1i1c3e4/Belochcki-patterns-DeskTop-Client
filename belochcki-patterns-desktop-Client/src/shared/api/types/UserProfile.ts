export interface UserProfile {
  userId: string;
  fullName: string;
  about: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: Array<{
    [key: string]: any;
  }>;
}

export interface EmployeeProfile {
  id: string;
  name: string;
  login: string;
  password: string;
  status: 'UNLOCKED' | 'LOCKED' | string;
  creditRating: Int16Array;
  token: string;
}

export interface UpdateEmployeeProfileDto {
  name: string;
  login: string;
  password: string;
}
