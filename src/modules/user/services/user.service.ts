import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserRepository } from '../repositories/user.repository';
import { UserProfileResponseDto } from '../dto/user-profile-response.dto';
import { UpdateProfileRequestDto } from '../dto/update-profile-request.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Get current user profile by user ID
   */
  async getCurrentProfile(userId: string): Promise<UserProfileResponseDto> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const user = await this.userRepository.findByUserId(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.transformUserToResponseDto(user);
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    updateData: UpdateProfileRequestDto,
  ): Promise<UserProfileResponseDto> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    // Validate that user exists
    const existingUser = await this.userRepository.findByUserId(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Validate business rules
    await this.validateUpdateData(updateData);

    // Update user profile
    const updatedUser = await this.userRepository.updateProfile(
      userId,
      updateData,
    );

    if (!updatedUser) {
      throw new BadRequestException('Failed to update user profile');
    }

    return this.transformUserToResponseDto(updatedUser);
  }

  /**
   * Get user by email (internal method)
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  /**
   * Transform User entity to UserProfileResponseDto
   */
  private transformUserToResponseDto(user: User): UserProfileResponseDto {
    return plainToClass(UserProfileResponseDto, {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      preferences: user.preferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Validate update data business rules
   */
  private async validateUpdateData(
    updateData: UpdateProfileRequestDto,
  ): Promise<void> {
    // Validate date of birth is not in the future
    if (updateData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(updateData.dateOfBirth);
      
      if (birthDate > today) {
        throw new BadRequestException('Date of birth cannot be in the future');
      }

      // Validate minimum age (13 years old)
      const minAge = 13;
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - minAge);
      
      if (birthDate > minDate) {
        throw new BadRequestException(`User must be at least ${minAge} years old`);
      }
    }

    // Validate preferences if provided
    if (updateData.preferences) {
      const { language, notifications, autoplay } = updateData.preferences;
      
      // Validate language code format
      if (language && !/^[a-z]{2}(-[A-Z]{2})?$/.test(language)) {
        throw new BadRequestException('Language must be in ISO 639-1 format (e.g., "en" or "en-US")');
      }

      // Validate boolean values
      if (notifications !== undefined && typeof notifications !== 'boolean') {
        throw new BadRequestException('Notifications preference must be a boolean');
      }

      if (autoplay !== undefined && typeof autoplay !== 'boolean') {
        throw new BadRequestException('Autoplay preference must be a boolean');
      }
    }

    // Validate avatar URL format
    if (updateData.avatar) {
      try {
        new URL(updateData.avatar);
        // Check if it's a valid image URL (basic check)
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const url = updateData.avatar.toLowerCase();
        const hasValidExtension = imageExtensions.some(ext => url.includes(ext));
        
        if (!hasValidExtension && !url.includes('placeholder') && !url.includes('gravatar')) {
          throw new BadRequestException('Avatar must be a valid image URL');
        }
      } catch {
        throw new BadRequestException('Avatar must be a valid URL');
      }
    }
  }
} 