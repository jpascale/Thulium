import C from '../../constants/dataset';
import objectAssign from 'object-assign';

export default {
  [C.CHANGE_TITLE] : (state, title) => {
		const create = objectAssign({}, state.create, { title });
		return objectAssign({}, state, { create });
	},

	[C.CHANGE_TYPE] : (state, type) => {
		const create = objectAssign({}, state.create, { type });
		return objectAssign({}, state, { create });
	}
}