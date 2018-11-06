import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, NavItem, NavLink, Form, FormGroup, Input, Label } from 'reactstrap';

import EnginePicker from '../modules/Navbar/EnginePicker';

import '../../styles/navbar.scss';

import { login } from '../../actions/auth';

class ThuliumLogin extends React.Component {

	state = {}

	handleChange = key => e => this.setState({ [key]: e.target.value })

	displayLoginModal = () => this.setState({ modal: true })
	closeModal = () => this.setState({ modal: false })

	login = () => {
		const { login } = this.props;
		const { email, password } = this.state;
		login({
			email,
			password
		}).then(() => {
			this.closeModal();
		}, err => {
			console.error(err);
		});
	}

	render = () => {
		const { profile, loggingIn } = this.props;
		const { modal } = this.state;
		console.log(profile);
		return (
			<React.Fragment>
				<NavItem>
					<NavLink href="#" onClick={profile.role === 'anonymous' ? this.displayLoginModal : null}>
						{profile.role === 'anonymous' ? 'Login' : profile.email}
					</NavLink>
				</NavItem>
				<Modal isOpen={modal}>
					<ModalHeader>Login</ModalHeader>
					<ModalBody>
						<Form>
							<FormGroup>
								<Label for="exampleEmail">Email</Label>
								<Input type="email" name="email" placeholder="Email" onChange={this.handleChange('email')}/>
							</FormGroup>
							<FormGroup>
								<Label for="examplePassword">Password</Label>
								<Input type="password" name="password" placeholder="Password" onChange={this.handleChange('password')} />
							</FormGroup>
						</Form>
					</ModalBody>
					<ModalFooter>
						<Button color="primary" onClick={this.login} disabled={loggingIn}>{loggingIn ? 'Logging In'  : 'Login'}</Button>{' '}
						<Button color="secondary" onClick={this.closeModal}>Cancel</Button>
					</ModalFooter>
				</Modal>
			</React.Fragment>
		)
	}
}

const mapStateToProps = state => ({
	profile: state.auth.profile,
	loggingIn: state.auth.loggingIn
});

const mapDispatchToProps = dispatch => ({
	login: form => dispatch(login(form))
});

export default connect(mapStateToProps, mapDispatchToProps)(ThuliumLogin);