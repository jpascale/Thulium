export default {
	create: {
		stage: __DEV__ ? 'upload-datasets' : 'pick-type',
		type: 'SQL',
		items: __DEV__ ? [{ title: 'users', id: 0}] : []
	}
};