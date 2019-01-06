import CD from '../constants/dataset';
import * as DatasetService from '../services/dataset'

const uploadingFile = () => ({
  type: CD.UPLOADING_FILE,
  loading: true
});

const uploaded = (data) => (dispatch, getState) => {
  dispatch({
    type: CD.UPLOADED,
    payload: { data }
  });
};

const uploadFailed = () => ({
  type: CD.UPLOAD_FAILED
});

export const upload = (data) => (dispatch, getState) => {
  dispatch(uploadingFile());
  return DatasetService.upload(data).then(data => {
    dispatch(uploaded(data))
  })
}