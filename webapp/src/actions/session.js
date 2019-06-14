import C from '../constants/session';
import * as SessionService from '../services/session';
import { authenticated } from './auth';
import { doneRunning, wsMessageHandler } from './app';
import EventEmitter from '../utils/EventEmitter';


const THULIUM_LOCALSTORAGE_TOKEN_KEY = 'thulium:token';
const THULIUM_LOCALSTORAGE_SESSION_KEY = 'thulium:session';

export const negotiateSession = () => (dispatch, getState) => {
	
}

export const startSession = (payload) => ({
	type: C.START,
	payload
});

let wsc;

export const ws = _wsc => {
	if (wsc) return wsc;
	if (_wsc) wsc = _wsc;
	return wsc;
}

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

class ThuliumWebSocket extends EventEmitter {
	constructor(url) {
		super();
		this.wsc = new WebSocket(url);
	}

	connect() {
		const self = this;
		self.wsc.onmessage = event => {
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
			self.emit('message', data);
		};
		self.wsc.onopen = () => {
			self.emit('connected');
		};
	}

	send(data) {
		this.wsc.send(JSON.stringify(data));
	}
}

export const connectUsingToken = token => new ThuliumWebSocket(`${WS_URL}?token=${token}`);

export const fetchSession = () => (dispatch, getState) => {
	return SessionService.fetchSession({
		token: getState().auth.token
	}).then(session => {
		dispatch(startSession(session));

		const thuliumWebSocket = connectUsingToken(getState().auth.token);
		wsc = thuliumWebSocket;
		thuliumWebSocket.on('connected', () => {
			console.log('connected to ws');
		});
		thuliumWebSocket.on('message', wsMessageHandler({ getState, dispatch}))
		thuliumWebSocket.connect();
	})
}