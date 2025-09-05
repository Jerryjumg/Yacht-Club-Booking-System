import './Button.css';

function Button({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const baseClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full' : '',
    isLoading ? 'btn-loading' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <span className="btn-spinner"></span>}
      {leftIcon && !isLoading && <span className="btn-icon btn-icon-left">{leftIcon}</span>}
      <span className={`btn-text ${isLoading ? 'btn-text-loading' : ''}`}>
        {children}
      </span>
      {rightIcon && !isLoading && <span className="btn-icon btn-icon-right">{rightIcon}</span>}
    </button>
  );
}

export default Button;
