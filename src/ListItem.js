import React from 'react';

import './ListItem.css';

const ListItem = ({content}) => {
  return (
    <div className="list-item">
      {content}
    </div>
  );
}

export default ListItem;
