import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { User, Gender } from '../entities/user.entity';
import { UpdateProfileRequestDto } from '../dto/update-profile-request.dto';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;

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
    const mockRepository = {
      findByUserId: jest.fn(),
      findByEmail: jest.fn(),
      updateProfile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentProfile', () => {
    it('should return user profile successfully', async () => {
      repository.findByUserId.mockResolvedValue(mockUser);

      const result = await service.getCurrentProfile(mockUser.id);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        avatar: mockUser.avatar,
        dateOfBirth: mockUser.dateOfBirth,
        gender: mockUser.gender,
        preferences: mockUser.preferences,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
      expect(repository.findByUserId).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw BadRequestException when userId is empty', async () => {
      await expect(service.getCurrentProfile('')).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.findByUserId).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      repository.findByUserId.mockResolvedValue(null);

      await expect(service.getCurrentProfile('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findByUserId).toHaveBeenCalledWith('nonexistent-id');
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
      repository.findByUserId.mockResolvedValue(mockUser);
      repository.updateProfile.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(mockUser.id, updateDto);

      expect(result.firstName).toBe(updateDto.firstName);
      expect(result.lastName).toBe(updateDto.lastName);
      expect(result.preferences).toEqual(updateDto.preferences);
      expect(repository.findByUserId).toHaveBeenCalledWith(mockUser.id);
      expect(repository.updateProfile).toHaveBeenCalledWith(mockUser.id, updateDto);
    });

    it('should throw BadRequestException when userId is empty', async () => {
      await expect(service.updateProfile('', updateDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.findByUserId).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      repository.findByUserId.mockResolvedValue(null);

      await expect(service.updateProfile('nonexistent-id', updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findByUserId).toHaveBeenCalledWith('nonexistent-id');
      expect(repository.updateProfile).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when update fails', async () => {
      repository.findByUserId.mockResolvedValue(mockUser);
      repository.updateProfile.mockResolvedValue(null);

      await expect(service.updateProfile(mockUser.id, updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for future date of birth', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      
      const invalidDto = { ...updateDto, dateOfBirth: futureDate };
      repository.findByUserId.mockResolvedValue(mockUser);

      await expect(service.updateProfile(mockUser.id, invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for underage user', async () => {
      const recentDate = new Date();
      recentDate.setFullYear(recentDate.getFullYear() - 10); // 10 years old
      
      const invalidDto = { ...updateDto, dateOfBirth: recentDate };
      repository.findByUserId.mockResolvedValue(mockUser);

      await expect(service.updateProfile(mockUser.id, invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid language format', async () => {
      const invalidDto = {
        ...updateDto,
        preferences: { ...updateDto.preferences, language: 'invalid-lang' },
      };
      repository.findByUserId.mockResolvedValue(mockUser);

      await expect(service.updateProfile(mockUser.id, invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid avatar URL', async () => {
      const invalidDto = { ...updateDto, avatar: 'not-a-url' };
      repository.findByUserId.mockResolvedValue(mockUser);

      await expect(service.updateProfile(mockUser.id, invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should accept valid avatar URLs', async () => {
      const validUrls = [
        'https://example.com/avatar.jpg',
        'https://via.placeholder.com/150',
        'https://gravatar.com/avatar/hash',
      ];

      repository.findByUserId.mockResolvedValue(mockUser);
      
      for (const avatar of validUrls) {
        const validDto = { ...updateDto, avatar };
        const updatedUser = { ...mockUser, ...validDto };
        repository.updateProfile.mockResolvedValue(updatedUser);

        await expect(service.updateProfile(mockUser.id, validDto)).resolves.toBeDefined();
      }
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      repository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.findByEmail(mockUser.email);

      expect(result).toBe(mockUser);
      expect(repository.findByEmail).toHaveBeenCalledWith(mockUser.email);
    });

    it('should return null when user not found', async () => {
      repository.findByEmail.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(repository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    });
  });
}); 