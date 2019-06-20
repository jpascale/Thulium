import React from 'react';
import { connect } from 'react-redux';
import { Toast, ToastBody, ToastHeader } from 'reactstrap';

import { closeNotification } from '../../actions/app';

import './notifications.scss';

const Notifications = ({ notifications, closeNotification }) => (
	<div className="thulium-notification-container">
		{notifications.map(n => (
			<Toast key={n.id}>
				<ToastHeader toggle={closeNotification(n.id)} icon={n.type || 'primary'}>Thulium</ToastHeader>
				<ToastBody>{n.text}</ToastBody>
			</Toast>
		))}
	</div> 
);

const mapStateToProps = state => ({
	notifications: state.app.notifications,
});

const mapDispatchToProps = dispatch => ({
	closeNotification: id => () => dispatch(closeNotification(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);