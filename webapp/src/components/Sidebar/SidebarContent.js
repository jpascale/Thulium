import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Loadable from 'react-loadable';
import { Badge } from 'reactstrap';

import { changeFile, showCreateFileModal, selectForQuery } from '../../actions/files';
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
	selectForQuery = tableName => () => this.props.selectForQuery(tableName);

	render() {
		const { filesRepo = {}, coursesRepo = {}, selectedFile, selectedCourse, examMode } = this.props;

		const files = Object.values(filesRepo);
		const courses = Object.values(coursesRepo);

		const fileList = files.map((file, i) => (
			<li key={file._id} className="nav-item ml-2 mr-4">
				<a className={classNames('nav-link', { active: file._id === selectedFile })} href="#" onClick={this.changeFile(file._id)}>
					{file.title}
				</a>
			</li>
		));

		const courseList = courses.map((membership, i) => {
			if (!membership.course.grades) {
				console.log(membership);
			}
			const exams = membership.course.grades.filter(g => g.content).length;
			return (
				<li key={membership.courseId} className="nav-item ml-2 mr-4">
					<a className={classNames('nav-link', 'course', { active: membership.courseId === selectedCourse })} href="#" onClick={this.changeCourse(membership.courseId)}>
						{exams ? <Badge title={`${exams} exam${exams > 1 ? 's' : ''} available`} color="danger">{exams}</Badge> : null} {membership.course.name}
					</a>
				</li>
			);
		});

		return (
			<React.Fragment>
				{examMode ? null : <AsyncDatasetMenuItem />}
				<h6 className="sidebar-heading d-flex justify-content-between align-items-center ml-3 mr-2 mt-1 mb-1 text-muted">OPEN FILES
					{!examMode ? (
						<a className="d-flex align-items-center text-muted" href="#" onClick={this.createFile}>
							<AddIcon />
						</a>
					) : null}
				</h6>
				<ul className="nav flex-column">
					{fileList}
				</ul>
				{!examMode && courseList.length ? (
					<h6 className="sidebar-heading d-flex justify-content-between align-items-center ml-3 mr-2 mt-1 mb-1 text-muted">
						COURSES
					</h6>
				) : null}
				{!examMode ? (
					<ul className="nav flex-column">
						{courseList}
					</ul>
				) : null}
			</React.Fragment>
		)
	}
}

const mapStateToProps = state => ({
	filesRepo: state.app.files,
	coursesRepo: state.app.courses,
	selectedCourse: state.app.selectedCourse,
	selectedFile: state.app.selectedFile,
	examMode: state.app.examMode,
});

const mapDispatchToProps = dispatch => ({
	changeFile: file => dispatch(changeFile(file)),
	changeCourse: course => dispatch(changeCourse(course)),
	createFile: () => dispatch(showCreateFileModal()),
	selectForQuery: (tableName) => dispatch(selectForQuery(tableName))
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarContent);