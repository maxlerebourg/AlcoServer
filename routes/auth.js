import Joi from "@hapi/joi";
import { login, register, updateNotificationToken } from '../controllers/auth.js';

const auth = [
	{
		method: 'POST',
		path: '/login',
		handler: login,
		options: {
			auth: false,
			validate: {
				payload: Joi.object({
					mail: Joi.string().email().required(),
					password: Joi.string().min(2).max(20).required(),
					token: Joi.string(),
				}),
			},
		},
	},
	{
		method: 'POST',
		path: '/register',
		handler: register,
		options: {
			auth: false,
			validate: {
				payload: Joi.object({
					mail: Joi.string().email(),
					password: Joi.string().min(2).max(100).required(),
					firstname: Joi.string().min(2).max(100).required(),
					lastname: Joi.string().min(2).max(100).required(),
					pseudo: Joi.string().min(2).max(50).required(),
					token: Joi.string(),
				}),
			},
		},
	},
	{
		method: 'GET',
		path: '/notification',
		handler: updateNotificationToken,
		options: {
			auth: 'user',
			validate: {
				query: Joi.object({
					token: Joi.string().min(140).max(160).required,
				}),
			},
		},
	},
];

export default auth