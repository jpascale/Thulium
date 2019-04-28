import React from 'react';
import { connect } from 'react-redux';

import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Main from './containers/Main';
import Files from './Files';

import { boot } from '../actions/app';

const once = fn => {
  let result;
  return function () {
    if (result) return result;
    fn.apply(null, arguments);
  }
};

const AsyncApp = ({ boot, booting }) => {
  boot();
  if (booting) {
    return (
      <h1 style={{ lineHeight: '100%', textAlign: 'center', display: 'table-cell', verticalAlign: 'middle' }}>Loading...</h1>
    );
  }
  return (
    <React.Fragment>
      <Navbar />
      <Files />
      <div className="container-fluid full-height">
        <div className="row full-height">
          <Sidebar />
          <Main />
        </div>
      </div>
    </React.Fragment>
  );
};

const mapState = state => ({
  booting: state.app.booting
});

const mapDispatch = dispatch => {
  const bootOnce = once(() => {
    dispatch(boot())
  });
  return {
    boot: () => bootOnce()
  };
};

export default connect(mapState, mapDispatch)(AsyncApp);
