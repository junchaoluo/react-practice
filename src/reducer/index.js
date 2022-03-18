import { ADD_NUMBER, SUB_NUMBER, DECREMENT, INCREMENT } from '../action/index'

const defaultState = {
  count: 0
}

function reducer(state=defaultState, action) {
  switch (action.type){
    case ADD_NUMBER:
      return {
        ...state,
        count: state.count + action.num,
      };
    case SUB_NUMBER:
      return {
        ...state,
        count: state.count - action.num,
      };
    case DECREMENT:
      return {
        ...state,
        count: state.count - 1,
      };
    case INCREMENT:
      return {
        ...state,
        count: state.count + 1,
      };
    default:
      return state;
  }
}

export default reducer;