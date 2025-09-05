import './LoadingSpinner.css';

function LoadingSpinner({ size = 'medium', message = 'Loading...' }) {
  const sizeClass = `spinner-${size}`;
  
  return (
    <div className="loading-container">
      <div className={`loading-spinner ${sizeClass}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;
