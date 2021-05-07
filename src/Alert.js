import React from 'react';

const Alert = ({ message, onClose }) => (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{message}</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <footer className="modal-card-foot">
            <button className="button is-success" onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
); 

export default Alert;
