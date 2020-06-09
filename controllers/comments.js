import { User, Comment } from '../models.js';

async function getGameComment(req, res) {
	return Comment.findAll({
		where: {gameId: req.params.gameId},
		include: [{model: User, attributes: {exclude: ['password', 'mail', 'firstname', 'lastname']}}],
		order: [['updatedAt', 'DESC']],
		limit: 3
	})
}

async function postGameComment(req, res) {
	return await Comment.upsert({
			review: req.payload.review,
			rate: req.payload.rate,
			gameId: req.params.gameId,
			userId: req.auth.credentials,
		},
		{
		where: {
			gameId: req.params.gameId,
			userId: req.auth.credentials,
		}
	});
}

export { getGameComment, postGameComment };