import Sequelize from 'sequelize';
import config from './config.js';
// import { users, categories, comments, games } from './db.js';

const sequelize = new Sequelize(`postgres://${config.userDB}:${config.mdp}@127.0.0.1:5432/${config.db}`);
sequelize.authenticate();

const Op = Sequelize.Op;
const User = sequelize.define('users', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
	},
	pseudo: { type: Sequelize.STRING },
	firstname: { type: Sequelize.STRING },
	lastname: { type: Sequelize.STRING },
	mail: { type: Sequelize.STRING },
	password: { type: Sequelize.STRING },
	admin: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
	},
	notification_id: { type: Sequelize.STRING },
});

const Category = sequelize.define('categories', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
	},
	name: { type: Sequelize.STRING },
	slug: { type: Sequelize.STRING },
});
const Game = sequelize.define('games', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
	},
	name: { type: Sequelize.STRING },
	preview: { type: Sequelize.TEXT },
	rules: { type: Sequelize.TEXT },
	images: { type: Sequelize.TEXT },
	multiplayer: { type: Sequelize.INTEGER },
	status: {
		type: Sequelize.ENUM('200', '201', '410'),
		defaultValue: '201',
	},
	commentsCount: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
	},
	commentsRate: {
		type: Sequelize.FLOAT,
		defaultValue: 0,
	},
	userId: {
		type: Sequelize.UUID,
		allowNull: false,
		references: {
			model: User,
			key: 'id',
		}
	},
	categoryId: {
		type: Sequelize.UUID,
		allowNull: false,
		references: {
			model: Category,
			key: 'id',
		}
	},
});
const Comment = sequelize.define('comments', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
	},
	rate: { type: Sequelize.INTEGER },
	review: {
		type: Sequelize.TEXT,
		allowNull: true,
	},
	userId: {
		type: Sequelize.UUID,
		allowNull: false,
		references: {
			model: User,
			key: 'id',
		}
	},
	gameId: {
		type: Sequelize.UUID,
		allowNull: false,
		references: {
			model: Game,
			key: 'id',
		}
	},
});


Game.belongsTo(Category);
Game.belongsTo(User);
Game.hasMany(Comment);
Category.hasMany(Game);
Comment.belongsTo(User);
Comment.belongsTo(Game);

// (async () => {
// 	await User.sync({ force: true });
//
// 	await Category.sync({ force: true });
//
// 	await Game.sync({ force: true });
//
// 	await Comment.sync({ force: true });
//
// 	await sequelize.query(`
// 		create or replace function update_games_comments()
// 		returns trigger as $$
// 		begin
// 			update games set
// 			"commentsCount" = "c"."comments_count",
// 			"commentsRate" = "c"."comments_rate"
// 			from (select "comments"."gameId", count("comments"."rate") as comments_count, avg("comments"."rate") as comments_rate from comments where "comments"."gameId"=new."gameId" group by "comments"."gameId") as "c"
// 			where "c"."gameId" = "games"."id";
// 			return new;
// 		end;
// 		$$ language 'plpgsql';
// 	`);
// 	await sequelize.query(`
// 		create trigger trigger_update_games_comment
// 		after insert or update on comments
// 		for each row
// 		execute procedure update_games_comments();
// 	`);
// 	const usersObject = new Array(categories.length);
// 	for (let i = 0; i < users.length; i += 1) {
// 		usersObject[i] = await User.create({
// 			...users[i],
// 			id: undefined,
// 		}, { raw: true });
// 	}
//
// 	const categoriesObject = new Array(categories.length);
// 	for (let i = 0; i < categories.length; i += 1) {
// 		categoriesObject[i] = await Category.create({
// 			...categories[i],
// 			id: undefined,
// 		}, { raw: true });
// 	}
//
// 	const gamesObject = new Array(games.length);
// 	for (let i = 0; i < games.length; i += 1) {
// 		const { visible } = games[i];
// 		gamesObject[i] = await Game.create({
// 			...games[i],
// 			id: undefined,
// 			visible: undefined,
// 			status: (visible === '1' && '200') || (visible === '0' && '201') || '410',
// 			userId: usersObject[+games[i].userId - 1].id,
// 			categoryId: categoriesObject[+games[i].categoryId - 1].id,
// 		}, { raw: true });
// 	}
//
// 	const commentsObject = new Array(comments.length);
// 	for (let i = 0; i < comments.length; i += 1) {
// 		commentsObject[i] = await Comment.create({
// 			...comments[i],
// 			id: undefined,
// 			userId: usersObject[+comments[i].userId - 1].id,
// 			gameId: gamesObject[+comments[i].gameId - 1].id,
// 		});
// 	}
// })();

export { Op, User, Category, Game, Comment, sequelize };

