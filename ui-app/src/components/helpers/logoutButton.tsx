import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token')
    navigate('/login');
  };

  return (
    <div className="logout" onClick={handleLogout}>
      <p>Logout</p>
    </div>
  );
};

export default LogoutButton;
