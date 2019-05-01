const _ = require('lodash')
		, async = require('async')
		, mongoose = require('mongoose')
		, isInt = require('validator/lib/isInt')
		, debug = require('debug')('es:chat:sent-message')
		, redis = require('redis')
		, messageAdapter = require('../messageAdapter')
		, agenda = require('../../scheduler/agenda')
		, Env = require('../../util/env')
		, { YOU_HAVE_UNREAD_MESSAGES } = require('../../scheduler/notifications/youHaveUnreadMessages')
		, { UNANSWERED_MESSAGE } = require('../../scheduler/notifications/unansweredMessage')
		, { State } = require('../../services/booking/constants')
		, Slack = require('../../slack');

const pub = redis.createClient({
	host: process.env.REDIS_HOST,
	password: process.env.REDIS_PASSWORD
});

const censorPhone = s => s.replace(/\+?\(?\d(\d[\(\)\s]*){6,}/,'******');
const censorEmail = email => email.replace(/[\w.-]+[\W\s_]*@[\W\s_]*[\w.-]*[\W\s_]*\.[\W\s_]*[a-zA-Z]{2,4}/, '*****@*****.***');

const censorMessage = message => censorPhone(censorEmail(message));

const sendMessage = ({ user, booking, message }, done) => {
	const sender = (() => {
		if (user.role === 'sales') return 'sales';
		if (user.role === 'admin') return 'sales';
		return user.sub;
	})();
	const targets = _.without([booking.guide.toString(), booking.lead.toString(), 'sales'], sender);
	debug(`MESSAGE FROM: ${sender} TO: ${targets.join(', ')}`);

	const MessageService = mongoose.connection.db.collection('messages')
			, SessionService = mongoose.connection.db.collection('sessions')
			, UserService = mongoose.connection.db.collection('users')
			, BookingService = mongoose.connection.db.collection('bookingsv2');

	async.auto({
		censorMessage: next => {
			debug('censoring message');
			BookingService.findOne({ _id: booking._id }, (err, booking) => {
				if (err) return next(err);
				if (!booking) return next('booking does not exist');
				if (booking.state === State.PAID || booking.state === State.COMPLETED) {
					return next(null, message.content);
				}
				const content = (() => {
					if (sender === 'sales') return message.content;
					return censorMessage(message.content);
				})();
				/// Slack notification is sent in the background
				next(null, content);
				if (content === message.content) return;
				debug('Sending censor notification to Slack');
				UserService.findOne({ _id: booking.admin }, (err, admin) => {
					if (err) {
						return console.error(err);
					}
					if (!admin) return;
					Slack.censorship.sendNotification(`
:oncoming_police_car: New censored message from ${user.role === 'guide' ? 'the guide' : 'a customer'}!
*Booking:* ${booking.code}
*Admin:* ${admin.first_name} ${admin.last_name}
*Original message:* ${message.content}
					`);
				});
			});
		},
		message: ['censorMessage', ({ censorMessage }, next) => {
			debug('storing message: ' + censorMessage);
			const m = {
				sender,
				booking: booking._id,
				ts: new Date(),
				content: censorMessage
			};
			MessageService.insertOne(m, (err, r) => {
				if (err) return next(err);
				m._id = r.insertedId;
				m.ts = +m.ts;
				return next(null, m);
			});
		}],
		sessions: next => {
			debug('fetching existing sessions');
			SessionService.find({
				owner: {
					$in: targets
				},
				booking: booking._id
			}).toArray(next);
		},
		unreadCounts: ['message', (results, next) => {
			const delta = {
				guide_unread_count: 0,
				sales_unread_count: 0,
				customer_unread_count: 0
			};
			if (isInt(sender)) {
				delta.sales_unread_count = 1;
				delta.customer_unread_count = 1;
			} else if (sender === 'sales') {
				delta.customer_unread_count = 1;
			} else if (sender === 'exploreshare') {
				delta.guide_unread_count = 1;
				delta.sales_unread_count = 1;
				delta.customer_unread_count = 1;
			} else {
				delta.guide_unread_count = 1;
				delta.sales_unread_count = 1;
			}
			BookingService.findOneAndUpdate({
				_id: booking._id
			}, {
				$inc: delta,
				$set: {
					last_message: results.message.content,
					last_message_at: message.ts || new Date(),
					last_message_by: (() => {
						if (isInt(sender)) return 'guide';
						if (sender === 'sales') return 'sales';
						return 'customer'
					})(),
				}
			}, {
				returnOriginal: false
			}, next);
		}],
		unreadMessagesNotification: ['message', 'unreadCounts', ({ unreadCounts }, next) => {
			const { last_message_by }  = unreadCounts.value;
			if (last_message_by === 'exploreshare') return cb();
			agenda.schedule(Env.select({
				development: 'in 1 minute',
				default: 'in 5 minutes'
			}), YOU_HAVE_UNREAD_MESSAGES, {
				id: booking._id,
				check_for: (() => {
					if (last_message_by === 'customer') return 'guide';
					return 'customer';
				})()
			});
			if (last_message_by === 'guide') {
				agenda.schedule(Env.select({
					development: 'in 5 minutes',
					default: 'in 48 hours'
				}), UNANSWERED_MESSAGE, { id: booking._id });
			}
			next();
		}],
		salesWebhook: ['message', 'unreadCounts', ({ unreadCounts }, next) => {
			if (sender === 'sales') return next();
			if (sender === 'exploreshare') return next();
			const { sales_unread_count, last_message_by, last_message }  = unreadCounts.value;
			if (sales_unread_count <= 0) return next();
			async.waterfall([
				cb => {
					BookingService.aggregate([{
						$match: {
							_id: booking._id
						}
					}, {
						$lookup: {
							from: 'tripsv2',
							localField: 'trip',
							foreignField: '_id',
							as: 'trip'
						}
					}, {
						$lookup: {
							from: 'leadsv2',
							localField: 'lead',
							foreignField: '_id',
							as: 'lead'
						}
					}, {
						$lookup: {
							from: 'guidesv2',
							localField: 'guide',
							foreignField: '_id',
							as: 'guide'
						}
					}, {
						$lookup: {
							from: 'users',
							localField: 'admin',
							foreignField: '_id',
							as: 'admin'
						}
					}, {
						$project: {
							code: 1,
							trip: { $arrayElemAt: ['$trip', 0] },
							lead: { $arrayElemAt: ['$lead', 0] },
							guide: { $arrayElemAt: ['$guide', 0] },
							admin: { $arrayElemAt: ['$admin', 0] },
						}
					}]).toArray(cb);
        },
        ([booking], cb) => {
          if (!booking) return cb();
          const { admin, lead, guide, trip } = booking;
          Slack.chat.sendNotification({
						text: `👋 ${admin ? `_${admin.first_name} ${admin.last_name}_.` : ''} You have ${sales_unread_count} unread messages in *${booking.code}*
*Last message by*: ${last_message_by === 'customer' ? `📝 Customer ${lead.first_name || ''} ${lead.last_name || ''} <${lead.email}>` : `👨‍🌾 Guide ${guide.first_name} ${guide.last_name}`}
*Last message*: ${last_message}
*Trip*: ${trip.title} ${trip.link}

➡️ Check it out in: ${Env.select({
  production: `https://la2.explore-share.com/leadapp/home/booking/${booking._id}`,
  stage: `https://la2-staging.explore-share.com/leadapp/home/booking/${booking._id}`,
  development: `http://localhost:3010/leadapp/home/booking/${booking._id}`
})}`
					}, cb);
        }
      ], next);
		}]
	}, (err, { message: createdMessage, sessions }) => {
		if (err) {
			return done(err);
		}
		const onlineTargets = sessions.map(s => s.uid);
		if (onlineTargets.length) {
			debug('publishing');
			pub.publish('sent-message', JSON.stringify({
				message: createdMessage,
				targets: onlineTargets
			}));
		}
		done(null, {
			message: createdMessage,
			sessions
		});
	});
};

const onMessageSent = (ws, req, message, done) => {
	const { user, booking } = req;
	sendMessage({
		user,
		booking,
		message
	}, (err, { message: createdMessage, sessions }) => {
		if (err) {
			return done(err);
		}
		ws.send(JSON.stringify(messageAdapter(createdMessage)), done);
	});
};

module.exports = {
	handler: onMessageSent,
	sendMessage,
	pub
};