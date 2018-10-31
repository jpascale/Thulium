import constants from 'namespace-constants';

export default constants('engines', [
	'fetching',
	'fetched',
], {
	separator: '/',
	transform: v => v.replace(/ /g, '_').toUpperCase()
});