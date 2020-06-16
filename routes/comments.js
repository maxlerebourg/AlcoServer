import Joi from '@hapi/joi';
import {
	getGameComment, postGameComment,
} from '../controllers/comments.js';

const comments = [
	{
		method: 'GET',
		path: '/comments',
		handler: getGameComment,
		options: {
			auth: false,
			validate: {
				query: Joi.object({
					gameId: Joi.string().guid({ version: ['uuidv4'] }).required(),
				})
			},
		},
	},
	{
		method: 'POST',
		path: '/comment',
		handler: postGameComment,
		options: {
			auth: 'user',
			validate: {
				payload: Joi.object({
					gameId:  Joi.string().guid({ version: ['uuidv4'] }).required(),
					review: Joi.string().min(5).max(500).required(),
					rate: Joi.number().required(),
				}),
			},
		},
	},
];

export default comments;