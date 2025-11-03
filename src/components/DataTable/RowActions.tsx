import type { ReactNode } from 'react';
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
  return (
    <div className={styles.container}>
      {actions.map((action, index) => (
        <button
          key={index}
          className={`${styles.button} ${
            action.variant === 'destructive' ? styles.destructive : ''
          }`}
          onClick={action.onClick}
          title={action.label}
          aria-label={action.label}
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
}
