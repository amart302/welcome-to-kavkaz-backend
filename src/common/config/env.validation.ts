import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().port().default(3001),

  DATABASE_URL: Joi.string().uri().required(),

  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.number().required(),

  FRONTEND_URL: Joi.string().uri().required(),

  ADMIN_EMAIL: Joi.string().email(),
  ADMIN_PASSWORD: Joi.string().min(8),
});
