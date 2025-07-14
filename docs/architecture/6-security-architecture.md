# 6. Security Architecture

## 6.1 Authentication & Authorization

```typescript
// JWT Guard
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean {
    // JWT validation logic
    return super.canActivate(context);
  }
}

// Role-based access control
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some(role => user.roles?.includes(role));
  }
}
```

## 6.2 Data Protection

```typescript
// Sensitive data encryption
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ transformer: encryptionTransformer })
  personalInfo: string; // Encrypted field

  @Exclude({ toPlainOnly: true })
  password: string; // Excluded from responses
}
```

---
