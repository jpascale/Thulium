import C from '../constants/app';

export const changeEngine = engine => ({
	type: C.CHANGE_ENGINE,
	payload: engine
});

export const changeText = text => ({
	type: C.CHANGE_TEXT,
	payload: text
});

export const toggleTask = () => ({
	type: C.TOGGLE_TASK
});