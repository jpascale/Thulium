import constants from 'namespace-constants';

export default constants('file', [
	'show create modal',
	'close create modal',
	'creating',
	'created',
	'removing',
	'removed',
	'change',
	'autosaving',
	'autosaved',
	'change response'
], {
	separator: '/',
	transform: v => v.replace(/ /g, '_').toUpperCase()
});