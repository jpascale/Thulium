import C from '../constants/session';
import * as SessionService from '../services/session';
import { authenticated } from './auth';
import { doneRunning } from './app';


const THULIUM_LOCALSTORAGE_TOKEN_KEY = 'thulium:token';
const THULIUM_LOCALSTORAGE_SESSION_KEY = 'thulium:session';

export const negotiateSession = () => (dispatch, getState) => {
	
}

const startSession = (payload) => ({
	type: C.START,
	payload
});

let wsc;

export const ws = () => wsc;

export const hello = () => (dispatch, getState) => {
	const token = localStorage.getItem(THULIUM_LOCALSTORAGE_TOKEN_KEY);
	const sessionId = localStorage.getItem(THULIUM_LOCALSTORAGE_SESSION_KEY) || '';

	return SessionService.hello(sessionId, { token }).then(({ session, ws, token }) => {
		
		localStorage.setItem(THULIUM_LOCALSTORAGE_SESSION_KEY, session._id);
		
		dispatch(startSession(session));
		dispatch(authenticated({ token }));
		wsc = new WebSocket(ws);
		wsc.onmessage = event => {
			dispatch(doneRunning(JSON.parse(event.data)));
		};
		return new Promise((resolve, reject) => {
			wsc.onopen = () => {
				resolve();
			};
		});
	});
}