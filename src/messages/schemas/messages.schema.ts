import * as Joi from '@hapi/joi';

const messageSchema = {
  title: Joi.string().required(),
  content: Joi.string().required(),
};

const messageSchemaCreate = Joi.object(messageSchema).options({abortEarly: false,});
export {messageSchemaCreate};