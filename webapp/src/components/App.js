/* eslint-disable import/no-named-as-default */
import React from "react";
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import { hot } from "react-hot-loader";
import Loadable from 'react-loadable';

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.

const AsyncApp = Loadable({
  loader: () => import(/* webpackChunkName: "App" */ './AsyncApp'),
  /* eslint-disable react/display-name */
  loading: () => <h1 style={{ lineHeight: '100%', textAlign: 'center', display: 'table-cell', verticalAlign: 'middle' }}>Loading...</h1>
});

class App extends React.Component {

  render() {
    const { booting } = this.props;

    if (booting) {
      return (
        <h1 style={{ lineHeight: '100%', textAlign: 'center', display: 'table-cell', verticalAlign: 'middle' }}>Loading...</h1>
      );
    }

    return <AsyncApp />;
  }
}

App.propTypes = {
  children: PropTypes.element
};

const mapStateToProps = state => ({
  booting: state.app.booting
});

const mapDispatchToProps = dispatch => ({

});

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

export default hot(module)(ConnectedApp);
