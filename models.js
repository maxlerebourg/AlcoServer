import Sequelize from 'sequelize';
import config from './config.js';

const sequelize = new Sequelize(`mysql://${config.userDB}:${config.mdp}@127.0.0.1:3306/${config.db}`);
sequelize.authenticate();

const Op = Sequelize.Op;
const Game = sequelize.define('games', {
	name: {type: Sequelize.STRING},
	preview: {type: Sequelize.TEXT},
	rules: {type: Sequelize.TEXT},
	images: {type: Sequelize.TEXT},
	visible: {type: Sequelize.BOOLEAN},
	multiplayer: {type: Sequelize.INTEGER},
});
const User = sequelize.define('users', {
	pseudo: {type: Sequelize.STRING},
	firstname: {type: Sequelize.STRING},
	lastname: {type: Sequelize.STRING},
	mail: {type: Sequelize.STRING},
	password: {type: Sequelize.STRING},
	admin: {type: Sequelize.BOOLEAN},
	notification_id: {type: Sequelize.STRING},
});
const Category = sequelize.define('categories', {
	name: {type: Sequelize.STRING},
});
const Comment = sequelize.define('comments', {
	rate: {type: Sequelize.INTEGER},
	review: {type: Sequelize.TEXT},
});


Game.belongsTo(Category);
Category.hasMany(Game);
Game.belongsTo(User);
Comment.belongsTo(User);
Comment.belongsTo(Game);
Game.hasMany(Comment);

export { Op, User, Category, Game, Comment, sequelize };
