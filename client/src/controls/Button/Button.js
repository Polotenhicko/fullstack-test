import React from 'react';
import styles from './Button.module.css';
import classNames from 'classnames';

export function Button({ children, className, ...other }) {
  const cn = classNames(styles.button, className);

  return (
    <button className={cn} {...other}>
      {children}
    </button>
  );
}
