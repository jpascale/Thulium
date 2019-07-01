import React from 'react';
import { connect } from 'react-redux';

import { Navbar, Nav, NavItem, NavLink } from 'reactstrap'

import { changeFile, removeFile, showCreateFileModal } from '../../actions/files';
import { changeCourse } from '../../actions/courses';

// https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
// t: current time, b: begInnIng value, c: change In value, d: duration
const easeInQuad = (x, t, b, c, d) => c * (t /= d) * t + b;

const DELTA = 10;

class TabBar extends React.Component {

	constructor(props) {
		super(props);

		this.filesTab = React.createRef();
	}

	_scroll = direction => {
		if (this.animating) return;
		const elem = this.filesTab.current;
		// check if elem is overflowing
		if (elem.scrollWidth <= elem.offsetWidth) return;
		/// already on the left
		if (elem.scrollLeft === 0 && direction === 'left') return;
		/// already on the right
		if (elem.scrollLeft + elem.offsetWidth === elem.scrollWidth && direction === 'right') return;
		const scrollableLeft = elem.scrollLeft;
		const scrollableRight = elem.scrollWidth - elem.offsetWidth - elem.scrollLeft;
		const targetScrollLeft = (() => {
			if (direction === 'right') {
				return Math.min(scrollableRight, Math.max(0, elem.scrollLeft + 20));
			}
			return Math.min(scrollableLeft, Math.max(0, elem.scrollLeft - 20));
		})();
		let t = 0;
		this.animating = true;
		console.log('animating from', elem.scrollLeft, 'to', targetScrollLeft, 'diff', targetScrollLeft - scrollableLeft);
		const start = Date.now();
		const interval = setInterval(() => {
			elem.scrollLeft = easeInQuad(elem.scrollLeft, t / 1000, scrollableLeft, targetScrollLeft - scrollableLeft, .4);
			if (Math.abs(targetScrollLeft - elem.scrollLeft) <= 1) {
				console.log('done', Date.now() - start);
				this.animating = false;
				clearInterval(interval);
			}
			t += DELTA;
		}, DELTA);
	}

	// _scrollBy = delta => this._scrollTo(this.filesTab.current.scrollLeft + delta);

	_scrollRight = e => {
		this._scroll('right');
	}

	_scrollLeft = e => {
		this._scroll('left');
	}

	changeFile = file => () => this.props.changeFile(file)
	removeFile = file => () => this.props.removeFile(file)
	createFile = () => this.props.createFile()
	
	changeCourse = course => () => this.props.changeCourse(course)

	render = () => {
		const { files, membership, selectedFile, selectedCourse, selectedTab, examMode, datasets, engines } = this.props;
		const fileList = files.map((file, i) => (
			<NavItem className="file-tab-item" key={file._id}>
				<NavLink
					active={selectedFile === file._id && selectedTab === 'file'}
					onClick={this.changeFile(file._id)}
					href="#"
					className="editor-action-bar-button">
					<span>{file.title}</span>
					{examMode || files.length === 1 ? null : (
						<button onClick={this.removeFile(file._id)} className="remove-file-button" type="button">&times;</button>
					)}
					<small>{engines[file.engine].title} - {datasets[file.dataset].title}</small>
				</NavLink>
			</NavItem>
		));
		const courseTab = (() => {
			if (!selectedCourse) return null;
			return (
				<NavItem className="course-tab-item">
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
				<ul className="mr-auto files-tab-bar navbar-nav" ref={this.filesTab}>
					{fileList}
					{!examMode ? (
						<NavItem onClick={this.createFile}>
							<NavLink active={true} href="#" className="editor-action-bar-button">+</NavLink>
						</NavItem>
					) : null}
					{courseTab}
				</ul>
				<Nav className="ml-auto overflow-arrows" navbar style={{ maxHeight: '52px', paddingTop: '8.5px', paddingBottom: '8.5px' }}>
					<NavItem onClick={this._scrollLeft}>
						<NavLink active={true} href="#" className="editor-action-bar-button">{'<'}</NavLink>
					</NavItem>
					<NavItem onClick={this._scrollRight}>
						<NavLink active={true} href="#" className="editor-action-bar-button">{'>'}</NavLink>
					</NavItem>
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
	examMode: state.app.examMode,
	engines: state.app.engines,
	datasets: state.app.datasets
});

const mapDispatchToProps = dispatch => ({
	changeFile: file => dispatch(changeFile(file)),
	removeFile: file => dispatch(removeFile(file)),
	changeCourse: course => dispatch(changeCourse(course)),
	createFile: () => dispatch(showCreateFileModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(TabBar);