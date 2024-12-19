import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../../models/User';
import { UserDto } from '../../models/UserDto';
import InputField from '../helpers/inputField';
import PrivacyAgreement from '../helpers/PrivacyAgreement';
import SubmitButton from '../helpers/SumbitButton';
import '../../App.css'
import LogoutButton from '../helpers/logoutButton';

const UserList = () => {
    const defaultUser: UserDto = {
        first_name: "",
        last_name: "",
        role: "",
    };

    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState<UserDto>(defaultUser);
    const [privacyAccepted, setPrivacyAccepted] = useState<boolean>(false);
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        axios.get('http://localhost:8000/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                console.log(response)
                setUsers(response.data);
            })
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const handleAddUser = (e: React.MouseEvent) => {
        e.preventDefault()
        axios.post('http://localhost:8000/api/users/', newUser, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                setUsers([...users, response.data]);
                console.log(response)
                resetUserData();
            })
            .catch(error => console.error('Error adding user:', error));
    };

    const resetUserData = () => {
        setNewUser(defaultUser)
        setPrivacyAccepted(false)
    }

    const handleDeleteUser = (e: React.MouseEvent, id: number) => {
        e.preventDefault()
        axios.delete(`http://localhost:8000/api/users/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(() => {
                setUsers(users.filter(user => user.id !== id));
            })
            .catch(error => console.error('Error deleting user:', error));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handlePrivacyChange = (accepted: boolean) => {
        setPrivacyAccepted(accepted);
      };

    return (
        <>
            <div className='logout-wrapper'>
                <LogoutButton/>
            </div>
            <div className="main-container">
                <div className="wrapper">
                    <section className="form-section">
                        <form className="main-form">
                            <div className='header-wrapper'>
                                <h1 className="main-form-header">Let's level up your brand, together</h1>
                            </div>
                            <div className="inputs-wrapper">
                                <InputField
                                    label="First name"
                                    type="text"
                                    name="first_name"
                                    id="first_name"
                                    placeholder="First name"
                                    value={newUser.first_name}
                                    onChange={handleInputChange}
                                    required
                                />

                                <InputField
                                    label="Last name"
                                    type="text"
                                    name="last_name"
                                    id="last_name"
                                    placeholder="Last name"
                                    value={newUser.last_name}
                                    onChange={handleInputChange}
                                    required
                                />

                                <InputField
                                    label="Role"
                                    type="text"
                                    name="role"
                                    id="role"
                                    placeholder="Role"
                                    value={newUser.role}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <PrivacyAgreement
                                privacyAccepted={privacyAccepted}
                                onPrivacyChange={handlePrivacyChange}
                            />

                            <SubmitButton
                            onClick={handleAddUser}
                            label="Submit"
                            />
                        </form>
                    </section>

                    <section className="users-wrapper">
                        {users.map(user => (
                            <div className="user-wrapper" key={user.id}>
                                <div className='user-wrapper-infos'>
                                    <p className='user-wrapper-infos-name'>{`${user.first_name} ${user.last_name} - `}</p>
                                    <p className='user-wrapper-infos-role'>{user.role}</p> 
                                </div> 
                                <div
                                    className="delete-button" 
                                    onClick={(e) => handleDeleteUser(e, user.id)}>
                                        Delete
                                </div>
                                
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </>
    );
};

export default UserList;