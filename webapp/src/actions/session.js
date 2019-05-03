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

const COOKIE_NAME = 'X-Access-Token';

export const hello = () => (dispatch, getState) => {
	
	const token = getState().auth.token;
	const sessionId = localStorage.getItem(THULIUM_LOCALSTORAGE_SESSION_KEY) || '';

	return SessionService.hello(sessionId, { token }).then(({ session, ws, token }) => {
		
		localStorage.setItem(THULIUM_LOCALSTORAGE_SESSION_KEY, session._id);
		
		dispatch(startSession(session));
		dispatch(authenticated({ token }));
		
	});
};

console.log(WS_URL);

export const fetchSession = () => (dispatch, getState) => {
	return SessionService.fetchSession({
		token: getState().auth.token
	}).then(session => {
		dispatch(startSession(session));

		const ws = `${WS_URL}?token=${getState().auth.token}`;
		wsc = new WebSocket(ws);
		wsc.onmessage = event => {
			console.log(event.data);
			const data = (() => {
				try {
					return JSON.parse(event.data);
				} catch (e) {
					return null;
				}
			})();
			if (!data) {
				console.error('could not parse ws response data');
				console.error(data);
				return;
			}
			dispatch(doneRunning(JSON.parse(event.data)));
		};
		wsc.onopen = () => {
			console.log(`Opened websocket connection to ${ws}`);
		};
	})
}