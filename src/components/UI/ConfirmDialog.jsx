import Modal from './Modal';
import './ConfirmDialog.css';

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'default', // 'default', 'danger', 'warning'
  isLoading = false
}) {
  const handleConfirm = () => {
    onConfirm();
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return '⚠️';
      case 'warning':
        return '⚡';
      default:
        return '❓';
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="small"
      showCloseButton={false}
      closeOnOverlayClick={!isLoading}
    >
      <div className={`confirm-dialog confirm-${type}`}>
        <div className="confirm-icon">
          {getIcon()}
        </div>
        
        <div className="confirm-content">
          <h3 className="confirm-title">{title}</h3>
          <p className="confirm-message">{message}</p>
        </div>
        
        <div className="confirm-actions">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="confirm-button confirm-cancel"
            type="button"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`confirm-button confirm-primary confirm-${type}`}
            type="button"
          >
            {isLoading ? (
              <>
                <span className="loading-spinner-small"></span>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
