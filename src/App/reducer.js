const FETCH_PAGE = 'FETCH_PAGE';
const FETCH_PAGE_RESOLVED = 'FETCH_PAGE_RESOLVED';

function reducer(state = {pages: []}, {type, payload} = {}) {
  switch (type) {
    case FETCH_PAGE:
      return {
        ...state,
        pages: mergeOrAdd(state.pages, { id: payload, loaded: false })
      };
    case FETCH_PAGE_RESOLVED:
    const { page, items } = payload;
      return {
        ...state,
        pages: mergeOrAdd(state.pages, payload)
      };
    default:
      return state;
  }
}

function mergeOrAdd(arr, obj) {
  const foundIndex = arr.findIndex(o => o.id === obj.id);
  if (foundIndex < 0) {
    return [
      ...arr,
      obj
    ];
  }
  return arr.map((o,i) => i === foundIndex ?
    { ...o, ...obj } : o);
}

export default reducer;
