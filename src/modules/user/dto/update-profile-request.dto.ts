import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
  IsObject,
  IsBoolean,
  IsUrl,
  MinLength,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export class UserPreferencesDto {
  @ApiProperty({
    description: 'Preferred language',
    example: 'en',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(5)
  language?: string;

  @ApiProperty({
    description: 'Enable notifications',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  notifications?: boolean;

  @ApiProperty({
    description: 'Enable autoplay',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  autoplay?: boolean;
}

export class UpdateProfileRequestDto {
  @ApiProperty({
    description: 'First name',
    example: 'John',
    required: false,
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  firstName?: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
    required: false,
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  lastName?: string;

  @ApiProperty({
    description: 'Avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(500)
  avatar?: string;

  @ApiProperty({
    description: 'Date of birth in ISO format',
    example: '1990-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  dateOfBirth?: Date;

  @ApiProperty({
    description: 'Gender',
    enum: Gender,
    example: Gender.MALE,
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({
    description: 'User preferences',
    type: UserPreferencesDto,
    required: false,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UserPreferencesDto)
  preferences?: UserPreferencesDto;
} 