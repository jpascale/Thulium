import React from 'react';

import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Main from './containers/Main';
import Files from './Files';

const AsyncApp = props => (
  <React.Fragment>
    <Navbar />
    <Files />
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <Main />
      </div>
    </div>
  </React.Fragment>
);

export default AsyncApp;