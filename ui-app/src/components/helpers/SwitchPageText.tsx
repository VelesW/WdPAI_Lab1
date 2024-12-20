import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css'

interface SwitchPageTextProps {
  isLoginPage: boolean; // Determines if we are on the login page
}

const SwitchPageText: React.FC<SwitchPageTextProps> = ({ isLoginPage }) => {
  return (
    <div className="switch-page-text">
        <p>
        {isLoginPage ? (
            <>
            Don't have an account? <Link to="/register">Register</Link>
            </>
        ) : (
            <>
            Already have an account? <Link to="/login">Login</Link>
            </>
            
        )}
      </p>
    </div>
  );
};

export default SwitchPageText;
