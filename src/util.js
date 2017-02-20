export function connectedPages(pages, startAtPage) {
  // We only want to create an pages list based on consecutive loaded pages
  // around the currentPage
  let arr = [];
  let currentIndex = pages.findIndex(i => i.id === startAtPage);
  if (currentIndex < 0) {
    return [];
  }

  for (let i = currentIndex; i < pages.length; i++) {
    let page = pages[i];
    // As long as we have loaded pages add their items to the array
    if (page.loaded) {
      arr = [ ...arr, page ];
    } else {
      break;
    }
  }
  for (let i = (currentIndex - 1); i > -1; i--) {
    let page = pages[i];
    // As long as we have loaded pages add their items to the array
    if (page.loaded) {
      arr = [ page, ...arr ];
    } else {
      break;
    }
  }

  return arr;
}

export function itemsFromPages(pages) {
  return pages.reduce((acc, curr) => {
    return [ ...acc, ...curr.items ];
  }, []);
}

export function sortPages(pages) {
  return pages.concat().sort((a, b) => (a.id < b.id) ? -1 : 1);
}
