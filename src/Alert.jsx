import React from 'react';

const Alert = ({ message, onClose }) => (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Application Alert</p>
          <button className="delete" aria-label="close"></button>
        </header>
        <section className="modal-card-body">
            { message }
        </section>
        <footer className="modal-card-foot">
          <button className="button is-success" onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
); 

export default Alert;
