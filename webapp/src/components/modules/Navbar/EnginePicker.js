import React from 'react';
import { connect } from 'react-redux';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { changeEngine } from '../../../actions/app';

class EnginePicker extends React.Component {

	changeEngine = (engine) => {
		console.log(engine);
		this.props.changeEngine(engine);
	}

	renderEngines = () => {
		const { engines, currentEngine } = this.props;

		return Object.keys(engines).map(engine => (
			<DropdownItem key={engine} toggle={false} onClick={() => this.changeEngine(engine)}>
				{currentEngine === engine ? '✓' : ''} {engines[engine].displayName}
			</DropdownItem>
		));
	}

	render() {
		const { engines, currentEngine } = this.props;
		return (
			<UncontrolledDropdown nav inNavbar>
				<DropdownToggle nav caret>
					Engine ({engines[currentEngine].displayName})
				</DropdownToggle>
				<DropdownMenu right>
					{this.renderEngines()}
				</DropdownMenu>
			</UncontrolledDropdown>
		)
	}
}

const mapStateToProps = state => ({
	engines: state.app.engines,
	currentEngine: state.app.currentEngine
});

const mapDispatchToProps = dispatch => ({
	changeEngine: engine => dispatch(changeEngine(engine))
})

export default connect(mapStateToProps, mapDispatchToProps)(EnginePicker);