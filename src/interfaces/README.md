# Interfaces

This directory contains TypeScript interface definitions organized by domain/module.

## Structure

```
src/interfaces/
├── auth.interface.ts    # Authentication-related interfaces
├── user.interface.ts    # User-related interfaces  
├── index.ts            # Re-exports all interfaces
└── README.md           # This file
```

## Usage

### Import all interfaces:
```typescript
import { JwtPayload, AuthenticatedRequest, UserPreferences } from '../../interfaces';
```

### Import specific interfaces:
```typescript
import { JwtPayload } from '../../interfaces/auth.interface';
import { UserPreferences } from '../../interfaces/user.interface';
```

## Guidelines

1. **Organization**: Group interfaces by domain/module (auth, user, etc.)
2. **Naming**: Use PascalCase for interface names
3. **Documentation**: Add JSDoc comments for complex interfaces
4. **Exports**: Always re-export from `index.ts` for clean imports
5. **No Logic**: Keep interfaces pure - no business logic or implementations

## Adding New Interfaces

1. Create or update the appropriate `*.interface.ts` file
2. Add proper JSDoc documentation
3. Re-export from `index.ts`
4. Update this README if adding new categories 