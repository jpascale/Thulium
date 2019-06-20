import constants from 'namespace-constants';

export default constants('app', [
	'booting',
	'booted',
	'running',
	'run',
	'run failed',
	'query changed',
	'change text',
	'toggle task',
	'notify',
	'close notification'
], {
	separator: '/',
	transform: v => v.replace(/ /g, '_').toUpperCase()
});
