import React from 'react';
import { connect } from 'react-redux';
import { NavItem, NavLink, Nav } from 'reactstrap';
import Loadable from 'react-loadable';
import AddIcon from '../common/AddIcon';

const AsyncDatasetModal = Loadable({
  loader: () => import(/* webpackChunkName: "DatasetModal" */ './CreateDatasetModal/'),
  /* eslint-disable react/display-name */
  loading: () => <span>Loading</span>
});

class CreateDatasetMenuItem extends React.Component {

  state = {}

  displayLoginModal = () => this.setState({ modal: true })
  closeModal = () => this.setState({ modal: false })

  render = () => {
    const { profile } = this.props;
    const { modal } = this.state;
    const createDatasetMenuItem = (
      <Nav>
        <NavItem>
          <NavLink href="#" onClick={this.displayLoginModal}>
            <AddIcon /> CREATE DATASET
          </NavLink>
        </NavItem>
      </Nav>
    );

    return (
      <React.Fragment>
        {profile.role !== 'anonymous' && createDatasetMenuItem}
        {modal && <AsyncDatasetModal closeModal={this.closeModal} />}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  profile: state.auth.profile || {}
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateDatasetMenuItem);