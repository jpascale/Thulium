import C from '../constants/file';
import * as FileService from '../services/file';

export const changeFile = file => ({
	type: C.CHANGE,
	payload: file
});

export const showCreateFileModal = () => ({
	type: C.SHOW_CREATE_MODAL
});
export const closeCreateFileModal = () => ({
	type: C.CLOSE_CREATE_MODAL
});

const creatingFile = () => ({
	type: C.CREATING
});

const createdFile = (file) => ({
	type: C.CREATED,
	payload: file
});

export const createFile = (filename) => (dispatch, getState) => {
	dispatch(creatingFile());
	return FileService.createFile({
		title: filename,
		engine: getState().app.currentEngine,
		session: getState().app.session._id
	}, {
		token: getState().auth.token
	}).then(file => {
		dispatch(createdFile(file));
	});
}