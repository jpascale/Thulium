import constants from 'namespace-constants';

export default constants('dataset', [
  'fetching',
  'fetched',

  'uploading file',
  'upload failed',
  'uploaded',


  'change title',
  'change type',
  'add item',
  'assign file to item',
  'update data for item',
  'update header for item',
  'update type for item',

  'next stage',
  'prev stage',

  'creating dataset',
  'created dataset',

  'use exam type dataset'
], {
    separator: '/',
    transform: v => v.replace(/ /g, '_').toUpperCase()
  });