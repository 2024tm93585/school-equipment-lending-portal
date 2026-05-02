import React from 'react';

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'confirm' }) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return '⚠️';
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      default:
        return '❓';
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'btn-danger';
      case 'success':
        return 'btn-success';
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
          <button className="btn btn-secondary" onClick={onClose}>
            {cancelText}
          </button>
          <button className={`btn ${getButtonClass()}`} onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
