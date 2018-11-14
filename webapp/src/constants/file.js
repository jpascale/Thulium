import constants from 'namespace-constants';

export default constants('file', [
	'show create modal',
	'close create modal',
	'creating',
	'created',
	'change',
	'autosaving',
	'autosaved',
], {
	separator: '/',
	transform: v => v.replace(/ /g, '_').toUpperCase()
});