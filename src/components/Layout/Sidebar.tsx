import { NavLink } from 'react-router-dom';
import { Home, TrendingUp, TrendingDown, Grid3x3 } from 'lucide-react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <nav className={styles.nav}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            onClick={onClose}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/receitas"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            onClick={onClose}
          >
            <TrendingUp size={20} />
            <span>Receitas</span>
          </NavLink>

          <NavLink
            to="/despesas"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            onClick={onClose}
          >
            <TrendingDown size={20} />
            <span>Despesas</span>
          </NavLink>

          <NavLink
            to="/categorias"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            onClick={onClose}
          >
            <Grid3x3 size={20} />
            <span>Categorias</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

