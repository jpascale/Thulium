const debug = require('debug')('es:chat:list-messages')
		, isInt = require('validator/lib/isInt')
		, async = require('async')
		, mongoose = require('mongoose')
		, messageAdapter = require('../messageAdapter');

const listMessages = (ws, req, message, done) => {
	const { booking } = req;

	debug(`list messages for booking ${booking._id} LIMIT=${message.limit} LAST_ID=${message.last_id}`);
	
	const MessageService = mongoose.connection.db.collection('messages')
			, BookingService = mongoose.connection.db.collection('bookingsv2')
			, GuideService = mongoose.connection.db.collection('guidesv2')
			, LeadService = mongoose.connection.db.collection('leadsv2');
	async.auto({
		bookings: cb => {
			BookingService.find({
				guide: booking.guide,
				code: booking.code
			}).project({
				_id: 1
			}).toArray(cb);
		},
		messages: ['bookings', ({ bookings }, cb) => {
			const q = {
				booking: {
					$in: bookings.map(v => v._id)
				}
			};

			if (message.last_id) {
				Object.assign(q, {
					_id: {
						$lt: mongoose.Types.ObjectId(message.last_id)
					}
				});
			}
			MessageService
			.find(q)
			.sort({
				ts: message.reverse ? -1 : 1
			})
			.limit(message.limit || 20)
			.toArray(cb);
		}],
		nicknames: cb => {
			async.parallel({
				customer: next => {
					LeadService.findOne({
						_id: booking.lead
					}, {
						fields: {
							first_name: 1
						}
					}, next);
				},
				guide: next => {
					GuideService.findOne({
						_id: booking.guide
					}, {
						fields: {
							first_name: 1,
							last_name: 1
						}
					}, next);
				}
			}, cb);
		}
	}, (err, { messages, nicknames }) => {
		if (err) {
			console.error(err);
			return;
		}
		const { guide, customer } = nicknames;
		messages.forEach(m => {
			m.nickname = (() => {
				if (m.sender === 'sales') return 'Lupe from Explore-Share.com';
				if (m.sender === 'exploreshare') return 'Explore-Share.com';
				if (isInt(m.sender)) return `${guide.first_name} ${guide.last_name}`;
				return customer.first_name || 'Customer';
			})();
		});
		ws.send(JSON.stringify(messages.reverse().map(messageAdapter)), done);
	});
};

module.exports = listMessages;