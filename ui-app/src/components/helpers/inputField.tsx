import React from 'react';
import '../../App.css'

interface InputFieldProps {
  label: string;
  type: string;
  name: string;
  id: string;
  placeholder: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  name,
  id,
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  return (
    <div className="input-wrapper">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        className="form-input"
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default InputField;
