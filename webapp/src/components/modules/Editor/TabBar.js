import React from 'react';
import { connect } from 'react-redux';

import { Navbar, Nav, NavItem, NavLink } from 'reactstrap'

class TabBar extends React.Component {
	render = () => {
		const { files } = this.props;
		const fileList = files.map((file, i) => (
			<NavItem>
				<NavLink active={!i} href="#" className="editor-action-bar-button">File #{i + 1}</NavLink>
			</NavItem>
		));
		return (
			<Navbar color="dark" expand="md" fixed="top" className="navbar-dark thulium-editor-tab-bar col-md-9 ml-sm-auto col-lg-10">
				<Nav className="mr-auto" navbar>
					{fileList}
					<NavItem>
						<NavLink active={true} href="#" className="editor-action-bar-button">+</NavLink>
					</NavItem>
				</Nav>
			</Navbar>
		);
	}
}

const mapStateToProps = state => ({
	files: state.app.session.files
});

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(TabBar);