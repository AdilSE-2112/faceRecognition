import React from 'react';

const CirclePopup = ({ data, onClose }) => {
  return (
    <div className="circle-popup">
      <h2>Details</h2>
      <p>Name: {data.name}</p>
      <p>Age: {data.age}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CirclePopup;
