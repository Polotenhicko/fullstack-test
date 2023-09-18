import React from 'react';
import styles from './Button.module.css';
import classNames from 'classnames';

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...other }: IButtonProps) {
  const cn = classNames(styles.button, className);

  return (
    <button className={cn} {...other}>
      {children}
    </button>
  );
}
