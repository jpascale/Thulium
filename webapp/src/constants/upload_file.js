import constants from 'namespace-constants';

export default constants('upload_file', [
  'uploading file',
  'upload failed',
  'uploaded'
], {
    separator: '/',
    transform: v => v.replace(/ /g, '_').toUpperCase()
  });