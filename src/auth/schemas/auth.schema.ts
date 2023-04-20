import * as Joi from '@hapi/joi';

const partialSignInSchema = {
  userName: Joi.string().required(),
  password: Joi.string().required(),
};

const partialSingUpSchema = {
  email: Joi.string().email().required(),
  fullName: Joi.string().required(),
};

const partialUpdateSchema = {
  id: Joi.string().required(),
};

const signInSchema = Joi.object(partialSignInSchema).options({abortEarly: false,});
const signUpSchema = Joi.object({...partialSignInSchema, ...partialSingUpSchema}).options({abortEarly: false,});
const updateSchema = Joi.object({...partialSignInSchema, ...partialSingUpSchema, ...partialUpdateSchema}).options({abortEarly: false,});
export {signInSchema, signUpSchema, updateSchema};