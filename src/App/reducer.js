const FETCH_PAGE_RESOLVED = 'FETCH_PAGE_RESOLVED';

function reducer(state = {pages: [], items: []}, action = {}) {
  switch (action.type) {
    case FETCH_PAGE_RESOLVED:
    console.log('reducer FETCH_PAGE_RESOLVED', action.payload);
      return {
        ...state,
        items: [ ...state.pages, ...action.payload ]
      };
    default:
      return state;
  }
}

export default reducer;
