import React from 'react';

const InfinitePaged = ({items = [], Component}) => {
  return (
    <div>
    {
      items.map((item, i) => <Component key={i} {...item} />)
    }
    </div>
  );
};

export default InfinitePaged;
