import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { UserModule } from './user.module';
import { User, Gender } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';

describe('User Integration Tests', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userRepository: any;

  const testUser = {
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
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          synchronize: true,
          logging: false,
        }),
        UserModule,
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
    userRepository = dataSource.getRepository(User);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await userRepository.clear();
    
    // Create test user
    const user = userRepository.create(testUser);
    await userRepository.save(user);
  });

  afterEach(async () => {
    // Clean database after each test
    await userRepository.clear();
  });

  describe('GET /api/v1/users/me', () => {
    it('should return current user profile successfully', async () => {
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
      // Clear the database to simulate user not found
      await userRepository.clear();

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

      // Verify data is persisted in database
      const updatedUser = await userRepository.findOne({
        where: { id: testUser.id },
      });
      expect(updatedUser.firstName).toBe(updateData.firstName);
      expect(updatedUser.lastName).toBe(updateData.lastName);
      expect(updatedUser.preferences).toEqual(updateData.preferences);
    });

    it('should handle partial updates', async () => {
      const partialUpdate = {
        firstName: 'OnlyFirstName',
      };

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

      // Verify in database
      const updatedUser = await userRepository.findOne({
        where: { id: testUser.id },
      });
      expect(updatedUser.firstName).toBe(partialUpdate.firstName);
      expect(updatedUser.lastName).toBe(testUser.lastName);
    });

    it('should update avatar successfully', async () => {
      const avatarUpdate = {
        avatar: 'https://example.com/new-avatar.jpg',
      };

      const response = await request(app.getHttpServer())
        .put('/api/v1/users/me')
        .send(avatarUpdate)
        .expect(200);

      expect(response.body.avatar).toBe(avatarUpdate.avatar);

      // Verify in database
      const updatedUser = await userRepository.findOne({
        where: { id: testUser.id },
      });
      expect(updatedUser.avatar).toBe(avatarUpdate.avatar);
    });

    it('should update date of birth successfully', async () => {
      const dobUpdate = {
        dateOfBirth: '1985-12-25',
      };

      const response = await request(app.getHttpServer())
        .put('/api/v1/users/me')
        .send(dobUpdate)
        .expect(200);

      expect(new Date(response.body.dateOfBirth)).toEqual(new Date(dobUpdate.dateOfBirth));

      // Verify in database
      const updatedUser = await userRepository.findOne({
        where: { id: testUser.id },
      });
      expect(updatedUser.dateOfBirth).toEqual(new Date(dobUpdate.dateOfBirth));
    });

    it('should update gender successfully', async () => {
      const genderUpdate = {
        gender: 'female',
      };

      const response = await request(app.getHttpServer())
        .put('/api/v1/users/me')
        .send(genderUpdate)
        .expect(200);

      expect(response.body.gender).toBe(genderUpdate.gender);

      // Verify in database
      const updatedUser = await userRepository.findOne({
        where: { id: testUser.id },
      });
      expect(updatedUser.gender).toBe(genderUpdate.gender);
    });

    it('should update preferences successfully', async () => {
      const preferencesUpdate = {
        preferences: {
          language: 'es',
          notifications: true,
          autoplay: true,
        },
      };

      const response = await request(app.getHttpServer())
        .put('/api/v1/users/me')
        .send(preferencesUpdate)
        .expect(200);

      expect(response.body.preferences).toEqual(preferencesUpdate.preferences);

      // Verify in database
      const updatedUser = await userRepository.findOne({
        where: { id: testUser.id },
      });
      expect(updatedUser.preferences).toEqual(preferencesUpdate.preferences);
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

    it('should return 400 for invalid date format', async () => {
      const invalidUpdate = {
        dateOfBirth: 'invalid-date',
      };

      const response = await request(app.getHttpServer())
        .put('/api/v1/users/me')
        .send(invalidUpdate)
        .expect(400);

      expect(response.body.message).toContain('dateOfBirth must be a valid ISO 8601 date string');
    });

    it('should return 400 for future date of birth', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const invalidUpdate = {
        dateOfBirth: futureDate.toISOString().split('T')[0],
      };

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

    it('should return 400 for invalid language format', async () => {
      const invalidUpdate = {
        preferences: {
          language: 'invalid-lang-format',
          notifications: true,
          autoplay: false,
        },
      };

      const response = await request(app.getHttpServer())
        .put('/api/v1/users/me')
        .send(invalidUpdate)
        .expect(400);

      expect(response.body.message).toBe('Language must be in ISO 639-1 format (e.g., "en" or "en-US")');
    });

    it('should return 400 for invalid preferences type', async () => {
      const invalidUpdate = {
        preferences: {
          notifications: 'not-a-boolean',
        },
      };

      const response = await request(app.getHttpServer())
        .put('/api/v1/users/me')
        .send(invalidUpdate)
        .expect(400);

      expect(response.body.message).toContain('notifications must be a boolean value');
    });

    it('should return 404 when user not found', async () => {
      // Clear the database to simulate user not found
      await userRepository.clear();

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

  describe('Database transactions and consistency', () => {
    it('should maintain data consistency during updates', async () => {
      const updateData = {
        firstName: 'Consistent',
        lastName: 'Update',
        preferences: {
          language: 'fr',
          notifications: false,
          autoplay: true,
        },
      };

      await request(app.getHttpServer())
        .put('/api/v1/users/me')
        .send(updateData)
        .expect(200);

      // Verify all fields are updated consistently
      const updatedUser = await userRepository.findOne({
        where: { id: testUser.id },
      });

      expect(updatedUser.firstName).toBe(updateData.firstName);
      expect(updatedUser.lastName).toBe(updateData.lastName);
      expect(updatedUser.preferences).toEqual(updateData.preferences);
      expect(updatedUser.updatedAt).not.toEqual(updatedUser.createdAt);
    });

    it('should handle concurrent updates properly', async () => {
      const update1 = { firstName: 'Update1' };
      const update2 = { lastName: 'Update2' };

      // Execute concurrent updates
      const [response1, response2] = await Promise.all([
        request(app.getHttpServer()).put('/api/v1/users/me').send(update1),
        request(app.getHttpServer()).put('/api/v1/users/me').send(update2),
      ]);

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);

      // Verify final state in database
      const finalUser = await userRepository.findOne({
        where: { id: testUser.id },
      });

      // At least one update should be reflected
      expect(
        finalUser.firstName === update1.firstName ||
        finalUser.lastName === update2.lastName
      ).toBe(true);
    });
  });
}); 