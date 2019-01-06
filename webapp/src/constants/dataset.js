import constants from 'namespace-constants';

export default constants('dataset', [
  'uploading file',
  'upload failed',
  'uploaded',


  'change title',
  'change type',
  'add item',
  'assign file to item',

  'next stage',
], {
    separator: '/',
    transform: v => v.replace(/ /g, '_').toUpperCase()
  });