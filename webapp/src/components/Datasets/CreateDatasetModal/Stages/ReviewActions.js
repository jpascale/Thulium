/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classNames from 'classnames';

class ReviewActions extends React.Component {
  state = {}

  render = () => {

    return (
      <div className="review-datasets d-flex flex-row">
        {/* <Nav tabs className="nav-tabs--vertical nav-tabs--left">
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
        </TabContent> */}
        hola :)
      </div>
    );
  }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewActions);