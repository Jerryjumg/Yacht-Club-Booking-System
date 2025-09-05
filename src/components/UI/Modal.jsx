import { useEffect } from 'react';
import './Modal.css';

function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true 
}) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay animate-fadeIn" onClick={handleOverlayClick}>
      <div className={`modal-content modal-${size} animate-scaleIn glass-dark`}>
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && <h2 className="modal-title font-heading">{title}</h2>}
            {showCloseButton && (
              <button 
                onClick={onClose}
                className="modal-close-button"
                aria-label="Close modal"
                type="button"
              >
                ✕
              </button>
            )}
          </div>
        )}
        
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
