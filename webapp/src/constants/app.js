import constants from 'namespace-constants';

export default constants('app', [
	'change engine',
	'running',
	'run',
	'query changed'
], {
	separator: '/',
	transform: v => v.replace(/ /g, '_').toUpperCase()
});