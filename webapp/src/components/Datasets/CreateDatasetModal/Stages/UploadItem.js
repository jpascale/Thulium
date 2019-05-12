/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { Collapse, CardBody, Card, CardHeader, UncontrolledTooltip, FormGroup, Label, Input, Form, FormText, Button, Alert } from 'reactstrap';
import classNames from 'classnames';

import { addItemToDataset, assignFileToItem, upload } from '../../../../actions/datasets';

import AddIcon from '../../../common/AddIcon';

class UploadItem extends React.Component {

  state = {
    collapsed: false,
    title: this.props.item ? this.props.item.title : ''
  }

  handleChange = key => e => this.setState({ [key]: e.target.value })
  toggleFirstLine = e => this.setState({ firstLine: e.target.checked })
  toggleExamDataset = e => this.setState({ examDataset: e.target.checked })
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

  handleBlur = e => this.toggleTitleEdit()

  handleInputClick = e => {
    e.preventDefault();
    e.stopPropagation();
  }

  handleFileChange = e => {
    const file = e.target.files[0];
    this.setState({ file });
  }

  handleReducedFileChange = e => {
    const reducedFile = e.target.files[0];
    this.setState({ reducedFile });
  }

  process = e => {
    const { assignFileToItem, item, options } = this.props;
    const { file, reducedFile, firstLine } = this.state;
    assignFileToItem(item.id, file, {
      firstLine,
      examDataset: options && options.examDataset || false,
      reducedFile: reducedFile || false
    });
  }

  render = () => {
    const { adding, sql, item, options } = this.props;
    const { changingTitle, collapsed, title, file, reducedFile } = this.state;

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
            {header} {item && item.errorText}
          </CardHeader>
          {!adding && (
            <Collapse isOpen={!collapsed}>
              <CardBody>
                <Form>
                  <FormGroup>
                    <Label>File</Label>
                    <Input type="file" accept=".csv, text/csv" onChange={this.handleFileChange} />
                    <FormText color="muted">We only accept CSV Files</FormText>
                  </FormGroup>
                  {this.props.options && this.props.options.examDataset &&
                    <FormGroup>
                      <Label>Reduced file</Label>
                      <Input type="file" accept=".csv, text/csv" onChange={this.handleReducedFileChange} />
                      <FormText color="muted">We only accept CSV Files</FormText>
                    </FormGroup>}
                  <FormGroup check>
                    <Label check>
                      <Input type="checkbox" onChange={this.toggleFirstLine} /> First line contains column names
                    </Label>
                  </FormGroup>
                  <Button size="sm" disabled={!file || (options && options.examDataset && !reducedFile)} onClick={this.process}>Process File</Button>
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
  assignFileToItem: (id, file, options) => dispatch(assignFileToItem(id, file, options)),
  handleUpload: data => dispatch(upload(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadItem);