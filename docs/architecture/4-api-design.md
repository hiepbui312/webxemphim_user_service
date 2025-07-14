# 4. API Design

## 4.1 RESTful API Structure

```
/api/v1/users
├── GET    /                        # Get users list (Admin only)
├── GET    /me                      # Get current user profile
├── PUT    /me                      # Update current user profile
├── DELETE /me                      # Delete current user
├── GET    /me/favorites            # Get user favorites
├── POST   /me/favorites            # Add movie to favorites
├── DELETE /me/favorites/:movieId   # Remove from favorites
├── GET    /me/watch-history        # Get watch history
├── POST   /me/watch-history        # Add watch history entry
├── DELETE /me/watch-history/:id    # Remove watch history entry
├── GET    /me/statistics           # Get user statistics
├── GET    /:userId                 # Get user by ID (Admin only)
└── PUT    /:userId/status          # Update user status (Admin only)
```

## 4.2 Request/Response Examples

```typescript
// User Profile Response
interface UserProfileResponse {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  preferences: {
    language: string;
    notifications: boolean;
    autoplay: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Update Profile Request
interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  preferences?: {
    language?: string;
    notifications?: boolean;
    autoplay?: boolean;
  };
}
```

---
