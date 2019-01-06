/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { ModalHeader, UncontrolledTooltip, Badge } from 'reactstrap';
import classNames from 'classnames';
import CSVReader from 'react-csv-reader';

import { changeDatasetTitle, upload } from '../../../actions/datasets';

class UploadDatasets extends React.Component {

  state = {}

  handleChange = key => e => this.setState({ [key]: e.target.value })
  
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
    const { type } = this.props;
    const { modifiedTitle, changingTitle, title } = this.state;
    


    return null;

    return (
      <CSVReader
                cssClass="react-csv-input"
                label="Select CSV"
                onFileLoaded={this.handleFileChange}
              />
    )
  }
}

const mapStateToProps = state => ({
  type: state.dataset.create.type
});

const mapDispatchToProps = dispatch => ({
  changeDatasetTitle: title => dispatch(changeDatasetTitle(title)),
  handleUpload: data => dispatch(upload(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadDatasets);