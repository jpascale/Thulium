import React from 'react';
import { connect } from 'react-redux';

import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import moment from 'moment';
import DateTime from 'react-datetime';

import 'react-datetime/css/react-datetime.css';
import './editor.scss';

import { createExam } from '../../actions/courses';

class CourseTab extends React.Component {

	state = {
		createExam: false,
		since: moment(),
		until: moment().add(3, 'hours')
	}

	createExam = () => this.setState({ createExam: true })

	handleChange = key => e => this.setState({ [key]: e.target ? e.target.value : e })
	handleSubmit = () => {
		const { membership, createExam } = this.props;
		const { title, section, since, until } = this.state;

		const exam = {
			parentId: section,
			title,
			availability: {
				available: 'Yes',
				allowGuests: false,
				adaptiveRelease: {
					start: since.toISOString(),
					end: until.toISOString()
				}
			},
			score: {
				possible: 10
			}
		};

		createExam(membership.courseId, exam).then(() => {
			console.log('created exam');
			alert('Created exam success fully');
			this.setState({
				createExam: false,
				title: '',
				since: moment(),
				until: moment().add(3, 'hours')
			})
		}, err => {
			console.error(err);
			alert('An error ocurred creating the exam. Please try again');
		});
	}

	isValidSince = (currentDate, selectedDate) => {
		return currentDate.isAfter(moment());
	}

	isValidUntil = (currentDate, selectedDate) => {
		const { since } = this.state;
		return currentDate.isAfter(since);
	}

	render = () => {
		const { membership } = this.props;
		const { createExam, since, until } = this.state;

		if (!membership) return null;

		const gradeList = membership.course.grades.filter(g => g.content).map((g) => (
			<li key={g.id}><a href="#">{g.name}</a></li>
		));

		const createExamColumn = (() => {
			if (!createExam) return null;
			return (
				<Col sm={6}>
					<Form onSubmit={this.handleSubmit}>
						<h2>New Exam</h2>
						<FormGroup>
							<Label>Title</Label>
							<Input type="text" placeholder="Title" onChange={this.handleChange('title')} />
						</FormGroup>
						<FormGroup>
							<Label>Section</Label>
							<Input type="select" onChange={this.handleChange('section')}>
								{membership.course.contents.map(c => (
									<option key={c.id} value={c.id}>{c.title}</option>
								))}
							</Input>
						</FormGroup>
						<FormGroup>
							<Label>Available Since</Label>
							<DateTime
								value={since}
								onChange={this.handleChange('since')}
								inputProps={{ placeholder: 'Available Since', className: 'form-control' }}
								isValidDate={this.isValidSince} />
						</FormGroup>
						<FormGroup>
							<Label>Available Until</Label>
							<DateTime
								value={until}
								onChange={this.handleChange('until')}
								inputProps={{ placeholder: 'Available Until', className: 'form-control' }}
								isValidDate={this.isValidUntil}/>
						</FormGroup>
						<Button>Create</Button>
					</Form>
				</Col>
			)
		})();

		const isTeacher = ~['Instructor', 'TeachingAssistant'].indexOf(membership.courseRoleId)

		return (
			<div className="thulium-tab course-tab full-height">
				<Row>
					<Col sm={6}>
						<h1>Exams</h1>
						{!gradeList.length ? (
							<span>No exams for this course. Create one clicking the button below</span>
						) : null}
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

const mapDispatchToProps = dispatch => ({
	createExam: (course, exam) => dispatch(createExam(course, exam))
});

export default connect(mapStateToProps, mapDispatchToProps)(CourseTab);