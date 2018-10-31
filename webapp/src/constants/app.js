import constants from 'namespace-constants';

export default constants('app', [
	'booting',
	'booted',
	'change engine',
	'running',
	'run',
	'query changed'
], {
	separator: '/',
	transform: v => v.replace(/ /g, '_').toUpperCase()
});