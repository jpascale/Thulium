import C from '../../constants/dataset';
import objectAssign from 'object-assign';

const nextStages = {
	'pick-paradigm': 'upload-datasets',
	'upload-datasets': 'review-datasets',
	'review-datasets': 'review-actions'
};

const prevStages = {
	'upload-datasets': 'pick-paradigm',
	'review-datasets': 'upload-datasets',
	'review-actions': 'review-datasets'
};

export default {
	[C.UPDATE_DATASET_ACTIONS]: (state, actions) => {
		const create = objectAssign({}, state.create, { actions });
		return objectAssign({}, state, { create });
	},
	[C.CHANGE_TITLE]: (state, title) => {
		const create = objectAssign({}, state.create, { title });
		return objectAssign({}, state, { create });
	},

	[C.CHANGE_TYPE]: (state, paradigm) => {
		const create = objectAssign({}, state.create, { paradigm });
		return objectAssign({}, state, { create });
	},

	[C.NEXT_STAGE]: (state) => {
		const create = objectAssign({}, state.create, {
			stage: nextStages[state.create.stage]
		});
		return objectAssign({}, state, { create });
	},

	[C.PREV_STAGE]: (state) => {
		const create = objectAssign({}, state.create, {
			stage: prevStages[state.create.stage]
		});
		return objectAssign({}, state, { create });
	},

	[C.ADD_ITEM]: (state, title) => {
		const create = objectAssign({}, state.create, {
			items: state.create.items.concat({
				id: state.create.items.length,
				title
			})
		});
		return objectAssign({}, state, { create });
	},

	[C.ASSIGN_FILE_TO_ITEM]: (state, { id, data, headers, types, reduced, error, errorText }) => {
		const nextItems = state.create.items.slice();
		nextItems[id] = objectAssign({}, nextItems[id], { data, headers, types, reduced, error, errorText });
		const create = objectAssign({}, state.create, { items: nextItems });
		return objectAssign({}, state, { create });
	},

	[C.UPDATE_DATA_FOR_ITEM]: (state, { id, delta }) => {
		const { row, index, value } = delta;
		const nextItems = state.create.items.slice();
		const nextData = nextItems[id].data.slice();
		const nextRow = nextData[row].slice();
		nextRow.splice(index, 1, value);
		nextData[row] = nextRow;
		nextItems[id] = objectAssign({}, nextItems[id], { data: nextData });
		const create = objectAssign({}, state.create, { items: nextItems });
		return objectAssign({}, state, { create });
	},

	[C.UPDATE_HEADER_FOR_ITEM]: (state, { id, delta }) => {
		const { index, value } = delta;
		const nextItems = state.create.items.slice();
		const nextHeaders = nextItems[id].headers.slice();
		nextHeaders.splice(index, 1, value);
		nextItems[id] = objectAssign({}, nextItems[id], { headers: nextHeaders });
		const create = objectAssign({}, state.create, { items: nextItems });
		return objectAssign({}, state, { create });
	},

	[C.UPDATE_TYPE_FOR_ITEM]: (state, { id, delta }) => {
		const { index, value } = delta;
		const nextItems = state.create.items.slice();
		const nextTypes = nextItems[id].types.slice();
		nextTypes.splice(index, 1, value);
		nextItems[id] = objectAssign({}, nextItems[id], { types: nextTypes });
		const create = objectAssign({}, state.create, { items: nextItems });
		return objectAssign({}, state, { create });
	},

	[C.USE_EXAM_TYPE_DATASET]: (state, { exam }) => {
		const create = objectAssign({}, state.create, { exam });
		return objectAssign({}, state, { create });
	},

	[C.CREATING_DATASET]: state => {
		return objectAssign({}, state, { creating: true });
	},

	[C.CREATED_DATASET]: (state, payload) => {
		return objectAssign({}, state, { creating: false });
	},
	[C.SHOW_DATASET_MODAL]: (state, show) => {
    return objectAssign({}, state, {
			create: {
				stage: 'pick-paradigm',
				paradigm: 'sql',
				items: []
			}
		});
  },
}