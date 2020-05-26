import Joi from '@hapi/joi';
import {
	getGamesByCategories, getGamesBySearch, postGame,
} from "../controllers/games.js";

const games = [
	{
		method: 'GET',
		path: '/list/categories',
		handler: getGamesByCategories,
		options: { auth: false },
	},
	{
		method: 'GET',
		path: '/search/game/{name}',
		handler: getGamesBySearch,
		options: {
			auth: false,
			validate: {
				params: Joi.object({
					name: Joi.string().min(2).max(50).required(),
				}),
			},
		},
	},
	{
		method: 'POST',
		path: '/add/game',
		handler: postGame,
		options: {
			auth: 'jwt',
			validate: {
				payload: Joi.object({
					name: Joi.string().min(2).max(50).required(),
					rules: Joi.string().min(10).max(10000).required(),
					preview: Joi.string().min(10).max(1000).required(),
					images: Joi.string().min(1).max(300).required(),
					categoryId: Joi.number().required(),
					multiplayer: Joi.number(),
				}),
			},
		},
	},
];

export default games;