/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { Collapse, CardBody, Card, CardHeader, UncontrolledTooltip, FormGroup, Label, Input, Form, FormText } from 'reactstrap';
import classNames from 'classnames';

import { addItemToDataset, assignFileToItem, upload } from '../../../actions/datasets';

import AddIcon from '../../common/AddIcon';

class UploadItem extends React.Component {

  state = {
    collapsed: false,
    title: this.props.item ? this.props.item.title : ''
  }

  handleChange = key => e => this.setState({ [key]: e.target.value })
  toggleCollapsed = e => this.setState({ collapsed: !this.state.collapsed })
  toggleTitleEdit = e => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.setState({ changingTitle: !this.state.changingTitle })
  }
  handleKeyPress = e => {
    const { adding, addItemToDataset } = this.props;
    const { title } = this.state;
    if (e.key === 'Enter') {
      if (adding) {
        addItemToDataset(title);
        this.setState({ title: '' });
      }
      return this.toggleTitleEdit();
    }
  }

  handleBlur = e => {
    this.toggleTitleEdit();
  }

  handleInputClick = e => {
    e.preventDefault();
    e.stopPropagation();
  }
  
  handleFileChange = e => {
    const { assignFileToItem, item } = this.props;
    const file = e.target.files[0];
    assignFileToItem(item.id, file);
  }

  render = () => {
    const { adding, sql, item } = this.props;
    const { changingTitle, collapsed, title } = this.state;

    const header = (() => {
      if (changingTitle) {
        return (
          <input type="text" autoFocus className="form-control form-control-sm" value={title} onClick={this.handleInputClick} onChange={this.handleChange('title')} onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} />
        )
      }
      if (adding) {
        return (
          <span onClick={this.toggleTitleEdit}><AddIcon /> Add {sql ? 'Table' : 'Collection'}</span>
        );
      }
      const spanId = `title-${item.id}`;
      return (
        <React.Fragment>
          <span id={spanId} onClick={collapsed ? undefined : this.toggleTitleEdit}>{title}</span>
          <UncontrolledTooltip placement="right" target={spanId}>
            Click to change
          </UncontrolledTooltip>
        </React.Fragment>
      );
    })();

    const headerClassNames = classNames({
      'bg-dark': adding,
      'text-white': adding || (item && item.error) || (item && item.data),
      'bg-danger': item && item.error,
      'bg-success': item && item.data
    });

    return (
      <React.Fragment>
        <Card>
          <CardHeader className={headerClassNames} onClick={adding ? undefined : this.toggleCollapsed}>
            {header}
          </CardHeader>
          {!adding && (
            <Collapse isOpen={!collapsed}>
              <CardBody>
                <Form>
                  <FormGroup>
                    <Input type="file" accept=".csv, text/csv" onChange={this.handleFileChange} />
                    <FormText color="muted">We only accept CSV Files</FormText>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input type="checkbox" /> First line contains column names
                    </Label>
                  </FormGroup>
                </Form>
              </CardBody>
            </Collapse>
          )}
        </Card>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  sql: state.dataset.create.type === 'SQL'
});

const mapDispatchToProps = dispatch => ({
  addItemToDataset: title => dispatch(addItemToDataset(title)),
  assignFileToItem: (id, file) => dispatch(assignFileToItem(id, file)),
  handleUpload: data => dispatch(upload(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadItem);