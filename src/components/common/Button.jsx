export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "font-semibold rounded-xl px-6 py-3 transition-colors duration-200 flex items-center justify-center";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-light shadow-sm",
    secondary: "bg-pastel-purple text-primary-dark hover:bg-purple-200",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-gray-600 hover:bg-gray-100",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
