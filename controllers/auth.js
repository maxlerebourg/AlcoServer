import Jwt from 'jsonwebtoken';
import { User, Op } from '../models.js';
import config from '../config.js';

async function login(req, res) {
	const { mail, password } = req.payload;
	const user = await User.findOne({where: {mail, password}, raw: true});
	if (user === null) {
		return res.response({ status: 'bad credentials' }).code(400);
	}
	const jwtToken = Jwt.sign(user.id, config.jwt_mdp, {algorithm: 'HS256'});
	return res.response({
		id: user.id,
		pseudo: user.pseudo,
		admin: user.admin,
		token: 'Bearer ' + jwtToken,
	});
}

async function register(req, res) {
	const {
		mail, pseudo, password, firstname, lastname,
	} = req.payload;
	const user = await User.findOne({where: {[Op.or]: [{ mail }, { pseudo }]}});
	if (user) return res.response({status: 'Pseudo or mail already taken'}).code(400);
	try {
		await User.create({ mail, password, firstname, lastname, pseudo, admin: false });
	} catch (err) {
		return res.response({ status: 'error' }).code(400);
	}
	return login(req, res)
}

async function updateNotificationToken(req, res) {
	await User.update(
		{ notification_id: req.params.token },
		{ where: { id: req.auth.credentials } }
	);
	return res.response({ status: 'ok' });
}

export { login, register, updateNotificationToken };