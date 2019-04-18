import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Loadable from 'react-loadable';

import { changeFile, showCreateFileModal } from '../../actions/files';

import AddIcon from '../common/AddIcon';

const AsyncDatasetMenuItem = Loadable({
  loader: () => import(/* webpackChunkName: "DatasetMenuItem" */ '../Datasets/CreateDatasetMenuItem'),
  /* eslint-disable react/display-name */
  loading: () => <span>Loading</span>
});

class SidebarContent extends React.Component {

  changeFile = file => () => this.props.changeFile(file)
  createFile = () => this.props.createFile()
    
	render() {
		const { profile, files, selectedFile } = this.props;

		const fileList = files.map((file, i) => (
			<li key={file._id} className="nav-item ml-2 mr-4">
				<a className={classNames('nav-link', { active: file._id === selectedFile })} href="#" onClick={this.changeFile(file._id)}>
					{file.title}
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
			</React.Fragment>
		)
	}
}

const mapStateToProps = state => ({
	profile: state.auth.profile,
	files: Object.values(state.app.files),
	selectedFile: state.app.selectedFile
});

const mapDispatchToProps = dispatch => ({
	changeFile: file => dispatch(changeFile(file)),
	createFile: () => dispatch(showCreateFileModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarContent);