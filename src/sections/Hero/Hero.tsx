import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import './Hero.css';

const Hero: React.FC = () => (
  <section className="hero" id="hero">
    <h1>Confía en nosotros para impulsar tu empresa</h1>
    <p>Soluciones empresariales a tu medida.</p>
    <a
      href="https://wa.me/521234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
    >
      Contáctanos por WhatsApp
    </a>
  </section>
);

export default Hero; 