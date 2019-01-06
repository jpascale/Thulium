/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { ModalHeader } from 'reactstrap';

class Header extends React.Component {

  state = {}

  render = () => {
    return (
      <ModalHeader>Create Dataset</ModalHeader>
    )
  }
}

const mapStateToProps = state => ({
  profile: state.auth.profile,
  loggingIn: state.auth.loggingIn
});

const mapDispatchToProps = dispatch => ({
  handleUpload: data => dispatch(upload(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);