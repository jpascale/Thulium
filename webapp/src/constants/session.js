import constants from 'namespace-constants';

export default constants('engines', [
	'start session',
], {
	separator: '/',
	transform: v => v.replace(/ /g, '_').toUpperCase()
});