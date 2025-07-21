import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from './user.module';
import { User, Gender } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('User Integration Tests', () => {
  let app: INestApplication;
  let userRepository: jest.Mocked<UserRepository>;

  const testUser: User = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@example.com',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    avatar: null,
    dateOfBirth: new Date('1990-01-01'),
    gender: Gender.MALE,
    preferences: {
      language: 'en',
      notifications: true,
      autoplay: false,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeAll(async () => {
    const mockUserRepository = {
      findByUserId: jest.fn(),
      updateProfile: jest.fn(),
      findByEmail: jest.fn(),
      softDeleteUser: jest.fn(),
      restoreUser: jest.fn(),
      findWithPagination: jest.fn(),
    };

    // Mock the JWT Auth Guard to always allow access
    const mockJwtAuthGuard = {
      canActivate: jest.fn(() => true),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(UserRepository)
      .useValue(mockUserRepository)
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    // Mock the request user context
    app.use((req, res, next) => {
      req.user = {
        userId: testUser.id,
        email: testUser.email,
      };
      next();
    });

    await app.init();

    userRepository = moduleFixture.get<UserRepository>(UserRepository) as jest.Mocked<UserRepository>;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    // Default setup for each test
    userRepository.findByUserId.mockResolvedValue(testUser);
  });

  describe('GET /api/v1/users/me', () => {
    it('should return current user profile successfully', async () => {
      userRepository.findByUserId.mockResolvedValue(testUser);

      const response = await request(app.getHttpServer())
        .get('/api/v1/users/me')
        .expect(200);

      expect(response.body).toMatchObject({
        id: testUser.id,
        email: testUser.email,
        username: testUser.username,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        gender: testUser.gender,
        preferences: testUser.preferences,
      });
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
      expect(response.body).not.toHaveProperty('deletedAt');
    });

    it('should return 404 when user not found', async () => {
      userRepository.findByUserId.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .get('/api/v1/users/me')
        .expect(404);

      expect(response.body).toMatchObject({
        statusCode: 404,
        message: 'User not found',
      });
    });
  });

  describe('PUT /api/v1/users/me', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        preferences: {
          language: 'vi',
          notifications: false,
          autoplay: true,
        },
      };

      const updatedUser = { ...testUser, ...updateData };
      userRepository.findByUserId.mockResolvedValue(testUser);
      userRepository.updateProfile.mockResolvedValue(updatedUser);

      const response = await request(app.getHttpServer())
        .put('/api/v1/users/me')
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        id: testUser.id,
        email: testUser.email,
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        preferences: updateData.preferences,
      });

      expect(userRepository.updateProfile).toHaveBeenCalledWith(testUser.id, updateData);
    });

    it('should handle partial updates', async () => {
      const partialUpdate = {
        firstName: 'OnlyFirstName',
      };

      const updatedUser = { ...testUser, firstName: 'OnlyFirstName' };
      userRepository.findByUserId.mockResolvedValue(testUser);
      userRepository.updateProfile.mockResolvedValue(updatedUser);

      const response = await request(app.getHttpServer())
        .put('/api/v1/users/me')
        .send(partialUpdate)
        .expect(200);

      expect(response.body).toMatchObject({
        id: testUser.id,
        firstName: partialUpdate.firstName,
        lastName: testUser.lastName, // Should remain unchanged
        email: testUser.email,
      });

      expect(userRepository.updateProfile).toHaveBeenCalledWith(testUser.id, partialUpdate);
    });

    it('should update avatar successfully', async () => {
      const avatarUpdate = {
        avatar: 'https://example.com/new-avatar.jpg',
      };

      const updatedUser = { ...testUser, avatar: avatarUpdate.avatar };
      userRepository.findByUserId.mockResolvedValue(testUser);
      userRepository.updateProfile.mockResolvedValue(updatedUser);

      const response = await request(app.getHttpServer())
        .put('/api/v1/users/me')
        .send(avatarUpdate)
        .expect(200);

      expect(response.body.avatar).toBe(avatarUpdate.avatar);
      expect(userRepository.updateProfile).toHaveBeenCalledWith(testUser.id, avatarUpdate);
    });

    it('should return 400 for invalid first name', async () => {
      const invalidUpdate = {
        firstName: '', // Empty string should fail validation
      };

      const response = await request(app.getHttpServer())
        .put('/api/v1/users/me')
        .send(invalidUpdate)
        .expect(400);

      expect(response.body.message).toContain('firstName must be longer than or equal to 1 characters');
    });

    it('should return 400 for invalid avatar URL', async () => {
      const invalidUpdate = {
        avatar: 'not-a-valid-url',
      };

      const response = await request(app.getHttpServer())
        .put('/api/v1/users/me')
        .send(invalidUpdate)
        .expect(400);

      expect(response.body.message).toContain('avatar must be an URL address');
    });

    it('should return 404 when user not found', async () => {
      userRepository.findByUserId.mockResolvedValue(null);

      const updateData = {
        firstName: 'Updated',
      };

      const response = await request(app.getHttpServer())
        .put('/api/v1/users/me')
        .send(updateData)
        .expect(404);

      expect(response.body).toMatchObject({
        statusCode: 404,
        message: 'User not found',
      });
    });

    it('should reject unknown fields', async () => {
      const updateWithUnknownField = {
        firstName: 'Valid',
        unknownField: 'should be rejected',
      };

      const response = await request(app.getHttpServer())
        .put('/api/v1/users/me')
        .send(updateWithUnknownField)
        .expect(400);

      expect(response.body.message).toContain('property unknownField should not exist');
    });

    it('should handle empty update object', async () => {
      userRepository.findByUserId.mockResolvedValue(testUser);
      userRepository.updateProfile.mockResolvedValue(testUser);

      const response = await request(app.getHttpServer())
        .put('/api/v1/users/me')
        .send({})
        .expect(200);

      // Should return user without changes
      expect(response.body).toMatchObject({
        id: testUser.id,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
      });
    });
  });

  describe('Validation and Error Handling', () => {
    it('should return 400 for future date of birth', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const invalidUpdate = {
        dateOfBirth: futureDate.toISOString().split('T')[0],
      };

      userRepository.findByUserId.mockResolvedValue(testUser);

      const response = await request(app.getHttpServer())
        .put('/api/v1/users/me')
        .send(invalidUpdate)
        .expect(400);

      expect(response.body.message).toBe('Date of birth cannot be in the future');
    });

    it('should return 400 for underage user', async () => {
      const recentDate = new Date();
      recentDate.setFullYear(recentDate.getFullYear() - 10); // 10 years old

      const invalidUpdate = {
        dateOfBirth: recentDate.toISOString().split('T')[0],
      };

      userRepository.findByUserId.mockResolvedValue(testUser);

      const response = await request(app.getHttpServer())
        .put('/api/v1/users/me')
        .send(invalidUpdate)
        .expect(400);

      expect(response.body.message).toBe('User must be at least 13 years old');
    });

    it('should return 400 for invalid gender', async () => {
      const invalidUpdate = {
        gender: 'invalid-gender',
      };

      const response = await request(app.getHttpServer())
        .put('/api/v1/users/me')
        .send(invalidUpdate)
        .expect(400);

      expect(response.body.message).toContain('gender must be one of the following values');
    });
  });
}); 