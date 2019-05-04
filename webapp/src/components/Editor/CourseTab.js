import React from 'react';
import { connect } from 'react-redux';

import { Row, Col, Form, FormGroup, Label, Input, Button, Badge, ButtonToolbar, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import moment from 'moment';
import DateTime from 'react-datetime';

import 'react-datetime/css/react-datetime.css';
import './editor.scss';

import { createExam } from '../../actions/courses';

const examTypes = {
	"true-false": "True/False",
	"multiple-choice": "Multiple Choice",
	"written-answer": "Written Answer",
	"query-response": "Query Response",
};

class CourseTab extends React.Component {

	state = {
		createExam: false,
		since: moment(),
		until: moment().add(3, 'hours'),
		questions: [],
		selectedQuestion: null
	}

	componentWillUpdate = (nextProps, nextState) => {
		if (nextState.type !== this.state.type) {
			nextState.correctAnswer = '';
			nextState.numberOfOptions = '';
		}
	}

	createExam = () => this.setState({ createExam: true })

	handleChange = key => e => this.setState({ [key]: e.target ? e.target.value : e })
	handleSubmit = () => {
		const { membership, createExam } = this.props;
		const {
			title,
			section,
			since,
			until,
			questions
		} = this.state;

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
			},
			questions: questions.map(q => ({
				content: q.content,
				type: q.type,
				dataset: q.dataset,
				engine: q.engine,
				correct_answer: q.correctAnswer || undefined,
				options: q.numberOfOptions ? { total: q.numberOfOptions } : undefined
			}))
		};

		createExam(membership.courseId, exam).then(() => {
			console.log('created exam');
			alert('Created exam successfully');
			this.setState({
				createExam: false,
				selectedQuestion: null,
				title: '',
				since: moment(),
				until: moment().add(3, 'hours'),
				questions: []
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

	addQuestion = () => {
		const { questions: prevQuestions } = this.state;
		const questions = prevQuestions.concat({ content: '' });
		this.setState({
			questions,
			selectedQuestion: prevQuestions.length,
			content: '',
			dataset: '',
			engine: '',
			type: '',
			numberOfOptions: '',
			correctAnswer: ''
		});
	}

	selectQuestion = i => () => {
		const { questions } = this.state;
		this.setState({
			selectedQuestion: i,
			...questions[i]
		});
	}

	saveQuestion = (i, close) => () => {
		const { content, dataset, engine, type, correctAnswer, numberOfOptions, questions: prevQuestions, selectedQuestion } = this.state;
		const questions = prevQuestions.slice();
		questions[i].content = content;
		questions[i].dataset = dataset;
		questions[i].engine = engine;
		questions[i].type = type;
		questions[i].correctAnswer = correctAnswer;
		questions[i].numberOfOptions = numberOfOptions;
		this.setState({
			questions,
			selectedQuestion: close ? null : selectedQuestion,
			content: close ? '' : content,
			dataset: close ? '' : dataset,
			engine: close ? '' : engine,
			type: close ? '' : type,
			numberOfOptions: close ? '' : numberOfOptions,
			correctAnswer: close ? '' : correctAnswer
		});
	}

	render = () => {
		const { membership, datasets, engines } = this.props;
		const {
			createExam,
			since,
			until,
			questions,
			selectedQuestion,
			dataset,
			content,
			engine,
			type,
			correctAnswer,
			numberOfOptions
		} = this.state;

		if (!membership) return null;

		const gradeList = membership.course.grades.filter(g => g.content).map((g) => (
			<li key={g.id}><a href="#">{g.name}</a></li>
		));

		const createExamColumn = (() => {
			if (!createExam) return null;
			return (
				<Col>
					<Form onSubmit={this.handleSubmit}>
						<h2>New Exam</h2>
						<FormGroup>
							<Label>Title</Label>
							<Input bsSize="sm" type="text" placeholder="Title" onChange={this.handleChange('title')} />
						</FormGroup>
						<FormGroup>
							<Label>Section</Label>
							<Input bsSize="sm" type="select" onChange={this.handleChange('section')}>
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
						<FormGroup>
							<Label>Questions</Label>
							<ListGroup flush>
								{!questions.length ? (
									<ListGroupItem tag="a">
										<ListGroupItemHeading>No questions for this exam</ListGroupItemHeading>
										<ListGroupItemText>
											<Button size="sm" onClick={this.addQuestion}>Add question</Button>
										</ListGroupItemText>
									</ListGroupItem>
								) : null}
								{questions.map((question, i) => (
									<ListGroupItem key={i} color={i === selectedQuestion ? 'info' : undefined} tag="button" type="button" action onClick={this.selectQuestion(i)}>
										<ListGroupItemHeading className="d-flex justify-content-end align-items-center">
											<span style={{flexGrow:1}}>Question #{i + 1}</span>
											{question.type ? <Badge color="primary" pill>{examTypes[question.type]}</Badge> : null}
											{question.engine ? <Badge color="primary" pill>{engines[question.engine].title}</Badge> : null}
											{question.dataset ? <Badge color="primary" pill>{datasets[question.dataset].title}</Badge> : null}
										</ListGroupItemHeading>
										<ListGroupItemText>{question.content.substr(0, 80)}</ListGroupItemText>
									</ListGroupItem>
								))}
								{questions.length ? (
									<ListGroupItem tag="a">
										<ListGroupItemText>
											<Button size="sm" onClick={this.addQuestion}>Add another question</Button>
										</ListGroupItemText>
									</ListGroupItem>
								) : null}
							</ListGroup>
						</FormGroup>
						<Button size="sm">Create</Button>
					</Form>
				</Col>
			)
		})();

		const correctAnswerForm = (() => {
			if (!type) return null;

			if (type === 'written-answer') return null;

			if (type === 'true-false') {
				return (
					<FormGroup>
						<Label>Correct Answer</Label>
						<Input bsSize="sm" type="select" value={correctAnswer} onChange={this.handleChange('correctAnswer')}>
							<option value={''}>Select Correct Answer</option>
							<option value={true}>True</option>
							<option value={false}>False</option>
						</Input>
					</FormGroup>
				);
			}

			if (type === 'query-response') {
				return (
					<FormGroup>
						<Label>Correct Answer</Label>
						<Input bsSize="sm" type="textarea" rows={4} placeholder="SELECT * FROM ..." value={correctAnswer} onChange={this.handleChange('correctAnswer')} />
					</FormGroup>
				);
			}

			if (type === 'multiple-choice') {
				return (
					<React.Fragment>
						<FormGroup>
							<Label>Number of Options</Label>
							<Input bsSize="sm" type="select" value={numberOfOptions} onChange={this.handleChange('numberOfOptions')}>
								<option value={''}>Select Number of Options</option>
								{[3, 4, 5, 6].map(n => (
									<option key={n} value={n}>{n}</option>
								))}
							</Input>
						</FormGroup>
						{numberOfOptions && (
							<FormGroup>
								<Label>Correct Answer</Label>
								<Input bsSize="sm" type="select" value={correctAnswer} onChange={this.handleChange('correctAnswer')}>
									<option value={''}>Select Correct Answer</option>
									{Array.from({ length: numberOfOptions }).map((v, i) => (
										<option key={i} value={String.fromCharCode(65 + i)}>{String.fromCharCode(65 + i)}</option>
									))}
								</Input>
							</FormGroup>
						)}
					</React.Fragment>
				);
			}
		})();

		const editQuestionColumn = (() => {
			if (selectedQuestion === null) return;
			return (
				<Col>
					<Form onSubmit={this.handleSubmit}>
						<h2>Question #{selectedQuestion + 1}</h2>
						<FormGroup>
							<Label>Engine</Label>
							<Input bsSize="sm" type="select" value={engine} onChange={this.handleChange('engine')}>
								<option value={''}>Select Engine</option>
								{Object.values(engines).map(d => (
									<option key={d._id} value={d._id}>{d.title}</option>
								))}
							</Input>
						</FormGroup>
						<FormGroup>
							<Label>Dataset</Label>
							<Input bsSize="sm" type="select" value={dataset} onChange={this.handleChange('dataset')}>
							<option value={''}>Select Dataset</option>
								{Object.values(datasets).map(d => (
									<option key={d._id} value={d._id}>{d.title}</option>
								))}
							</Input>
						</FormGroup>
						<FormGroup>
							<Label>Content</Label>
							<Input bsSize="sm" type="textarea" rows={4} placeholder="Question content..." value={content} onChange={this.handleChange('content')} />
						</FormGroup>
						<FormGroup>
							<Label>Type</Label>
							<Input bsSize="sm" type="select" value={type} onChange={this.handleChange('type')}>
								<option value={''}>Select Question Type</option>
								{Object.keys(examTypes).map(k => (
									<option key={k} value={k}>{examTypes[k]}</option>
								))}
							</Input>
						</FormGroup>
						{correctAnswerForm}
						<ButtonToolbar>
							<Button size="sm" onClick={this.saveQuestion(selectedQuestion, false)}>Save</Button>
							<Button size="sm" onClick={this.saveQuestion(selectedQuestion, true)}>Save and close</Button>
						</ButtonToolbar>
					</Form>
				</Col>
			);
		})();

		const isTeacher = ~['Instructor', 'TeachingAssistant'].indexOf(membership.courseRoleId)

		return (
			<div className="thulium-tab course-tab full-height">
				<Row>
					<Col sm={isTeacher && createExamColumn ? 3 : undefined}>
						<h1>Exams</h1>
						{!gradeList.length ? (
							<span>No exams for this course.{isTeacher ? ' Create one clicking the button below' : ''}</span>
						) : null}
						<ul className="list-unstyled">
							{gradeList}
						</ul>
						{isTeacher ? <Button size="sm" onClick={this.createExam}>New Exam</Button> : null}
					</Col>
					{isTeacher ? createExamColumn : null}
					{editQuestionColumn}
				</Row>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	membership: state.app.courses[state.app.selectedCourse],
	datasets: state.app.datasets,
	engines: state.app.engines
});

const mapDispatchToProps = dispatch => ({
	createExam: (course, exam) => dispatch(createExam(course, exam))
});

export default connect(mapStateToProps, mapDispatchToProps)(CourseTab);