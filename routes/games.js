import Joi from '@hapi/joi';
import { getGames, postGame } from "../controllers/games.js";

const games = [
	{
		method: 'GET',
		path: '/games',
		handler: getGames,
		options: {
			auth: false,
			validate: {
				query: Joi.object({
					category: Joi.string().min(2).max(50),
					search: Joi.string().min(2).max(50),
				}),
			},
		},
	},
	{
		method: 'POST',
		path: '/game',
		handler: postGame,
		options: {
			auth: 'user',
			validate: {
				query: Joi.object({
					name: Joi.string().min(2).max(50).required(),
					rules: Joi.string().min(10).max(10000).required(),
					preview: Joi.string().min(10).max(1000).required(),
					images: Joi.string().min(1).max(300).required(),
					categoryId: Joi.string().guid({ version: ['uuidv4'] }).required(),
					multiplayer: Joi.number(),
				}),
			},
		},
	},
];

export default games;