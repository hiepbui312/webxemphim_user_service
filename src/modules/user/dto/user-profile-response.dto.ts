import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserPreferences } from '../../../interfaces';

export class UserProfileResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
  })
  @Expose()
  username: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
  })
  @Expose()
  lastName: string;

  @ApiProperty({
    description: 'Avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @Expose()
  avatar?: string;

  @ApiProperty({
    description: 'Date of birth',
    example: '1990-01-01',
    required: false,
  })
  @Expose()
  dateOfBirth?: Date;

  @ApiProperty({
    description: 'Gender',
    enum: ['male', 'female', 'other'],
    example: 'male',
    required: false,
  })
  @Expose()
  gender?: 'male' | 'female' | 'other';

  @ApiProperty({
    description: 'User preferences',
    example: {
      language: 'en',
      notifications: true,
      autoplay: false,
    },
  })
  @Expose()
  preferences: UserPreferences;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;
} 