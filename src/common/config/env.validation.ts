import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().port().default(3001),

  DATABASE_URL: Joi.string().uri().required(),

  FRONTEND_URL: Joi.string().uri().required(),
});
