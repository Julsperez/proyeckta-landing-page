import React from 'react';
import './Footer.css';

const Footer: React.FC = () => (
  <footer className="footer">
    <p>© {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</p>
  </footer>
);

export default Footer; 