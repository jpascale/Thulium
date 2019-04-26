export default {
	create: {
		stage: __DEV__ ? 'pick-paradigm' : 'pick-paradigm',
		paradigm: 'sql',
		items: __DEV__ ? [{ title: 'users', id: 0}] : []
	}
};