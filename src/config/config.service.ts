import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: NestConfigService) {}

  // Application Configuration
  get nodeEnv(): string {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    if (!nodeEnv) {
      throw new Error('NODE_ENV environment variable is required');
    }
    return nodeEnv;
  }

  get port(): number {
    const port = this.configService.get<string>('PORT');
    if (!port) {
      throw new Error('PORT environment variable is required');
    }
    const portNumber = parseInt(port, 10);
    if (isNaN(portNumber)) {
      throw new Error('PORT must be a valid number');
    }
    return portNumber;
  }

  get frontendUrl(): string {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    if (!frontendUrl) {
      throw new Error('FRONTEND_URL environment variable is required');
    }
    return frontendUrl;
  }

  // JWT Configuration
  get jwtSecret(): string {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required');
    }
    if (jwtSecret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long');
    }
    return jwtSecret;
  }

  get jwtExpiration(): string {
    const jwtExpiration = this.configService.get<string>('JWT_EXPIRATION');
    if (!jwtExpiration) {
      throw new Error('JWT_EXPIRATION environment variable is required');
    }
    return jwtExpiration;
  }

  // Database Configuration
  get dbHost(): string {
    const dbHost = this.configService.get<string>('DB_HOST');
    if (!dbHost) {
      throw new Error('DB_HOST environment variable is required');
    }
    return dbHost;
  }

  get dbPort(): number {
    const dbPort = this.configService.get<string>('DB_PORT');
    if (!dbPort) {
      throw new Error('DB_PORT environment variable is required');
    }
    const portNumber = parseInt(dbPort, 10);
    if (isNaN(portNumber)) {
      throw new Error('DB_PORT must be a valid number');
    }
    return portNumber;
  }

  get dbUsername(): string {
    const dbUsername = this.configService.get<string>('DB_USERNAME');
    if (!dbUsername) {
      throw new Error('DB_USERNAME environment variable is required');
    }
    return dbUsername;
  }

  get dbPassword(): string {
    const dbPassword = this.configService.get<string>('DB_PASSWORD');
    if (!dbPassword) {
      throw new Error('DB_PASSWORD environment variable is required');
    }
    return dbPassword;
  }

  get dbDatabase(): string {
    const dbDatabase = this.configService.get<string>('DB_DATABASE');
    if (!dbDatabase) {
      throw new Error('DB_DATABASE environment variable is required');
    }
    return dbDatabase;
  }

  // Logging
  get logLevel(): string {
    const logLevel = this.configService.get<string>('LOG_LEVEL');
    if (!logLevel) {
      throw new Error('LOG_LEVEL environment variable is required');
    }
    return logLevel;
  }

  // Redis Configuration
  get redisHost(): string {
    const redisHost = this.configService.get<string>('REDIS_HOST');
    if (!redisHost) {
      throw new Error('REDIS_HOST environment variable is required');
    }
    return redisHost;
  }

  get redisPort(): number {
    const redisPort = this.configService.get<string>('REDIS_PORT');
    if (!redisPort) {
      throw new Error('REDIS_PORT environment variable is required');
    }
    const portNumber = parseInt(redisPort, 10);
    if (isNaN(portNumber)) {
      throw new Error('REDIS_PORT must be a valid number');
    }
    return portNumber;
  }

  // RabbitMQ Configuration
  get rabbitmqHost(): string {
    const rabbitmqHost = this.configService.get<string>('RABBITMQ_HOST');
    if (!rabbitmqHost) {
      throw new Error('RABBITMQ_HOST environment variable is required');
    }
    return rabbitmqHost;
  }

  get rabbitmqPort(): number {
    const rabbitmqPort = this.configService.get<string>('RABBITMQ_PORT');
    if (!rabbitmqPort) {
      throw new Error('RABBITMQ_PORT environment variable is required');
    }
    const portNumber = parseInt(rabbitmqPort, 10);
    if (isNaN(portNumber)) {
      throw new Error('RABBITMQ_PORT must be a valid number');
    }
    return portNumber;
  }

  get rabbitmqUser(): string {
    const rabbitmqUser = this.configService.get<string>('RABBITMQ_USER');
    if (!rabbitmqUser) {
      throw new Error('RABBITMQ_USER environment variable is required');
    }
    return rabbitmqUser;
  }

  get rabbitmqPass(): string {
    const rabbitmqPass = this.configService.get<string>('RABBITMQ_PASS');
    if (!rabbitmqPass) {
      throw new Error('RABBITMQ_PASS environment variable is required');
    }
    return rabbitmqPass;
  }

  // Helper Methods
  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }
} 