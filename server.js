import Hapi from '@hapi/hapi';
import jwt from 'hapi-auth-jwt2';
import config from './config.js';
import { User } from './models.js';

import games from './routes/games.js';
import comments from './routes/comments.js';
import auth from './routes/auth.js';

const validate = async function (decoded) {
	const user = await User.findByPk(decoded);
	if (!user) {
		return { isValid: false };
	}
	console.log(`User ${decoded} did:`);
	return { isValid: true };
};

const validateAdmin = async function (decoded) {
	const user = await User.findByPk(decoded);
	if (!user) {
		return { isValid: false };
	}
	if (!user.admin) {
		return { isValid: false };
	}
	console.log(`Admin ${decoded} did:`);
	return { isValid: true };
};

async function init () {
	const server = new Hapi.server({
		port: config.port,
		host: config.url,
		routes: {
			cors: {
				origin: [
					'*'
				]
			},
		}
	});
	await server.register(jwt);
	const configJWT = {
		key: config.jwt_mdp,
		verifyOptions: { algorithms: [ 'HS256' ] }
	};
	server.auth.strategy('user', 'jwt', {
		...configJWT,
		validate,
	});
	server.auth.strategy('admin', 'jwt', {
		...configJWT,
		validate: validateAdmin,
	});

	server.route([
		...games,
		...comments,
		...auth,
	]);
	await server.start();
	return server;
}

init().then(server => {
	console.log('Server running at:', server.info.uri);
}).catch(err => {
	console.log(err);
});
