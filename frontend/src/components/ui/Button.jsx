// components/ui/Button.jsx
function Button({ onClick, disabled, children, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm font-semibold ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
