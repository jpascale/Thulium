import constants from 'namespace-constants';

export default constants('auth', [
	'fetching profile',
	'fetched profile',
	'unauthorized',
	'authenticating',
	'authenticated',
	'logging in',
	'logged in',
	'logout'
], {
	separator: '/',
	transform: v => v.replace(/ /g, '_').toUpperCase()
});