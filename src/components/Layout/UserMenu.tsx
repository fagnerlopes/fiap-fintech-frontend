import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import styles from './UserMenu.module.css';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fecha o menu ao clicar fora (useEffect conforme o curso)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    setIsOpen(false);
    navigate('/perfil');
  };

  const userName = user?.pessoaFisica?.nome || user?.pessoaJuridica?.razaoSocial || 'Usuário';

  return (
    <div className={styles.userMenu} ref={menuRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className={styles.avatar}>
          {userName.charAt(0).toUpperCase()}
        </div>
        <span className={styles.userName}>{userName}</span>
        <ChevronDown
          size={16}
          className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`}
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.userInfo}>
            <div className={styles.userEmail}>{user?.email}</div>
          </div>

          <div className={styles.divider} />

          <button className={styles.menuItem} onClick={handleProfile}>
            <User size={16} />
            Meu Perfil
          </button>

          <div className={styles.divider} />

          <button className={styles.menuItem} onClick={handleLogout}>
            <LogOut size={16} />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}

