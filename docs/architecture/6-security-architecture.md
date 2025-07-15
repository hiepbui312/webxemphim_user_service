# 6. Security Architecture

## 6.1 Authentication & Authorization

**Current Implementation:**

```typescript
// JWT Authentication Guard (Implemented)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Validates JWT tokens for protected routes
  // Used in UserController for /api/v1/users/me endpoints
}

// JWT Strategy (Implemented)
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private appConfigService: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    // Validates JWT payload and returns user context
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
```

**Security Features:**
- ✅ **JWT Token Validation**: Stateless authentication
- ✅ **Bearer Token**: Secure token transmission
- ✅ **Type-Safe Payloads**: JwtPayload interface
- ✅ **User Context**: AuthenticatedRequest interface
- 🔄 **Role-Based Access**: Planned for future implementation

## 6.2 Data Protection

**Current Implementation:**

```typescript
// User Entity with security considerations
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'json' })
  preferences: UserPreferences; // JSON data type for preferences

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date; // Soft delete support
}
```

**Security Measures:**
- ✅ **UUID Primary Keys**: Prevents enumeration attacks
- ✅ **Soft Delete**: Data retention with privacy compliance
- ✅ **JSON Preferences**: Structured data storage
- ✅ **Unique Email**: Prevents duplicate accounts
- ✅ **TypeScript Types**: Compile-time data validation
- 🔄 **Password Hashing**: Planned for future auth expansion
- 🔄 **Field Encryption**: Planned for sensitive data

## 6.3 Configuration Security

**Environment Variable Protection:**

```typescript
// Centralized configuration with validation
export class AppConfigService {
  get jwtSecret(): string {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required');
    }
    if (jwtSecret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long');
    }
    return jwtSecret;
  }
}
```

**Security Benefits:**
- ✅ **No Default Values**: Prevents weak configuration
- ✅ **Joi Validation**: Schema-based validation at startup
- ✅ **Type Safety**: Configuration type checking
- ✅ **Fail-Fast**: Application won't start with invalid config
- ✅ **Secret Length Validation**: Enforces strong JWT secrets

---
