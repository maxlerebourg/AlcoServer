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
				}),
			},
		},
	},
	{
		method: 'GET',
		path: '/notification_id/{token}',
		handler: updateNotificationToken,
		options: {
			auth: 'jwt',
			validate: {
				params: Joi.object({
					token: Joi.string().min(140).max(160).required,
				}),
			},
		},
	},
];

export default auth