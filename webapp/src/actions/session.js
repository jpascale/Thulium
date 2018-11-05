import C from '../constants/session';
import * as SessionService from '../services/session';
import { authenticated } from './auth';


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
			console.log(event.data);
		};
		wsc.onopen = () => {
			console.log('ws open');
			setTimeout(() => {
				console.log('sending');
				wsc.send(JSON.stringify({
					type: 'psql',
					payload: {
						query: 'select * from foo'
					}
				}));
			}, 500);
		};
		return Promise.resolve();
	});
}