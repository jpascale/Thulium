import React from 'react';
import { connect } from 'react-redux';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import EnginePicker from './EnginePicker';
import LoginModal from './LoginModal';

import './navbar.scss';

import { logout } from '../../actions/auth';

const ThuliumNavbar = ({ examMode }) => (
	<Navbar color="dark" expand="md" fixed="top" className="navbar-dark thulium-navbar">
		<NavbarBrand href="#">Thulium</NavbarBrand>
		<Nav className="mr-auto" navbar>
			{/*!examMode ? <EnginePicker /> : null*/}
</Nav>
		<LoginModal />
	</Navbar>
);

const mapState = state => ({
	examMode: state.app.examMode
});

export default connect(mapState)(ThuliumNavbar);