import constants from 'namespace-constants';

export default constants('app', [
    'change engine',
], {
    separator: '/',
    transform: function (v) {
        return v.replace(/ /g, '_').toUpperCase();
    }
});