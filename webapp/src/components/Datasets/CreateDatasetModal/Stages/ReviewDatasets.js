/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { Nav, NavItem, NavLink, TabContent, TabPane, Alert } from 'reactstrap';
import classNames from 'classnames';

import { changeDatasetTitle, upload } from '../../../../actions/datasets';

import ReviewItem from './ReviewItem';

class ReviewDatasets extends React.Component {
  state = {
    active: 0,
    showAlert: true
  }

  switchToTab = index => () => {
    if (index === this.state.active) return;
    this.setState({ active: index });
  }

  dismissAlert = () => this.setState({ showAlert: false })

  render = () => {
    const { items } = this.props;
    const { active, showAlert } = this.state;
    return (
      <React.Fragment>
        <Alert color="info" isOpen={showAlert} toggle={this.dismissAlert}>
          <h5>Useful info!</h5>
          Types are inferred from the reading of the first 5 lines per column. Pick them carefully as it may lead to an unusable dataset.
          <hr />
          <b>Time</b> type can be of the form HH:mm, HHmm, HH:mm:ss, HHmmss.
          <br />
          <b>Date</b> must be of the form YYYY-MM-DD.
          <br />
          <b>Timestamp</b> must be a valid <a className="alert-link" href="https://en.wikipedia.org/wiki/ISO_8601" target="_blank">ISO 8601</a> string.
        </Alert>
        <div className="review-datasets d-flex flex-row">
          <Nav tabs className="nav-tabs--vertical nav-tabs--left">
            {items.map(item => (
              <NavItem key={item.id}>
                <NavLink className={classNames({ active: active === item.id })} onClick={this.switchToTab(item.id)}>
                  {item.title}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
          <TabContent className="flex-grow-1" activeTab={active}>
            <TabPane tabId={active} tabIndex={active}>
              <ReviewItem item={items[active]} />
            </TabPane>
          </TabContent>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  items: state.dataset.create.items
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewDatasets);