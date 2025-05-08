import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-gray-700 font-semibold mb-1">{label}</label>
      )}
      <input
        className={`w-full border-2 border-gray-300 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-green-500 ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;
