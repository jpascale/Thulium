import constants from 'namespace-constants';

export default constants('course', [
	'fetching',
	'fetched',
], {
	separator: '/',
	transform: v => v.replace(/ /g, '_').toUpperCase()
});