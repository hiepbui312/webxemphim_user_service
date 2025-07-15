import { DataSource } from 'typeorm';
import { User, Gender } from '../../modules/user/entities/user.entity';

export class UserSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: { email: 'test@example.com' },
    });

    if (!existingUser) {
      const testUser = userRepository.create({
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'https://via.placeholder.com/150',
        dateOfBirth: new Date('1990-01-01'),
        gender: Gender.MALE,
        preferences: {
          language: 'en',
          notifications: true,
          autoplay: false,
        },
      });

      await userRepository.save(testUser);
      console.log('Test user seeded successfully');
    } else {
      console.log('Test user already exists');
    }
  }
} 