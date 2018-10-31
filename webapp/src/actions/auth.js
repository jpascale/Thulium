import CA from '../constants/auth';
import jwtDecode from 'jwt-decode';

const AuthService = {};

const THULIUM_LOCALSTORAGE_KEY = 'thulium:token';

const decodeToken = (token) => {
	try {
		return jwtDecode(token);
	} catch (e) {
		return null;
	}
};

const isTokenExpired = (jwt) => {
	const currentTime = Date.now() / 1000;
	if (jwt.exp < currentTime) {
		return true;
	}
	return false;
};

export const authenticating = () => ({
	type: CA.AUTHENTICATING
});

export const authenticated = ({ token }) => (dispatch, getState) => {

	localStorage.setItem(THULIUM_LOCALSTORAGE_KEY, token);

	return dispatch({
		type: CA.AUTHENTICATED,
		payload: {
			token,
			should_change_password
		}
	});
};

export const unauthorized = () => (dispatch) => {

	localStorage.removeItem(THULIUM_LOCALSTORAGE_KEY);
	dispatch({ type: CA.UNAUTHORIZED });
};

export const checkAuth = () => (dispatch, getState) => {
	const token = (() => {
		if (getState().auth.token) {
			return getState().auth.token;
		}
		return localStorage.getItem(THULIUM_LOCALSTORAGE_KEY);
	})();
	
	const jwt = decodeToken(token);
	
	if (!jwt || isTokenExpired(jwt)) {
		dispatch(unauthorized());
		return Promise.resolve();
	}
	
	return Promise.resolve(dispatch(authenticated({ token })));
};

const fetchingProfile = () => ({
	type: CA.FETCHING_PROFILE
});

const fetchedProfile = (profile) => ({
	type: CA.FETCHED_PROFILE,
	payload: profile
});

export const fetchProfile = () => (dispatch, getState) => {
	dispatch(fetchingProfile());
	AuthService.fetchProfile({
		token: getState().auth.token
	}).then((profile) => {
		return dispatch(fetchedProfile(profile));
	});
}