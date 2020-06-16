import { User, Comment } from '../models.js';

async function getGameComment(req, res) {
	return await Comment.findAll({
		where: {gameId: req.query.gameId},
		include: [{model: User, attributes: {exclude: ['password', 'mail', 'firstname', 'lastname']}}],
		order: [['updatedAt', 'DESC']],
	})
}

async function postGameComment(req, res) {
	const {rate, review, gameId} = req.payload;
	const comment = await Comment.findOne({
		where: {
			gameId,
			userId: req.auth.credentials,
		}
	});
	if (comment) {
		return await comment.update({rate, review });
	}
	return await Comment.create({
		gameId,
		userId: req.auth.credentials,
		rate,
		review,
	});
}

export { getGameComment, postGameComment };