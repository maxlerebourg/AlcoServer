import { User, Comment } from '../models.js';

async function getGameComment(req, res) {
	return await Comment.findAll({
		where: {gameId: req.query.gameId},
		include: [{model: User, attributes: {exclude: ['password', 'mail', 'firstname', 'lastname']}}],
		order: [['updatedAt', 'DESC']],
	})
}

async function postGameComment(req, res) {
	console.log(req.query)
	const comment = await Comment.findOne({
		where: {
			gameId: req.query.gameId,
			userId: req.auth.credentials,
		}
	});
	if (comment) {
		return comment.update({
			rate: req.query.rate,
			review: req.query.review,
		})
	} else {
		return Comment.create({
			gameId: req.query.gameId,
			userId: req.auth.credentials,
			rate: req.query.rate,
			review: req.query.review,
		})
	}
}

export { getGameComment, postGameComment };