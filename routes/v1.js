import { getGames, getCategoriesGames } from '../controllers/games.js';

const v1 = [
	{
		method: 'GET',
		path: '/search/game/{name}',
		handler: async (req, res) => {
			req.query.search = req.params.name;
			const games = await getGames(req, res);
			for (let j = 0; j < games.length; j += 1) {
				games[j].comments = {
					rate: games[j].commentsRate,
					comments: games[j].commentsCount,
				};
				delete games[j].commentsRate;
				delete games[j].commentsCount;
			}
			return games;
		},
		options: {
			auth: false,
		},
	},
	{
		method: 'GET',
		path: '/list/categories',
		handler: async (req, res) => {
			const categories = await getCategoriesGames();
			for (let i = 0; i < categories.length; i += 1) {
				if (categories[i].games) {
					for (let j = 0; j < categories[i].games.length; j += 1) {
						categories[i].games[j].comments = {
							rate: categories[i].games[j].commentsRate,
							comments: categories[i].games[j].commentsCount,
						};
						delete categories[i].games[j].commentsRate;
						delete categories[i].games[j].commentsCount;
					}
				} else {
					for (let j = 0; j < categories[i].dataValues.games.length; j += 1) {
						categories[i].dataValues.games[j].comments = {
							rate: categories[i].dataValues.games[j].commentsRate,
							comments: categories[i].dataValues.games[j].commentsCount,
						};
						delete categories[i].dataValues.games[j].commentsRate;
						delete categories[i].dataValues.games[j].commentsCount;
					}
				}
			}
			return categories;
		},
		options: {
			auth: false,
		},
	},
];

export default v1;