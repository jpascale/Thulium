import CA from '../constants/upload_file';
import * as UploadFileService from '../services/upload_file'

const uploadingFile = () => ({
  type: CA.UPLOADING_FILE,
  loading: true
});

const uploaded = (data) => (dispatch, getState) => {
  dispatch({
    type: CA.UPLOADED,
    payload: { data }
  });
};

const uploadFailed = () => ({
  type: CA.UPLOAD_FAILED
});

export const upload = (data) => (dispatch, getState) => {
  dispatch(uploadingFile());
  return UploadFileService.upload(data).then(data => {
    dispatch(uploaded(data))
  })
}