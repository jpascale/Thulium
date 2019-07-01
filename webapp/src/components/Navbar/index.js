import React from 'react';
import { connect } from 'react-redux';
import { Navbar, NavbarBrand, Nav } from 'reactstrap';

import LoginModal from './LoginModal';

import './navbar.scss';

const ThuliumNavbar = () => (
	<Navbar color="dark" expand="md" fixed="top" className="navbar-dark thulium-navbar">
		<NavbarBrand href="#">Thulium</NavbarBrand>
		<Nav className="mr-auto" navbar></Nav>
		<LoginModal />
	</Navbar>
);

const mapState = state => ({
	examMode: state.app.examMode
});

export default connect(mapState)(ThuliumNavbar);