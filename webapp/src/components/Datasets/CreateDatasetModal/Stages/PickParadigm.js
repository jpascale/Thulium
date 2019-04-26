/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Badge } from 'reactstrap';

import { changeDatasetParadigm } from '../../../../actions/datasets';

const src = title => `https://via.placeholder.com/200x150.png/eee/aaa?text=${title}`

const PickParadigm = ({ paradigm, changeDatasetParadigm }) => (
	<div className="text-center pick-paradigm">
		<img onClick={() => changeDatasetParadigm('sql')} src={src('SQL')} className={classNames('rounded img-thumbnail', { selected: paradigm === 'sql' })}></img>
		<div>
			<img src={src('NoSQL')} className="rounded img-thumbnail disabled"></img>
			<Badge color="primary">SOON</Badge>
		</div>
	</div>
);

const mapStateToProps = state => ({
	paradigm: state.dataset.create.paradigm
});

const mapDispatchToProps = dispatch => ({
	changeDatasetParadigm: paradigm => dispatch(changeDatasetParadigm(paradigm))
});

export default connect(mapStateToProps, mapDispatchToProps)(PickParadigm);