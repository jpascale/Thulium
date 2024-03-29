import React from 'react';
import { connect } from 'react-redux';

import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Main from './containers/Main';
import Files from './Files';
import Notifications from './Notifications';

import { boot } from '../actions/app';

const loadingStyle = { lineHeight: '100%', textAlign: 'center', display: 'table-cell', verticalAlign: 'middle' };

class AsyncApp extends React.Component {
  componentDidMount = () => {
    this.props.boot();
  }

  render = () => {
    const { booting } = this.props;
    if (booting) {
      return <h1 style={loadingStyle}>Loading...</h1>;
    }
    return (
      <React.Fragment>
        <Notifications />
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
  }
}

const mapState = state => ({
  booting: state.app.booting
});

const mapDispatch = dispatch => ({
  boot: () => dispatch(boot())
});

export default connect(mapState, mapDispatch)(AsyncApp);
