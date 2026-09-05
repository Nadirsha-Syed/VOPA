export const Card = ({ children, className = '', padding = 'p-6', ...props }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-100 ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
