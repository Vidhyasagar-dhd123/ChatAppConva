import React from 'react';
import '../styles/AlertBox.css'

const AlertBox = ({message}) => {
  return (
    <div className="alert-box-container">
      <div className="alert-box">
        <span className="alert-message">{message}</span>
        <button className="close-btn"></button>
      </div>
    </div>
  );
};

export default AlertBox;
