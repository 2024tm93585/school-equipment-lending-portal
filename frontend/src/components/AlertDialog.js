import React from 'react';

function AlertDialog({ isOpen, onClose, title, message, type = 'info' }) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'success':
        return 'btn-success';
      case 'error':
        return 'btn-danger';
      case 'warning':
        return 'btn-warning';
      default:
        return 'btn-primary';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-dialog-header">
          <span className="confirm-dialog-icon">{getIcon()}</span>
          <h3 className="confirm-dialog-title">{title}</h3>
        </div>
        <div className="confirm-dialog-body">
          <p className="confirm-dialog-message">{message}</p>
        </div>
        <div className="confirm-dialog-footer">
          <button className={`btn ${getButtonClass()}`} onClick={onClose} autoFocus>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertDialog;
