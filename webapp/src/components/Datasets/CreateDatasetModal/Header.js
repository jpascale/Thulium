/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { ModalHeader, UncontrolledTooltip } from 'reactstrap';
import classNames from 'classnames';

import { changeDatasetTitle } from '../../../actions/datasets';

class Header extends React.Component {

  state = {
    modifiedTitle: false,
    changingTitle: false,
    title: 'Untitled Dataset'
  }

  handleChange = key => e => this.setState({ [key]: e.target.value })
  changeTitle = () => this.setState({ changingTitle: true })
  handleKeyPress = e => {
    const { title } = this.state;
    if (e.key === 'Enter') {
      if (!title.trim()) return alert('Dataset title can\'t be empty');
      this.props.changeDatasetTitle(title);
      return this.setState({
        modifiedTitle: true,
        changingTitle: false
      });
    }
  }

  render = () => {
    const { modifiedTitle, changingTitle, title } = this.state;
    const titleContent = (() => {
      if (changingTitle) {
        return (
          <input type="text" className="form-control" value={title} onKeyPress={this.handleKeyPress} onChange={this.handleChange('title')} />
        );
      }
      return (
        <React.Fragment>
          <span id="dataset-title">{title}</span>
          <UncontrolledTooltip placement="top" target="dataset-title">
            Click to change
          </UncontrolledTooltip>
        </React.Fragment>
      );
    })();
    return (
      <ModalHeader toggle={this.props.toggle} onClick={this.changeTitle} className={classNames({ untitled: !modifiedTitle })}>
        {titleContent}
      </ModalHeader>
    )
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  changeDatasetTitle: title => dispatch(changeDatasetTitle(title))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);