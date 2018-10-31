import constants from 'namespace-constants';

export default constants('auth', [
	'fetching profile',
	'fetched profile',
	'unauthorized',
	'authenticating',
	'authenticated'
], {
	separator: '/',
	transform: v => v.replace(/ /g, '_').toUpperCase()
});