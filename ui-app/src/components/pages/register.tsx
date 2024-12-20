import React, { useState } from 'react';
import InputField from '../helpers/inputField';
import SubmitButton from '../helpers/SumbitButton';
import PrivacyAgreement from '../helpers/PrivacyAgreement';
import SwitchPageText from '../helpers/SwitchPageText';
import Response from '../helpers/response';
import '../../App.css'

const Register = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [response, setResponse] = useState<string>("")
  const [error, setError] = useState<string>("")

  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setPrivacyAccepted(false)
  };

  const handlePrivacyChange = (accepted: boolean) => {
    setPrivacyAccepted(accepted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setResponse("")

    if(userData.password!==userData.confirmPassword){
      setError("Passwords need to be the same!")
      return 
    }

    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: userData.username, 
          email: userData.email,
          password: userData.password,
        }),
      });

      if (response.ok) {
        setResponse("Registered correctly! Login to proceed")
      } else {
        setError("Type correct data!");
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
                        <h1 className="main-form-header">Register</h1>
                    </div>
                    
                    <div className='inputs-wrapper'>
                        <div className="input-wrapper">
                            <InputField
                            label="User Name"
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Enter your name"
                            value={userData.username}
                            onChange={handleInputChange}
                            required
                            />
                        </div>
                        <div className="input-wrapper">
                            <InputField
                            label="User Email"
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter your email"
                            value={userData.email}
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
                        <div className="input-wrapper">
                            <InputField
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            placeholder="Confirm your password"
                            value={userData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            />
                        </div>
                    </div>
                    <PrivacyAgreement
                        privacyAccepted={privacyAccepted}
                        onPrivacyChange={handlePrivacyChange}
                    />
                    <SwitchPageText isLoginPage={false} />
                    {response && (
                      <Response data={response} className="information" />
                    )}
                    {error && (
                      <Response data={error} className="error" />
                    )}
                    <SubmitButton
                        onClick={() => handleSubmit}
                        label="Register"
                    />
                    
                </form>
            </section>
        </div>
    </div>
  );
};

export default Register;
