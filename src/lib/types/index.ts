/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IUser {
  _id: string;
  name: string;
  role: USER_ROLE;
  email: string;
  status: string;
  emailVerified: boolean;
  mobileNumber: string;
  profilePhoto: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// Auth response types
export interface IAuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  statusCode?: number;
  data?: {
    accessToken: string;
    refreshToken: string;
    user?: IUser;
  };
}

export interface IAuthError {
  success: false;
  error: string;
  statusCode?: number;
}

// API Error types
export interface IApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
  message?: string;
}

// JWT Decoded token type
export interface IDecodedToken {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  role: USER_ROLE;
  status: string;
  emailVerified: boolean;
  profilePhoto: string;
  iat?: number;
  exp?: number;
}

export interface IPayment {
  transactionId: string;
  _id?: string;
  user: any;
  course: any;
  amount: number;
  status: "pending" | "completed" | "failed";
  createdAt?: Date;
  updatedAt?: Date;
}

export type USER_ROLE = "ADMIN" | "USER" | "HR" | "MARKETING_TEAM" | "CUSTOMER_SERVICE_TEAM";

export interface IInput {
  variant?: "flat" | "bordered" | "faded" | "underlined";
  size?: any;
  required?: boolean;
  type?: string;
  label: string;
  name: string;
  disabled?: boolean;
  placeholder?: string;
  errorMessage?: string;
}

export type ICertificate = {
  _id: string;
  certificateId?: string;
  studentId: string;
  studentName: string;
  courseName: string;
  issueDate: string | Date;
  instructorName: string;
  status:
    | "pending"
    | "issued"
    | "revoked"
    | "applied"
    | "approved"
    | "rejected";
  comment?: string;
  photoUrl?: string;
  appliedAt?: Date;
  approvedAt?: Date;
};

// Types:
export interface CertificateApplication {
  _id?: string;
  certificateId?: string;
  studentId: string;
  studentName: string;
  courseName: string;
  issueDate: string | Date;
  instructorName: string;
  status:
    | "pending"
    | "issued"
    | "revoked"
    | "applied"
    | "approved"
    | "rejected";
  comment?: string;
  photoUrl?: string;
  appliedAt?: Date;
  approvedAt?: Date;
}

export interface IIndustrialOfferBanner {
  _id?: string;
  title: string;
  description: string;
  buyNowText?: string;
  learnMoreText?: string;
  date?: any;
  time?: any;
  remainingDays?: number;
  photoUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ISoftware {
  softwareTitle: string;
  photoUrl: string;
}

export interface ICourse {
  title: string;
  duration: string;
  _id: string;
  lessons: string;
  projects: string;
  slug: string;
  photoUrl: string;
  category: string;
  softwaresTaught: ISoftware[];
}
