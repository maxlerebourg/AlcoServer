import { Category, Game, Op, sequelize } from '../models.js'
import { notifyEveryone } from '../utils/notification.js';
import { validateCategory } from '../utils/schema.js';

async function getSearchGames(search) {
	return Game.findAll({
		where: {
			name: sequelize.where(sequelize.col('name'), 'ILIKE', `%${search}%`),
			status: '200',
		},
		order: ['name'],
		raw: true,
	});
}

async function getCategoryGames(categoryId) {
	return await Game.findAll({
		where: { status: '200', categoryId: categoryId },
		order: [['name']],
	});
}

async function getCategoriesGames(limit) {
	const categories = await Category.findAll({
		order: [[sequelize.random()]],
	});
	for (let i = 0; i < categories.length; i += 1) {
		categories[i].dataValues.games = await categories[i].getGames({
			where: { status: '200' },
			limit,
			order: [[sequelize.random()]],
			raw: true,
		});
	}
	const news = await Game.findAll({
		where: {[Op.or]: [{status: '201'}, {createdAt: {[Op.gte]:new Date().getTime() - 86400000 * 7}}]},
		order: [['createdAt', 'DESC']],
		raw: true,
	});
	const twoPlayer = await Game.findAll({
		where: {multiplayer: 2, status: '200'},
		raw: true,
	});
	return [
		{ id: 100, name: "Nouveautés", games: news },
		...categories,
		{ id: 101, name: "Deux joueurs", games: twoPlayer },
	];
}

async function getGames(req, res) {
	const { search, limit, category } = req.query;

	if (search) {
		return getSearchGames(search);
	}

	if (category) {
		if (await validateCategory(req) === false) return res.response().code(400);

		if (req.query.categoryId) {
			return getCategoryGames(req.query.categoryId);
		}
	}

	return getCategoriesGames(limit || 10);
}

async function postGame(req, res) {
	const {
		name, rules, preview, images, categoryId, multiplayer,
	} = req.payload;

	const doublon = await Game.findOne({ where: {name}});
	if (doublon !== null) {
		return res.response({ status: 'name already taken' }).code(400);
	}
	await notifyEveryone(`nouveau jeu disponible : ${name}`);

	return Game.create({
		name, rules, preview, images, multiplayer, categoryId, userId: req.auth.credentials,
	});
}

async function validGame(req, res) {
	console.log(req.payload)
	const { gameId: id, status, name, preview, rules, images, categoryId, mulitplayer } = req.payload;
	return await Game.update({
		status, name, preview, rules, images, categoryId, mulitplayer,
	}, {
		where: {id},
	})
}

export { getGames, postGame, getCategoriesGames, validGame };
