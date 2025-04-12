import Joi from 'joi';

export const signUpSchema = {
  body: Joi.object({
    username: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    age: Joi.number().min(18).max(100).required(),
    phoneNumbers: Joi.array(),
    addresses: Joi.array(),
  }),
};
