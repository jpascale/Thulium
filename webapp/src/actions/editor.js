import C from '../constants/app';

export const changeEngine = engine => ({
	type: C.CHANGE_ENGINE,
	payload: engine
});