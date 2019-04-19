import constants from 'namespace-constants';

export default constants('course', [
	'fetching',
	'fetched',
	'change'
], {
	separator: '/',
	transform: v => v.replace(/ /g, '_').toUpperCase()
});