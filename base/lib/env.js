const { hasOwnProperty } = Object.prototype;

const select = (envs) => {
	if (hasOwnProperty.call(envs, process.env.NODE_ENV)) return envs[process.env.NODE_ENV];
	if (hasOwnProperty.call(envs, 'default')) return envs.default;
};

const iif = (env, fn) => {
	if (hasOwnProperty.call(envs, process.env.NODE_ENV)) return fn();
};

module.exports = {
	select,
	iif
};