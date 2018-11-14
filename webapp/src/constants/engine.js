import constants from 'namespace-constants';

export default constants('engines', [
	'fetching',
	'fetched',
	'change'
], {
	separator: '/',
	transform: v => v.replace(/ /g, '_').toUpperCase()
});