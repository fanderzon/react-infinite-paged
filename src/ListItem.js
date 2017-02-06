import React from 'react';

import './ListItem.css';

const ListItem = ({children}) => (
  <div className="list-item">
    {children}
  </div>
);

export default ListItem;
