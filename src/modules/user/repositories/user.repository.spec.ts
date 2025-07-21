import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User, Gender } from '../entities/user.entity';
import { UpdateProfileRequestDto } from '../dto/update-profile-request.dto';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockRepository: jest.Mocked<Repository<User>>;

  const mockUser: User = {
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

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      restore: jest.fn(),
      findAndCount: jest.fn(),
      metadata: {
        target: User,
      } as any,
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: UserRepository,
          useFactory: () => {
            const repo = new UserRepository();
            // Inject the mock repository methods
            Object.assign(repo, mockRepository);
            return repo;
          },
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByUserId', () => {
    it('should find user by ID successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await userRepository.findByUserId(mockUser.id);

      expect(result).toBe(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
    });

    it('should return null when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await userRepository.findByUserId('nonexistent-id');

      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
      });
    });

    it('should exclude soft-deleted users', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await userRepository.findByUserId('soft-deleted-id');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'soft-deleted-id' },
      });
    });
  });

  describe('findByEmail', () => {
    it('should find user by email successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await userRepository.findByEmail(mockUser.email);

      expect(result).toBe(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      });
    });

    it('should return null when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await userRepository.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
    });
  });

  describe('updateProfile', () => {
    const updateDto: UpdateProfileRequestDto = {
      firstName: 'Updated',
      lastName: 'Name',
      preferences: {
        language: 'vi',
        notifications: false,
        autoplay: true,
      },
    };

    it('should update user profile successfully', async () => {
      const updatedUser = { ...mockUser, ...updateDto };
      
      // Mock findByUserId calls
      mockRepository.findOne
        .mockResolvedValueOnce(mockUser) // First call to check if user exists
        .mockResolvedValueOnce(updatedUser); // Second call to return updated user
      
      // Mock update operation
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await userRepository.updateProfile(mockUser.id, updateDto);

      expect(result).toEqual(updatedUser);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockRepository.update).toHaveBeenCalledWith(mockUser.id, {
        ...updateDto,
        updatedAt: expect.any(Date),
      });
    });

    it('should return null when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await userRepository.updateProfile('nonexistent-id', updateDto);

      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
      });
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should return null when update affects no rows', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.update.mockResolvedValue({ affected: 0 });

      const result = await userRepository.updateProfile(mockUser.id, updateDto);

      expect(result).toBeNull();
      expect(mockRepository.update).toHaveBeenCalled();
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { firstName: 'OnlyFirst' };
      const partiallyUpdatedUser = { ...mockUser, firstName: 'OnlyFirst' };

      mockRepository.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(partiallyUpdatedUser);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await userRepository.updateProfile(mockUser.id, partialUpdate);

      expect(result).toEqual(partiallyUpdatedUser);
      expect(mockRepository.update).toHaveBeenCalledWith(mockUser.id, {
        ...partialUpdate,
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('softDeleteUser', () => {
    it('should soft delete user successfully', async () => {
      mockRepository.softDelete.mockResolvedValue({ affected: 1 });

      const result = await userRepository.softDeleteUser(mockUser.id);

      expect(result).toBe(true);
      expect(mockRepository.softDelete).toHaveBeenCalledWith(mockUser.id);
    });

    it('should return false when user not found', async () => {
      mockRepository.softDelete.mockResolvedValue({ affected: 0 });

      const result = await userRepository.softDeleteUser('nonexistent-id');

      expect(result).toBe(false);
      expect(mockRepository.softDelete).toHaveBeenCalledWith('nonexistent-id');
    });

    it('should handle undefined affected count', async () => {
      mockRepository.softDelete.mockResolvedValue({ affected: undefined });

      const result = await userRepository.softDeleteUser(mockUser.id);

      expect(result).toBe(false);
    });
  });

  describe('restoreUser', () => {
    it('should restore soft-deleted user successfully', async () => {
      mockRepository.restore.mockResolvedValue({ affected: 1 });

      const result = await userRepository.restoreUser(mockUser.id);

      expect(result).toBe(true);
      expect(mockRepository.restore).toHaveBeenCalledWith(mockUser.id);
    });

    it('should return false when user not found', async () => {
      mockRepository.restore.mockResolvedValue({ affected: 0 });

      const result = await userRepository.restoreUser('nonexistent-id');

      expect(result).toBe(false);
      expect(mockRepository.restore).toHaveBeenCalledWith('nonexistent-id');
    });

    it('should handle undefined affected count', async () => {
      mockRepository.restore.mockResolvedValue({ affected: undefined });

      const result = await userRepository.restoreUser(mockUser.id);

      expect(result).toBe(false);
    });
  });

  describe('findWithPagination', () => {
    const mockUsers = [
      mockUser,
      { ...mockUser, id: 'user2', email: 'user2@example.com' },
    ];

    it('should return paginated users successfully', async () => {
      mockRepository.findAndCount.mockResolvedValue([mockUsers, 2]);

      const result = await userRepository.findWithPagination(1, 10);

      expect(result).toEqual({
        users: mockUsers,
        total: 2,
      });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        order: { createdAt: 'DESC' },
      });
    });

    it('should handle second page pagination', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 2]);

      const result = await userRepository.findWithPagination(2, 1);

      expect(result).toEqual({
        users: [],
        total: 2,
      });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        take: 1,
        skip: 1,
        order: { createdAt: 'DESC' },
      });
    });

    it('should use default pagination values', async () => {
      mockRepository.findAndCount.mockResolvedValue([mockUsers, 2]);

      await userRepository.findWithPagination();

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        order: { createdAt: 'DESC' },
      });
    });

    it('should return empty result when no users found', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);

      const result = await userRepository.findWithPagination(1, 10);

      expect(result).toEqual({
        users: [],
        total: 0,
      });
    });
  });
}); 