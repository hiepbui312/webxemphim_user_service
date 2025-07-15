import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // TODO: Implement proper JWT validation
    // This is a placeholder guard for development
    const request = context.switchToHttp().getRequest();
    
    // Mock user data for development
    request.user = {
      sub: '550e8400-e29b-41d4-a716-446655440000',
      email: 'test@example.com',
    };
    
    return true;
  }
} 