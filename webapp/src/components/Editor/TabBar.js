import React from 'react';
import { connect } from 'react-redux';

import { Navbar, Nav, NavItem, NavLink } from 'reactstrap'

import { changeFile, showCreateFileModal } from '../../actions/files';

class TabBar extends React.Component {

	changeFile = file => () => this.props.changeFile(file)
	createFile = () => this.props.createFile()

	render = () => {
		const { files, selectedFile } = this.props;
		const fileList = files.map((file, i) => (
			<NavItem key={file._id} >
				<NavLink
					active={selectedFile === file._id}
					onClick={this.changeFile(file._id)}
					href="#"
					className="editor-action-bar-button">
					{file.title}
				</NavLink>
			</NavItem>
		));
		return (
			<Navbar color="dark" expand="md" fixed="top" className="navbar-dark thulium-editor-tab-bar col-md-9 ml-sm-auto col-lg-10">
				<Nav className="mr-auto" navbar>
					{fileList}
					<NavItem onClick={this.createFile}>
						<NavLink active={true} href="#" className="editor-action-bar-button">+</NavLink>
					</NavItem>
				</Nav>
			</Navbar>
		);
	}
}

const mapStateToProps = state => ({
	files: Object.values(state.app.files),
	selectedFile: state.app.selectedFile
});

const mapDispatchToProps = dispatch => ({
	changeFile: file => dispatch(changeFile(file)),
	createFile: () => dispatch(showCreateFileModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(TabBar);