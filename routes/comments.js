import Joi from '@hapi/joi';
import {
	getGameComment, postGameComment,
} from "../controllers/comments.js";

const validateId = Joi.object({ id: Joi.number().required() });

const comments = [
	{
		method: 'GET',
		path: '/comments/game/{id}',
		handler: getGameComment,
		options: {
			auth: false,
			validate: {
				params: validateId,
			},
		},
	},
	{
		method: 'POST',
		path: '/comment/game/{id}',
		handler: postGameComment,
		options: {
			auth: 'jwt',
			validate: {
				params: validateId,
				payload: Joi.object({
					review: Joi.string().min(5).max(500).required(),
					rate: Joi.number().required(),
				}),
			},
		},
	},
];

export default comments;