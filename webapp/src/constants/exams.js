import constants from 'namespace-constants';

export default constants('exam', [
	'creating',
	'created',

	'set exam mode',

	'submitting',
	'submitted',
], {
	separator: '/',
	transform: v => v.replace(/ /g, '_').toUpperCase()
});