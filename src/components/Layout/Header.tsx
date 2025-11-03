import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { UserMenu } from './UserMenu';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <button className={styles.menuButton} onClick={onMenuClick} aria-label="Toggle menu">
            <Menu size={24} />
          </button>

          <Link to="/dashboard" className={styles.logo}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="32" height="32" rx="8" fill="url(#gradient)" />
              <path
                d="M16 8V24M10 16H22"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--chart-2)" />
                </linearGradient>
              </defs>
            </svg>
            <span>Fintech</span>
          </Link>
        </div>

        <div className={styles.right}>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

