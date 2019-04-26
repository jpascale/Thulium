/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Badge } from 'reactstrap';

import { changeDatasetType } from '../../../../actions/datasets';

const src = title => `https://via.placeholder.com/200x150.png/eee/aaa?text=${title}`

const PickType = ({ type, changeDatasetType }) => (
	<div className="text-center pick-type">
		<img onClick={() => changeDatasetType('SQL')} src={src('SQL')} className={classNames('rounded img-thumbnail', { selected: type === 'SQL' })}></img>
		<div>
			<img src={src('NoSQL')} className="rounded img-thumbnail disabled"></img>
			<Badge color="primary">SOON</Badge>
		</div>
	</div>
);

const mapStateToProps = state => ({
	type: state.dataset.create.type
});

const mapDispatchToProps = dispatch => ({
	changeDatasetType: type => dispatch(changeDatasetType(type))
});

export default connect(mapStateToProps, mapDispatchToProps)(PickType);