import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { UpdateProfileRequestDto, Gender } from '../dto/update-profile-request.dto';
import { UserProfileResponseDto } from '../dto/user-profile-response.dto';
import { AuthenticatedRequest } from '../../../interfaces';

describe('UserController', () => {
  let controller: UserController;
  let service: jest.Mocked<UserService>;

  const mockUserResponse: UserProfileResponseDto = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@example.com',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    avatar: null,
    dateOfBirth: new Date('1990-01-01'),
    gender: 'male',
    preferences: {
      language: 'en',
      notifications: true,
      autoplay: false,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRequest: AuthenticatedRequest = {
    user: {
      userId: '550e8400-e29b-41d4-a716-446655440000',
      email: 'test@example.com',
    },
  } as AuthenticatedRequest;

  beforeEach(async () => {
    const mockService = {
      getCurrentProfile: jest.fn(),
      updateProfile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentProfile', () => {
    it('should return current user profile successfully', async () => {
      service.getCurrentProfile.mockResolvedValue(mockUserResponse);

      const result = await controller.getCurrentProfile(mockRequest);

      expect(result).toBe(mockUserResponse);
      expect(service.getCurrentProfile).toHaveBeenCalledWith(mockRequest.user.userId);
    });

    it('should throw NotFoundException when user not found', async () => {
      service.getCurrentProfile.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.getCurrentProfile(mockRequest)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.getCurrentProfile).toHaveBeenCalledWith(mockRequest.user.userId);
    });

    it('should throw BadRequestException for invalid user ID', async () => {
      const invalidRequest = {
        ...mockRequest,
        user: { ...mockRequest.user, userId: '' },
      } as AuthenticatedRequest;
      service.getCurrentProfile.mockRejectedValue(new BadRequestException('User ID is required'));

      await expect(controller.getCurrentProfile(invalidRequest)).rejects.toThrow(
        BadRequestException,
      );
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

    const updatedResponse: UserProfileResponseDto = {
      ...mockUserResponse,
      firstName: 'Updated',
      lastName: 'Name',
      preferences: {
        language: 'vi',
        notifications: false,
        autoplay: true,
      },
    };

    it('should update user profile successfully', async () => {
      service.updateProfile.mockResolvedValue(updatedResponse);

      const result = await controller.updateProfile(mockRequest, updateDto);

      expect(result).toBe(updatedResponse);
      expect(service.updateProfile).toHaveBeenCalledWith(mockRequest.user.userId, updateDto);
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { firstName: 'OnlyFirst' };
      const partialResponse = { ...mockUserResponse, firstName: 'OnlyFirst' };
      
      service.updateProfile.mockResolvedValue(partialResponse);

      const result = await controller.updateProfile(mockRequest, partialUpdate);

      expect(result).toBe(partialResponse);
      expect(service.updateProfile).toHaveBeenCalledWith(mockRequest.user.userId, partialUpdate);
    });

    it('should throw NotFoundException when user not found', async () => {
      service.updateProfile.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.updateProfile(mockRequest, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.updateProfile).toHaveBeenCalledWith(mockRequest.user.userId, updateDto);
    });

    it('should throw BadRequestException for invalid data', async () => {
      service.updateProfile.mockRejectedValue(
        new BadRequestException('Date of birth cannot be in the future'),
      );

      await expect(controller.updateProfile(mockRequest, updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle empty update object', async () => {
      const emptyUpdate = {};
      service.updateProfile.mockResolvedValue(mockUserResponse);

      const result = await controller.updateProfile(mockRequest, emptyUpdate);

      expect(result).toBe(mockUserResponse);
      expect(service.updateProfile).toHaveBeenCalledWith(mockRequest.user.userId, emptyUpdate);
    });

    it('should handle preferences update only', async () => {
      const preferencesUpdate = {
        preferences: {
          language: 'es',
          notifications: true,
          autoplay: true,
        },
      };
      const preferencesResponse = {
        ...mockUserResponse,
        preferences: preferencesUpdate.preferences,
      };

      service.updateProfile.mockResolvedValue(preferencesResponse);

      const result = await controller.updateProfile(mockRequest, preferencesUpdate);

      expect(result).toBe(preferencesResponse);
      expect(service.updateProfile).toHaveBeenCalledWith(
        mockRequest.user.userId,
        preferencesUpdate,
      );
    });

    it('should handle avatar update', async () => {
      const avatarUpdate = {
        avatar: 'https://example.com/new-avatar.jpg',
      };
      const avatarResponse = {
        ...mockUserResponse,
        avatar: avatarUpdate.avatar,
      };

      service.updateProfile.mockResolvedValue(avatarResponse);

      const result = await controller.updateProfile(mockRequest, avatarUpdate);

      expect(result).toBe(avatarResponse);
      expect(service.updateProfile).toHaveBeenCalledWith(mockRequest.user.userId, avatarUpdate);
    });

    it('should handle date of birth update', async () => {
      const dobUpdate = {
        dateOfBirth: new Date('1985-12-25'),
      };
      const dobResponse = {
        ...mockUserResponse,
        dateOfBirth: dobUpdate.dateOfBirth,
      };

      service.updateProfile.mockResolvedValue(dobResponse);

      const result = await controller.updateProfile(mockRequest, dobUpdate);

      expect(result).toBe(dobResponse);
      expect(service.updateProfile).toHaveBeenCalledWith(mockRequest.user.userId, dobUpdate);
    });

    it('should handle gender update', async () => {
      const genderUpdate = {
        gender: Gender.FEMALE,
      };
      const genderResponse = {
        ...mockUserResponse,
        gender: 'female' as const,
      };

      service.updateProfile.mockResolvedValue(genderResponse);

      const result = await controller.updateProfile(mockRequest, genderUpdate);

      expect(result).toBe(genderResponse);
      expect(service.updateProfile).toHaveBeenCalledWith(mockRequest.user.userId, genderUpdate);
    });
  });
}); 