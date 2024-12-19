import React, { useState } from 'react';
import InputField from '../helpers/inputField';
import SubmitButton from '../helpers/SumbitButton';
import SwitchPageText from '../helpers/SwitchPageText';
import { useNavigate } from 'react-router-dom';
import Response from '../helpers/response';
import '../../App.css'

const Login = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: userData.username, 
          password: userData.password,
        }),
      });

      if (response.ok) {
        const data: { access: string; refresh: string } = await response.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        navigate('/users');
      } else {
        const errorData: { detail?: string } = await response.json();
        setError(errorData.detail || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="main-container">
        <div className="wrapper">
            <section className="form-section">
                <form onSubmit={handleSubmit} className="main-form">
                    <div className='header-wrapper'>
                        <h1 className="main-form-header">Login</h1>
                    </div>
                    <div className='inputs-wrapper'>
                        <div className="input-wrapper">
                            <InputField
                            label="User Name"
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Enter your username"
                            value={userData.username}
                            onChange={handleInputChange}
                            required
                            />
                        </div>
                        <div className="input-wrapper">
                            <InputField
                            label="Password"
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter your password"
                            value={userData.password}
                            onChange={handleInputChange}
                            required
                            />
                        </div>
                    </div>
                    <SwitchPageText isLoginPage={true} />
                    {error && (
                      <Response data={error} className="error" />
                    )}
                    <SubmitButton
                        onClick={() => handleSubmit}
                        label="Login"
                    />
                    
                </form>
            </section>
        </div>
    </div>
  );
};

export default Login;
