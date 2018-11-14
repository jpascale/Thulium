import constants from 'namespace-constants';

export default constants('file', [
	'show create modal',
	'close create modal',
	'creating',
	'created',
	'change'
], {
	separator: '/',
	transform: v => v.replace(/ /g, '_').toUpperCase()
});