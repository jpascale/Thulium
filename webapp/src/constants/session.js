import constants from 'namespace-constants';

export default constants('session', [
	'start',
], {
	separator: '/',
	transform: v => v.replace(/ /g, '_').toUpperCase()
});