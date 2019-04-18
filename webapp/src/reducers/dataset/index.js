import initialState from './initialState';
import handlers from './handlers';

const datasetReducer = (state = initialState, action) => {
  const handler = handlers[action.type];
  return handler ? handler(state, action.payload) : state;
}

export default datasetReducer;