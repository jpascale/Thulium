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

export const createFile = ({ filename, engine, dataset }) => (dispatch, getState) => {
	dispatch(creatingFile());
	return FileService.createFile({
		title: filename,
		engine,
		dataset,
		session: getState().app.session._id
	}, {
			token: getState().auth.token
		}).then(file => {
			return dispatch(createdFile(file));
		});
};

const autosaving = () => ({
	type: C.AUTOSAVING
});
const autosaved = () => ({
	type: C.AUTOSAVED
});

export const autosave = sql => (dispatch, getState) => {
	dispatch(autosaving());
	return FileService.update(getState().app.selectedFile, {
		content: sql
	}, {
			token: getState().auth.token
		}).then(file => {
			return dispatch(autosaved(file));
		});
};

export const selectForQuery = tableName => (dispatch, getState) => {
	const defaultQuery = `SELECT * FROM ${tableName};`;
	dispatch(autosave(defaultQuery));
};

export const changeResponse = (file, response) => ({
	type: C.CHANGE_RESPONSE,
	payload: {
		file,
		response
	}
});

