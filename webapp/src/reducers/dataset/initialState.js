export default {
	create: {
		stage: __DEV__ ? 'pick-type' : 'pick-type',
		type: 'SQL',
		items: __DEV__ ? [{ title: 'users', id: 0}] : []
	}
};