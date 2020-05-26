import fetch from 'node-fetch';
import config from '../config.js';
import { User, Op } from '../models.js';

async function notifyAdmin(text) {
	const admin = await User.findOne({where: {admin: true}});
	const fcm_send = {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `key=${config.fcm_notif}`,
		},
		body: JSON.stringify({
			notification: {
				title: 'Notif Admin',
				body: text,
			},
			to: admin.notification_id,
		}),
	};
	fetch('https://fcm.googleapis.com/fcm/send', fcm_send);
}

async function notifyEveryone(text) {
	const users = await User.findAll({ where: { notification_id: { [Op.ne]: null}, admin: true }});
	const fcm_send = {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `key=${config.fcm_notif}`,
		},
		body: JSON.stringify({
			notification: {
				title: 'Nouveau jeu disponible',
				body: text,
			},
			registration_ids: users.map(user => user.notification_id),
		}),
	};
	fetch('https://fcm.googleapis.com/fcm/send', fcm_send);
}

export { notifyAdmin, notifyEveryone };