import api from './api';

/* eslint-disable default-case */
export default function(state, dispatch, {type, payload}) {
  switch (type) {
    case 'FETCH_PAGE':
      const start = (payload - 1) * 10;
      return api.fetch({offset: start, limit: 10})
        .then(res => dispatch({type:'FETCH_PAGE_RESOLVED', payload: {
          id: payload,
          loaded: true,
          items: res
        }}));
  }
}
