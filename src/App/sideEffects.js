import api from './api';

export default function(state, dispatch, action) {
  console.log('sideEffects', action);
  switch (action.type) {
    case 'FETCH_PAGE':
      const start = (action.payload - 1) * 10;
      return api.fetch({offset: start, limit: 10})
        .then(res => dispatch({type:'FETCH_PAGE_RESOLVED', payload: res}));
      break;
    default:

  }
}
