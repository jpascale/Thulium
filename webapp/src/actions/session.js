import C from '../constants/session';
import * as SessionService from '../services/session';
import { authenticated } from './auth';


const THULIUM_LOCALSTORAGE_TOKEN_KEY = 'thulium:token';
const THULIUM_LOCALSTORAGE_SESSION_KEY = 'thulium:session';

export const negotiateSession = () => (dispatch, getState) => {
	
}

const startSession = (payload) => ({
	type: C.START_SESSION,
	payload
});

export const hello = () => (dispatch, getState) => {
	const token = (() => {
		if (getState().auth.token) return getState().auth.token;
		return localStorage.getItem(THULIUM_LOCALSTORAGE_TOKEN_KEY);
	})();

	const sessionId = localStorage.getItem(THULIUM_LOCALSTORAGE_SESSION_KEY) || '';

	return SessionService.hello(sessionId, { token }).then(({ session, ws, token }) => {
		dispatch(startSession(session));
		dispatch(authenticated({ token }));

		const wsc = new WebSocket(ws);
		wsc.onopen = event => {
			console.log(event);
		};
		wsc.onmessage = event => {
			console.log(event.data);
		}
		return Promise.resolve();
	});
}