import { Category, Comment, Game, Op, sequelize } from '../models.js'
import { notifyAdmin, notifyEveryone } from '../utils/notification.js';

const includeComment = {
	required: false,
	model: Comment,
	attributes: [
		[Comment.sequelize.fn('AVG', Comment.sequelize.col('rate')), 'rate'],
		[Comment.sequelize.fn('COUNT', Comment.sequelize.col('rate')), 'comments'],
	],
};

async function getGamesByCategories(req, res) {
	const games = await Category.findAll({
		include: [{
			model: Game,
			where: {visible: true},
			include: includeComment,
		}],
		order: [[sequelize.literal('RAND()')]],
		group: ['gameId', 'games.id'],
	});
	let news = await Game.findAll({
		where: {[Op.or]: [{visible: false}, {updatedAt: {[Op.gte]:new Date().getTime() - 86400000 * 7}}]},
		order: [['createdAt', 'DESC']],
		include: includeComment,
		group: ['gameId', 'id'],
	});
	let twoPlayer = await Game.findAll({
		where: {multiplayer: 2, visible: true},
		order: [['createdAt', 'DESC']],
		include: includeComment,
		group: ['gameId', 'id'],
	});
	return res.response([
		{ id: 100, name: "Nouveautés", games: news },
		...games,
		{ id: 101, name: "Deux joueurs", games: twoPlayer },
	]);
}

async function getGamesBySearch(req, res) {
	return Game.findAll({
		where: {
			name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', `%${req.params.name}%`),
			visible: true,
		},
		include: includeComment,
		group: ['gameId', 'id'],
		order: ['name']
	});
}

async function postGame(req, res) {
	const {
		name, rules, preview, images, categoryId, multiplayer
	} = req.payload;
	await notifyEveryone(`nouveau jeu disponible : ${name}`);

	return Game.findOrCreate({
		where: { name },
		defaults: {
			rules, preview, images, categoryId, multiplayer,
			visible: false,
			userId: req.auth.credentials,
		},
	});
}
export { getGamesByCategories, getGamesBySearch, postGame };
