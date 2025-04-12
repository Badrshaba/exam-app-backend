import Joi from 'joi';

export const signUpSchema = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(20).required(),
    lastName: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};
export const signInSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};
export const setPasswordSchema = {
  body: Joi.object({
    oldPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required(),
  }),
};
