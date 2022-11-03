//types
const INCREMENT = 'counter/INCREMENT';

const initialState = {
  count: 0
};

//reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case INCREMENT:
      const {count} = state;
      return {
        count: count + 1
      };
    default:
      return state;
  }
}

//actions
export function increment() {
  return {
    type: INCREMENT
  };
}
