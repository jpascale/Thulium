const messageAdapter = m => ({
	_sender: {
		userId: m.sender,
		nickname: m.nickname
	},
	messageId: m._id.toString(),
	message: m.content,
	createdAt: +m.ts
});

module.exports = messageAdapter;