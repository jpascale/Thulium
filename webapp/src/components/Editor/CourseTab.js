import React from 'react';
import { connect } from 'react-redux';

import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

import './editor.scss';

class CourseTab extends React.Component {

	state = {
		createExam: false
	}

	/**
	 * {
  "externalId": "string",
  "externalToolId": "string",
  "name": "string",
  "displayName": "string",
  "description": "string",
  "externalGrade": true,
  "score": {
    "possible": 0
  },
  "availability": {
    "available": "Yes"
  },
  "grading": {
    "type": "Attempts",
    "due": "2019-04-19T18:50:33.578Z",
    "attemptsAllowed": 0,
    "scoringModel": "Last",
    "schemaId": "string",
    "anonymousGrading": {
      "type": "None",
      "releaseAfter": "2019-04-19T18:50:33.578Z"
    }
  },
  "gradebookCategoryId": "string"
}
	 */

	createExam = () => this.setState({ createExam: true })

	handleChange = key => e => this.setState({ [key]: e.target.value })
	handleSubmit = () => {
		const { name } = this.state;

		const exam = {
			name,
			displayName: name,
			score: {
				possible: 10
			},
			availability: {
				available: "No"
			},

		}
	}

	render = () => {
		const { membership } = this.props;
		const { createExam } = this.state;

		if (!membership) return null;

		const gradeList = membership.course.grades.map((g) => (
			<li key={g.id}><a href="#">{g.name}</a></li>
		));

		const createExamColumn = (() => {
			if (!createExam) return null;
			return (
				<Col sm={6}>
					<Form onSubmit={this.handleSubmit}>
						<h2>New Exam</h2>
						<FormGroup>
							<Label>Name</Label>
							<Input type="text" placeholder="Name" onChange={this.handleChange('name')} />
						</FormGroup>
						<FormGroup check>
							<Label check>
								<Input type="checkbox" />{' '}Available
							</Label>
						</FormGroup>
						<Button>Create</Button>
					</Form>
				</Col>
			)
		})();

		const isTeacher = ~['Instructor', 'TeachingAssistant'].indexOf(membership.courseRoleId)

		return (
			<div className="thulium-tab course-tab">
				<Row>
					<Col sm={6}>
						<h1>Exams</h1>
						<ul className="list-unstyled">
							{gradeList}
						</ul>
						<Button onClick={this.createExam}>New Exam</Button>
					</Col>
					{isTeacher ? createExamColumn : null}
				</Row>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	membership: state.app.courses[state.app.selectedCourse]
});

export default connect(mapStateToProps)(CourseTab);