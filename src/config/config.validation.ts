import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // Application Configuration
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production', 'test')
    .required(),
  PORT: Joi.number()
    .port()
    .required(),
  FRONTEND_URL: Joi.string()
    .uri()
    .required(),

  // JWT Configuration
  JWT_SECRET: Joi.string()
    .min(32)
    .required(),
  JWT_EXPIRATION: Joi.string()
    .required(),

  // Database Configuration
  DB_HOST: Joi.string()
    .required(),
  DB_PORT: Joi.number()
    .port()
    .required(),
  DB_USERNAME: Joi.string()
    .required(),
  DB_PASSWORD: Joi.string()
    .required(),
  DB_DATABASE: Joi.string()
    .required(),

  // Logging
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug', 'verbose')
    .required(),

  // Redis Configuration
  REDIS_HOST: Joi.string()
    .required(),
  REDIS_PORT: Joi.number()
    .port()
    .required(),

  // RabbitMQ Configuration
  RABBITMQ_HOST: Joi.string()
    .required(),
  RABBITMQ_PORT: Joi.number()
    .port()
    .required(),
  RABBITMQ_USER: Joi.string()
    .required(),
  RABBITMQ_PASS: Joi.string()
    .required(),
}); 