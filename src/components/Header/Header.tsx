import React from 'react';
import './Header.css';

const Header: React.FC = () => (
  <header className="header">
    <nav>
      <ul>
        <li><a href="#hero">Inicio</a></li>
        <li><a href="#services">Servicios</a></li>
        <li><a href="#about">Sobre Nosotros</a></li>
        <li><a href="#contact">Contacto</a></li>
      </ul>
    </nav>
  </header>
);

export default Header; 