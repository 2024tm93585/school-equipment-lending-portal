import React, { useState, useEffect } from 'react';

function PromptDialog({ isOpen, onClose, onSubmit, title, message, placeholder = '', defaultValue = '', inputType = 'text', options = null }) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
    }
  }, [isOpen, defaultValue]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
    onClose();
  };

  const handleCancel = () => {
    setValue('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="confirm-dialog-header">
            <span className="confirm-dialog-icon">✏️</span>
            <h3 className="confirm-dialog-title">{title}</h3>
          </div>
          <div className="confirm-dialog-body">
            {message && <p className="confirm-dialog-message">{message}</p>}
            {options ? (
              <select
                className="form-select"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoFocus
                required
              >
                <option value="">Select an option...</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : inputType === 'textarea' ? (
              <textarea
                className="form-textarea"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                autoFocus
                rows={4}
              />
            ) : (
              <input
                type={inputType}
                className="form-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                autoFocus
              />
            )}
          </div>
          <div className="confirm-dialog-footer">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PromptDialog;
