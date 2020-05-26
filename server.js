import Hapi from '@hapi/hapi';
import jwt from 'hapi-auth-jwt2';
import games from './routes/games.js';
import comments from './routes/comments.js';
import auth from './routes/auth.js';
import config from './config.js';
import { User } from './models.js';

const validate = async function (decoded) {
	const user = await User.findByPk(decoded);
	if (!user) {
		return { isValid: false };
	}
	console.log('User ' + decoded + ' did: ');
	return { isValid: true };
};

async function init () {
	const server = new Hapi.server({
		port: 3000,
		host: config.url,
		routes: {
			payload: {
				multipart: true,
			},
			cors: {
				origin: [
					'*'
				]
			}
		}
	});
	await server.register(jwt);
	server.auth.strategy('jwt', 'jwt',
		{
			key: 'NeverShareYourSecret',
			validate,
			verifyOptions: { algorithms: [ 'HS256' ] }
		});

	server.auth.default('jwt');

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
