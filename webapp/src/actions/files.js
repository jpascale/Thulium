import C from '../constants/file';
import * as FileService from '../services/file';
import { notify } from './app'

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
		dispatch(notify({
			text: 'File created successfully',
			type: 'success'
		}));
		return dispatch(createdFile(file));
	}).catch(err => {
		console.error(err);
		dispatch(notify({
			text: 'Failed to create file, please try again',
			type: 'danger'
		}));
	});
};

const removingFile = () => ({
	type: C.REMOVING
});

const removedFile = file => ({
	type: C.REMOVED,
	payload: file
});

export const removeFile = id => (dispatch, getState) => {
	dispatch(removingFile());
	return FileService.removeFile(id, {
		token: getState().auth.token
	}).then(() => {
		dispatch(notify({
			text: 'File removed successfully',
			type: 'success'
		}));
		return dispatch(removedFile(id));
	}).catch(err => {
		console.error(err);
		dispatch(notify({
			text: 'Failed to remove file, please try again',
			type: 'danger'
		}));
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

