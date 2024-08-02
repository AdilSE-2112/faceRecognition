// TitleInputPair.js
import React from "react";
import './style.scss'

const TitleInputPair = ({ title, placeholder }) => {
  return (
    <div className="title-input-pair">
      <div className="label">
      <label>{title}</label>
      </div>
      <div className="input-change">
      <input type="text" placeholder={placeholder} disabled />
      </div>
    </div>
  );
};

export default TitleInputPair;
