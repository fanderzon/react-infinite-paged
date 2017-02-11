let items = Array.apply(null, Array(1000)).map((item, i) => ({ id: i, content: i}));

const api = {
  fetch({offset,limit}) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(items.slice(offset, (offset + limit)));
      }, 2000);
    });
  }
};

export default api;
