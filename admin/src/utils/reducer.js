export function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_DEL_LOADING":
      return { ...state, delLoading: action.payload };
    case "SET_UP_LOADING":
      return { ...state, upLoading: action.payload };
    case "SET_PUNCH_LOADING":
      return { ...state, punchLoading: action.payload };
    default:
      return state;
  }
}
