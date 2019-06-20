import React from 'react';
import { connect } from 'react-redux';
import { Toast, ToastBody, ToastHeader } from 'reactstrap';


const Notifications = ({ notifications }) => notifications.map(n => (
	<Toast key={Math.random().toString(36).substr(2)}>
		<ToastHeader icon="success">Thulium</ToastHeader>
		<ToastBody>Whole bodyyyy</ToastBody>
	</Toast>
));

const mapStateToProps = state => ({
	notifications: state.app.notifications,
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);