/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { ModalHeader, UncontrolledTooltip, Badge } from 'reactstrap';
import classNames from 'classnames';

import { changeDatasetTitle } from '../../../actions/datasets';

class Header extends React.Component {

  state = {
    modifiedTitle: false,
    changingTitle: false,
    title: 'Untitled Dataset'
  }

  handleChange = key => e => this.setState({ [key]: e.target.value })
  changeTitle = () => {
    if (this.state.changingTitle) return;
    this.setState({ changingTitle: true }, () => {
      this.input.focus();
      this.input.setSelectionRange(0, this.input.value.length);
    });
  }
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
  handleFocus = e => this.setState({ previousTitle: e.target.value });
  handleBlur = () => {
    const { changingTitle, previousTitle } = this.state;
    if (changingTitle) {
      this.setState({
        changingTitle: false,
        title: previousTitle
      });
    }
  }

  render = () => {
    const { paradigm } = this.props;
    const { modifiedTitle, changingTitle, title } = this.state;
    const titleContent = (() => {
      if (changingTitle) {
        return (
					<React.Fragment>
						<input
              ref={ref => this.input = ref}
							paradigm="text"
							className="form-control"
							value={title}
							onKeyPress={this.handleKeyPress}
							onFocus={this.handleFocus}
							onBlur={this.handleBlur}
							onChange={this.handleChange('title')} />
						<small className="text-muted title-caption">Press Enter to apply changes</small>
					</React.Fragment>
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
        <Badge color="success">{paradigm.toUpperCase()}</Badge> {titleContent}
      </ModalHeader>
    )
  }
}

const mapStateToProps = state => ({
  paradigm: state.dataset.create.paradigm
});

const mapDispatchToProps = dispatch => ({
  changeDatasetTitle: title => dispatch(changeDatasetTitle(title))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);