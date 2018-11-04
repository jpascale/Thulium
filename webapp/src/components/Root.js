import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import App from './App';

import { boot } from '../actions/app';

export default class Root extends Component {
  
  componentWillMount = () => {
    const { store } = this.props;
    store.dispatch(boot());
  }
  
  render() {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        <App />
        {/*<ConnectedRouter history={history}>
          
    </ConnectedRouter>*/}
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
