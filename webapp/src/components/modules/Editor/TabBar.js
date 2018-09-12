import React from 'react';

import { Navbar, Nav, NavItem, NavLink } from 'reactstrap'

class TabBar extends React.Component {
	render() {
		return (
			<Navbar color="dark" expand="md" fixed="top" className="navbar-dark thulium-editor-tab-bar col-md-9 ml-sm-auto col-lg-10">
				<Nav className="mr-auto" navbar>
					<NavItem>
						<NavLink href="#" className="editor-action-bar-button">File #1</NavLink>
					</NavItem>
					<NavItem>
						<NavLink href="#" className="editor-action-bar-button">File #2</NavLink>
					</NavItem>
					<NavItem>
						<NavLink href="#" className="editor-action-bar-button">File #3</NavLink>
					</NavItem>
				</Nav>
			</Navbar>
		);
	}
}

export default TabBar;