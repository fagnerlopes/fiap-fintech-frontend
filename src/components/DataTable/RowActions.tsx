import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { MoreVertical } from 'lucide-react';
import styles from './RowActions.module.css';

export interface Action {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

interface RowActionsProps {
  actions: Action[];
}

export function RowActions({ actions }: RowActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={styles.container} ref={menuRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Ações"
        aria-expanded={isOpen}
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {actions.map((action, index) => (
            <button
              key={index}
              className={`${styles.action} ${
                action.variant === 'destructive' ? styles.destructive : ''
              }`}
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

