// ─── User Types ──────────────────────────────────────────

export type UserRole = "customer" | "worker" | "admin";

export interface IAuthUser {
  _id: string;
  email: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface IRating {
  average: number;
  count: number;
}

export interface IUserProfile {
  _id: string;
  authId: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  // Worker-specific
  services?: string[];
  bio?: string;
  hourlyRate?: number;
  isAvailable?: boolean;
  location?: ILocation;
  address?: IAddress;
  rating?: IRating;
  createdAt: Date;
  updatedAt: Date;
}
