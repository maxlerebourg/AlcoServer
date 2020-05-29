import { Category, Game, Op, sequelize } from '../models.js'
import { notifyEveryone } from '../utils/notification.js';
import { validateCategory } from '../utils/schema.js';

async function getSearchGames(search) {
	return Game.findAll({
		where: {
			name: sequelize.where(sequelize.col('name'), 'ILIKE', `%${search}%`),
			status: '200',
		},
		order: ['name']
	});
}

async function getCategoryGames(categoryId) {
	return await Game.findAll({
		where: { status: '200', categoryId: categoryId },
		order: [['name']],
	});
}

async function getCategoriesGames() {
	const categories = await Category.findAll({
		order: [[sequelize.literal('RANDOM()')]],
	});
	for (let i = 0; i < categories.length; i += 1) {
		categories[i].dataValues.games = await categories[i].getGames({
			where: { status: '200' },
			limit: 10,
			raw: true,
		});
	}
	const news = await Game.findAll({
		where: {[Op.or]: [{status: '201'}, {createdAt: {[Op.gte]:new Date().getTime() - 86400000 * 7}}]},
		order: [['createdAt', 'DESC']],
	});
	const twoPlayer = await Game.findAll({
		where: {multiplayer: 2, status: '200'},
	});
	return [
		{ id: 100, name: "Nouveautés", games: news },
		...categories,
		{ id: 101, name: "Deux joueurs", games: twoPlayer },
	];
}

async function getGames(req, res) {
	if (req.query.search) {
		return getSearchGames(req.query.search);
	}
	if (await validateCategory(req) === false) return res.response().code(400);

	if (req.query.categoryId) {
		return getCategoryGames(req.query.categoryId);
	}

	return getCategoriesGames();
}

async function postGame(req, res) {
	const {
		name, rules, preview, images, categoryId, multiplayer
	} = req.payload;
	await notifyEveryone(`nouveau jeu disponible : ${name}`);

	return Game.findOrCreate({
		where: { name },
		defaults: {
			rules, preview, images, categoryId, multiplayer, userId: req.auth.credentials,
		},
	});
}
export { getGames, postGame };
