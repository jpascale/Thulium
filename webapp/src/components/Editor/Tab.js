import React from 'react';
import { connect } from 'react-redux';

import CourseTab from './CourseTab';
import EditorTab from './EditorTab';

const Tab = ({ selectedTab }) => {
	if (selectedTab === 'course') {
		return <CourseTab />;
	}
	return <EditorTab />;
};

const mapStateToProps = state => ({
	selectedTab: state.app.selectedTab
});

export default connect(mapStateToProps)(Tab);