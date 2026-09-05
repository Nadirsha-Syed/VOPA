export default function Button({ children, variant = 'primary', size = 'md', className = '', onClick, type = 'button', disabled = false }) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }[variant] || 'btn-primary'

  const sizeClass = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  }[size] || 'btn-md'

  return (
    <button type={type} className={`btn ${variantClass} ${sizeClass} ${className}`.trim()} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
