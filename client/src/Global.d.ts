declare module '*.module.css';
declare module '*.module.scss';
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
}
