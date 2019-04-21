import constants from 'namespace-constants';

export default constants('course', [
	'fetching',
	'fetched',
	'change',

	'creating exam',
	'created exam'
], {
	separator: '/',
	transform: v => v.replace(/ /g, '_').toUpperCase()
});