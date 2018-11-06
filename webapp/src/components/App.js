/* eslint-disable import/no-named-as-default */
import React from "react";
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import { NavLink, Route, Switch } from "react-router-dom";
import { hot } from "react-hot-loader";

import Navbar from './containers/Navbar';
import Sidebar from './containers/Sidebar';
import Main from './containers/Main';

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.

class App extends React.Component {

  render() {
    const { booting } = this.props; 

    if (booting) {
      return (
        <h1 style={{ lineHeight: '100%', textAlign: 'center', display: 'table-cell', verticalAlign: 'middle' }}>Loading...</h1>
      );
    }

    return (
      <React.Fragment>
        <Navbar />
        <div className="container-fluid">
          <div className="row">
            <Sidebar />
            <Main />
          </div>
        </div>
      </React.Fragment>
    );
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
