/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classNames from 'classnames';

import { changeDatasetTitle, upload } from '../../../../actions/datasets';

import ReviewItem from './ReviewItem';

class ReviewDatasets extends React.Component {
  state = {
    active: 0
  }

  switchToTab = index => () => {
    if (index !== this.state.active) {
      this.setState({ active: index });
    }
  }

  render = () => {
    const { items } = this.props;
    const { active } = this.state;
    console.log(active);
    return (
      <div className="review-datasets">
        <Nav tabs>
          {items.map(item => (
            <NavItem key={item.id}>
              <NavLink className={classNames({ active: active === item.id })} onClick={this.switchToTab(item.id)}>
                {item.title}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        <TabContent activeTab={active}>
          <TabPane tabId={active} tabIndex={active}>
            <ReviewItem item={items[active]} />
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  items: state.dataset.create.items
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewDatasets);