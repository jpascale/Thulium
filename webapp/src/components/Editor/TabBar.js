import React from 'react';
import { connect } from 'react-redux';

import { Navbar, Nav, NavItem, NavLink } from 'reactstrap'

import { changeFile, showCreateFileModal } from '../../actions/files';
import { changeCourse } from '../../actions/courses';

class TabBar extends React.Component {

	changeFile = file => () => this.props.changeFile(file)
	createFile = () => this.props.createFile()
	
	changeCourse = course => () => this.props.changeCourse(course)

	render = () => {
		const { files, membership, selectedFile, selectedCourse, selectedTab, examMode } = this.props;
		const fileList = files.map((file, i) => (
			<NavItem key={file._id} >
				<NavLink
					active={selectedFile === file._id && selectedTab === 'file'}
					onClick={this.changeFile(file._id)}
					href="#"
					className="editor-action-bar-button">
					{file.title}
				</NavLink>
			</NavItem>
		));
		const courseTab = (() => {
			if (!selectedCourse) return null;
			return (
				<NavItem>
					<NavLink
						active={selectedTab === 'course'}
						onClick={this.changeCourse(selectedCourse)}
						href="#"
						className="editor-action-bar-button">
						{membership.course.name}
					</NavLink>
				</NavItem>
			)
		})();
		return (
			<Navbar color="dark" expand="md" fixed="top" className="navbar-dark thulium-editor-tab-bar col-md-9 ml-sm-auto col-lg-10">
				<Nav className="mr-auto" navbar>
					{fileList}
					{!examMode ? (
						<NavItem onClick={this.createFile}>
							<NavLink active={true} href="#" className="editor-action-bar-button">+</NavLink>
						</NavItem>
					) : null}
					{courseTab}
				</Nav>
			</Navbar>
		);
	}
}

const mapStateToProps = state => ({
	files: Object.values(state.app.files),
	selectedFile: state.app.selectedFile,
	selectedCourse: state.app.selectedCourse,
	membership: (state.app.courses || {})[state.app.selectedCourse],
	selectedTab: state.app.selectedTab,
	examMode: state.app.examMode
});

const mapDispatchToProps = dispatch => ({
	changeFile: file => dispatch(changeFile(file)),
	changeCourse: course => dispatch(changeCourse(course)),
	createFile: () => dispatch(showCreateFileModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(TabBar);