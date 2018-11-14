import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { changeFile, showCreateFileModal } from '../../../actions/files';

class SidebarContent extends React.Component {

	changeFile = file => () => this.props.changeFile(file)
	createFile = () => this.props.createFile()

	render = () => {
		const { files, selectedFile } = this.props;

		const fileList = files.map((file, i) => (
			<li key={file._id} className="nav-item ml-2 mr-4">
				<a
					className={classNames('nav-link', { active: file._id === selectedFile })}
					href="#"
					onClick={this.changeFile(file._id)}>
					{file.title}
				</a>
			</li>
		));

		return (
			<React.Fragment>
				<h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-1 mb-1 text-muted">OPEN FILES
					<a className="d-flex align-items-center text-muted" href="#" onClick={this.createFile}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle">
							<circle cx="12" cy="12" r="10"></circle>
							<line x1="12" y1="8" x2="12" y2="16"></line>
							<line x1="8" y1="12" x2="16" y2="12"></line>
						</svg>
					</a>
				</h6>
				<ul className="nav flex-column">
					{fileList}
					{/*<li className="nav-item">
						<a className="nav-link active" href="#">
							Dashboard <span className="sr-only">(current)</span>
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">
							Orders
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">
							Products
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">
							Customers
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">
							Reports
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">
							Integrations
						</a>
					</li>*/}
				</ul>
			</React.Fragment>
		)
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

export default connect(mapStateToProps, mapDispatchToProps)(SidebarContent);