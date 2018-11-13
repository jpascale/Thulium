import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

class SidebarContent extends React.Component {

	render = () => {
		const { files } = this.props;

		const fileList = files.map((file, i) => (
			<li key={`file${i}`} className="nav-item ml-2 mr-4">
				<a className={classNames('nav-link', { active: !i })} href="#">
					File #{i + 1}
				</a>
			</li>
		));

		return (
			<React.Fragment>
				<h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-1 mb-1 text-muted">OPEN FILES</h6>
					{/*<a class="d-flex align-items-center text-muted" href="#">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
					</a>*/}
				{/*</h6>*/}
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
	files: state.app.session.files
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarContent);