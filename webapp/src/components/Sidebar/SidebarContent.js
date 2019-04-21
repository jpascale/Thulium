import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Loadable from 'react-loadable';

import { changeFile, showCreateFileModal } from '../../actions/files';
import { changeCourse } from '../../actions/courses';

import AddIcon from '../common/AddIcon';

const AsyncDatasetMenuItem = Loadable({
  loader: () => import(/* webpackChunkName: "DatasetMenuItem" */ '../Datasets/CreateDatasetMenuItem'),
  /* eslint-disable react/display-name */
  loading: () => <span>Loading</span>
});

class SidebarContent extends React.Component {

	changeFile = file => () => this.props.changeFile(file)
	createFile = () => this.props.createFile()
	
	changeCourse = course => () => this.props.changeCourse(course)
    
	render() {
		const { profile, files, courses, selectedFile, selectedCourse } = this.props;

		const fileList = files.map((file, i) => (
			<li key={file._id} className="nav-item ml-2 mr-4">
				<a className={classNames('nav-link', { active: file._id === selectedFile })} href="#" onClick={this.changeFile(file._id)}>
					{file.title}
				</a>
			</li>
		));

		const courseList = courses.map((membership, i) => (
			<li key={membership.courseId} className="nav-item ml-2 mr-4">
				<a className={classNames('nav-link', 'course', { active: membership.courseId === selectedCourse })} href="#" onClick={this.changeCourse(membership.courseId)}>
					{membership.course.name}
				</a>
			</li>
		));

		return (
			<React.Fragment>
				<AsyncDatasetMenuItem />
				<h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-1 mb-1 text-muted">OPEN FILES
					<a className="d-flex align-items-center text-muted" href="#" onClick={this.createFile}>
						<AddIcon  />
					</a>
				</h6>
				<ul className="nav flex-column">
					{fileList}
				</ul>
				{courseList.length ? (
					<h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-1 mb-1 text-muted">
						COURSES
					</h6>
				) : null}
				<ul className="nav flex-column">
					{courseList}
				</ul>
			</React.Fragment>
		)
	}
}

const mapStateToProps = state => ({
	profile: state.auth.profile,
	files: Object.values(state.app.files),
	courses: Object.values(state.app.courses),
	selectedCourse: state.app.selectedCourse,
	selectedFile: state.app.selectedFile
});

const mapDispatchToProps = dispatch => ({
	changeFile: file => dispatch(changeFile(file)),
	changeCourse: course => dispatch(changeCourse(course)),
	createFile: () => dispatch(showCreateFileModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarContent);