/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import classNames from 'classnames';
import { updateDatasetActions } from '../../../../actions/datasets';

const toLabelText = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.replace(/_/, ' ').slice(1);
}

class ReviewActions extends React.Component {
  state = {
    actions: {
      can_create: false,
      can_alter: false
    }
  }

  componentDidMount = () => {
    this.props.updateDatasetActions(this.state.actions);
  }

  componentDidUpdate = () => {
    this.props.updateDatasetActions(this.state.actions);
  }

  toggleUpdateAction = (key) => {
    this.setState((prevState) => {
      return {
        actions: {
          ...prevState.actions,
          [key]: !prevState.actions[key]
        }
      }
    });
  }

  render = () => {
    const { actions } = this.state;
    const availableActions = Object.keys(actions);
    return (
      <div className="review-datasets d-flex flex-row">
        <Form>
          {availableActions.map((action) => {
            return (
              <FormGroup key={`formgroup_${action}`} check>
                <Label key={`label_${action}`} for={action} check>
                  <Input id={action} key={`input_${action}`} type="checkbox" onChange={() => this.toggleUpdateAction(action)} value={actions[action]} />
                  {toLabelText(action)}
                </Label>
              </FormGroup>
            )
          })}
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
  updateDatasetActions: (actions) => dispatch(updateDatasetActions(actions))
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewActions);