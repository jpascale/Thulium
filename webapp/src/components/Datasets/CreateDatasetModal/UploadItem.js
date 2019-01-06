/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { Collapse, CardBody, Card, CardHeader } from 'reactstrap';
import classNames from 'classnames';

import { addItemToDataset, upload } from '../../../actions/datasets';

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
    const { adding } = this.props;
    if (adding) {
      return this.toggleTitleEdit();
    }
  }

  handleInputClick = e => {
    e.preventDefault();
    e.stopPropagation();
  }
  
  handleFileChange = data => this.setState({ data })
  handleUpload = () => {
    const { handleUpload } = this.props;
    const { data } = this.state;
    handleUpload(data).then(() => {
      this.closeModal();
    }, err => {
      console.error(err);
    });
  }

  

  render = () => {
    const { adding, sql } = this.props;
    const { changingTitle, collapsed, title } = this.state;

    const header = (() => {
      if (changingTitle) {
        return (
          <input type="text" className="form-control form-control-sm" value={title} onClick={this.handleInputClick} onChange={this.handleChange('title')} onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} />
        )
      }
      if (adding) {
        return (
          <span onClick={this.toggleTitleEdit}><AddIcon /> Add {sql ? 'Table' : 'Collection'}</span>
        );
      }
      return <span onClick={collapsed ? undefined : this.toggleTitleEdit}>{title}</span>;
    })();

    return (
      <React.Fragment>
        <Card>
          <CardHeader className={classNames({ 'bg-dark': adding, 'text-white': adding })} onClick={adding ? undefined : this.toggleCollapsed}>
            {header}
          </CardHeader>
          {!adding && (
            <Collapse isOpen={!collapsed}>
              <CardBody>
                <input type="file"  accept=".csv, text/csv" onChange={e => {}} />
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
  handleUpload: data => dispatch(upload(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadItem);