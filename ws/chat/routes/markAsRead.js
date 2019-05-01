const debug = require('debug')('es:chat:mark-as-read')
		, isInt = require('validator/lib/isInt')
		, mongoose = require('mongoose');

const markAsRead = (ws, req, message, done) => {
	const { user, booking } = req;
	const sender = (() => {
		if (user.role === 'sales') return 'sales';
		if (user.role === 'admin') return 'sales';
		return user.sub;
	})();
	debug(`READ BY: ${sender}`);
	const delta = {};
	if (isInt(sender)) {
		delta.guide_unread_count = 0;
		delta.guide_last_read = new Date();
	} else if (sender === 'sales') {
		delta.sales_unread_count = 0;
	} else {
		delta.customer_unread_count = 0;
		delta.customer_last_read = new Date();
	}
	const BookingService = mongoose.connection.db.collection('bookingsv2');
	BookingService.update({
		_id: booking._id
	}, {
		$set: delta
	}, done);
};

module.exports = markAsRead;