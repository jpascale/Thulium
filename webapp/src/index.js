/* eslint-disable import/default */

import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import configureStore from './store/configureStore';
import Root from './components/Root';
import { fetchProfile } from './services/auth';
import './styles/styles.scss'; // Yep, that's right. You can import SASS/CSS files too! Webpack will run the associated loader and plug this into the page.
require('./favicon.ico'); // Tell webpack to load favicon.ico

const THULIUM_LOCALSTORAGE_TOKEN_KEY = 'thulium:token';

const COOKIE_NAME = 'X-Access-Token';
	
const token = (() => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${COOKIE_NAME}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return localStorage.getItem(THULIUM_LOCALSTORAGE_TOKEN_KEY);
})();

const resolveProfile = (() => {
  if (!token) return Promise.resolve();
  return fetchProfile({ token }).catch(v => undefined);
})();

resolveProfile.then(profile => {
  const initialState = {
    auth: {
      loggingIn: false,
      profile,
      token
    }
  };

  const store = configureStore(initialState);

  render(
    <AppContainer>
      <Root store={store} />
    </AppContainer>,
    document.getElementById('app')
  );

  if (module.hot) {
    module.hot.accept('./components/Root', () => {
      const NewRoot = require('./components/Root').default;
      render(
        <AppContainer>
          <NewRoot store={store} />
        </AppContainer>,
        document.getElementById('app')
      );
    });
  }
});
