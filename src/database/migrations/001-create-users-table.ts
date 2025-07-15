import { MigrationInterface, QueryRunner, Table, Index } from 'typeorm';

export class CreateUsersTable1703087200000 implements MigrationInterface {
  name = 'CreateUsersTable1703087200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'username',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'first_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'avatar',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'date_of_birth',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'gender',
            type: 'enum',
            enum: ['male', 'female', 'other'],
            isNullable: true,
          },
          {
            name: 'preferences',
            type: 'jsonb',
            default: `'{"language": "en", "notifications": true, "autoplay": false}'`,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create index for email field
    await queryRunner.createIndex(
      'users',
      new Index('IDX_USER_EMAIL', ['email']),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the index first
    await queryRunner.dropIndex('users', 'IDX_USER_EMAIL');
    
    // Drop the table
    await queryRunner.dropTable('users');
  }
} 