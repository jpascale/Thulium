import * as SessionService from '../services/session';

export const negotiateSession = () => (dispatch, getState) => {
	
}

export const hello = () => (dispatch, getState) => {
	const token = (() => {
		if (getState().auth.token) return getState().auth.token;
		return localStorage.getItem(THULIUM_LOCALSTORAGE_KEY);
	})();

	SessionService.hello()
}