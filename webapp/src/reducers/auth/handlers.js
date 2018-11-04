import C from '../../constants/auth';
import objectAssign from 'object-assign';

export default {
  [C.AUTHENTICATED] : (state, data) => {
		return objectAssign({}, state, data);
	},
}