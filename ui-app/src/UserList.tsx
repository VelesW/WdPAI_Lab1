import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    id?: number;
    first_name: string;
    last_name: string;
    role: string;
} 

const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState<User | undefined>(undefined);
    const [privacyAccepted, setPrivacyAccepted] = useState<boolean>(false) ;

    useEffect(() => {
        axios.get('http://localhost:8000/api/users/')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post('http://localhost:8000/api/users/', newUser)
            .then(response => {
                setUsers([...users, response.data]);
                setNewUser({ first_name: '', last_name: '', role: '' });
                setPrivacyAccepted(false);
            })
            .catch(error => console.error('Error adding user:', error));
    };

    const handleDeleteUser = (id: number) => {
        axios.delete(`http://localhost:8000/api/users/${id}/`)
            .then(() => {
                setUsers(users.filter(user => user.id !== id));
            })
            .catch(error => console.error('Error deleting user:', error));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser({
            ...newUser,
            [name]: value
        });
    };

    return (
        <div className="main-container">
            <div className="wrapper">
                <section className="form-section">
                    <form className="main-form" onSubmit={handleAddUser}>
                        <h1 className="main-form-header">Let's level up your brand, together</h1>
                        
                        <div className="inputs-wrapper">
                            <div className="input-wrapper">
                                <label htmlFor="first_name" className="form-label">First name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    id="first_name"
                                    placeholder="First name"
                                    className="form-input"
                                    value={newUser.first_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="input-wrapper">
                                <label htmlFor="last_name" className="form-label">Last name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    id="last_name"
                                    placeholder="Last name"
                                    className="form-input"
                                    value={newUser.last_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="input-wrapper">
                                <label htmlFor="role" className="form-label">Role</label>
                                <input
                                    type="text"
                                    name="role"
                                    id="role"
                                    placeholder="Role"
                                    className="form-input"
                                    value={newUser.role}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="agreement-wrapper">
                            <input
                                type="checkbox"
                                id="privacyPolicy"
                                checked={privacyAccepted}
                                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                                required
                            />
                            <label htmlFor="privacyPolicy" className="agreement-text">
                                You agree to our friendly <span className="agreement-text-underlined">privacy policy</span>
                            </label>
                        </div>

                        <button type="submit" className="submit-button">Submit</button>
                    </form>
                </section>

                <section className="users-wrapper">
                    {users.map(user => (
                        <div key={user.id}>
                            {user.first_name} {user.last_name} - {user.role}
                            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default UserList;