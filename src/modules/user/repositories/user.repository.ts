import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateProfileRequestDto } from '../dto/update-profile-request.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  /**
   * Find user by ID, excluding soft-deleted users
   */
  async findByUserId(userId: string): Promise<User | null> {
    return this.findOne({
      where: { id: userId },
    });
  }

  /**
   * Find user by email, excluding soft-deleted users
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({
      where: { email },
    });
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    updateData: UpdateProfileRequestDto,
  ): Promise<User | null> {
    // First check if user exists
    const user = await this.findByUserId(userId);
    if (!user) {
      return null;
    }

    // Update the user
    const updateResult = await this.update(userId, {
      ...updateData,
      updatedAt: new Date(),
    });

    if (updateResult.affected === 0) {
      return null;
    }

    // Return updated user
    return this.findByUserId(userId);
  }

  /**
   * Soft delete user
   */
  async softDeleteUser(userId: string): Promise<boolean> {
    const result = await this.softDelete(userId);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Restore soft-deleted user
   */
  async restoreUser(userId: string): Promise<boolean> {
    const result = await this.restore(userId);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Find all users with pagination, excluding soft-deleted users
   */
  async findWithPagination(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
    });

    return { users, total };
  }
} 