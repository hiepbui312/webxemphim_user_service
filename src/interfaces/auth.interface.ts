import { Request } from 'express';

/**
 * JWT payload structure for authentication
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  iat?: number; // Issued at
  exp?: number; // Expiration time
}

/**
 * Extended Request interface for authenticated routes
 * Contains user information from JWT payload
 */
export interface AuthenticatedRequest extends Request {
  user: {
    userId: string; // User ID from JWT payload
    email: string;   // User email from JWT payload
  };
} 