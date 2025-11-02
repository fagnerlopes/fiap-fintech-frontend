import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import styles from './Dashboard.module.css';

export function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <h1>Dashboard</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}

