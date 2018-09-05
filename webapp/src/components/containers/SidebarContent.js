import React from 'react';
import { connect } from 'react-redux';

class SidebarContent extends React.Component {

	render() {
		return (
			<ul className="nav flex-column">
				<li className="nav-item">
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
				</li>
			</ul>
		)
	}
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarContent);