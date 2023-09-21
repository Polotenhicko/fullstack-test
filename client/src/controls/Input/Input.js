import classNames from 'classnames';
import styles from './Input.module.css';

export function Input({ className, onKeyDown, ...other }) {
  const cn = classNames(styles.input, className);

  return <input className={cn} onKeyDown={onKeyDown} {...other} />;
}
