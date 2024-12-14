import React, { useState } from 'react';
import InputField from '../helpers/inputField';
import SubmitButton from '../helpers/SumbitButton';
import SwitchPageText from '../helpers/SwitchPageText';
import '../../App.css'

const Login = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login actions
    console.log('Login User:', userData);
    alert('User Logged In!');
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
