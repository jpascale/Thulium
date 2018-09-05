/* eslint-disable import/no-named-as-default */
import React from "react";
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

/**
 * <div>
        <div>
          <NavLink exact to="/" activeStyle={activeStyle}>Home</NavLink>
          {' | '}
          <NavLink to="/fuel-savings" activeStyle={activeStyle}>Demo App</NavLink>
          {' | '}
          <NavLink to="/about" activeStyle={activeStyle}>About</NavLink>
        </div>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/fuel-savings" component={FuelSavingsPage} />
          <Route path="/about" component={AboutPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
 */

App.propTypes = {
  children: PropTypes.element
};

export default hot(module)(App);
