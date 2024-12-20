import React from 'react';
import '../../App.css'

interface SubmitButtonProps {
  onClick: (e: React.MouseEvent) => void;
  label: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick, label }) => {
  return (
    <button type="submit" className="submit-button" onClick={onClick}>
      {label}
    </button>
  );
};

export default SubmitButton;
