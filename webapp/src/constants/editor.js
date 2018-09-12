import constants from 'namespace-constants';

export default constants('editor', [], {
	separator: '/',
	transform: v => v.replace(/ /g, '_').toUpperCase()
});