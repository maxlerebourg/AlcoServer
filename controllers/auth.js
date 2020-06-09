import Jwt from 'jsonwebtoken';
import { User, Op } from '../models.js';
import config from '../config.js';

async function login(req, res) {
	const { mail, password } = req.payload;
	const { id, pseudo } = await User.findOne({where: {mail, password}});
	if (id !== undefined) {
		const jwtToken = Jwt.sign(id, config.jwt_mdp, {algorithm: 'HS256'});
		return res.response({
			id,
			pseudo,
			tokenType: 'JWT',
			token: 'Bearer ' + jwtToken,
		});
	} else {
		return res.response({ status: 'bad credentials' });
	}
}

async function register(req, res) {
	const {
		mail, pseudo, password, firstname, lastname,
	} = req.payload;
	const user = await User.findOne({where: {[Op.or]: [{ mail }, { pseudo }]}});
	if (user) return res.response({status: 'Pseudo or mail already taken'});
	try {
		await User.create({ mail, password, firstname, lastname, pseudo, admin: false });
	} catch (err) {
		return res.response({ status: 'error' });
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