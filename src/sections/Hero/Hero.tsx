import React from 'react';
import './Hero.css';
import ResponsiveImg from '../../components/ResponsiveImg/ResponsiveImg';
// import ResponsiveImg from '../../components/ResponsiveImg/ResponsiveImg';

const Hero: React.FC = () => (
  <section className="hero" id="hero">
    <div className="hero-content">
      <div className="hero-text">
        <h1>Consultoría en Seguridad, Higiene, Protección Civil y Gestión Ambiental</h1>
        <p>Cumplimiento normativo, capacitación con validez oficial y atención inmediata.</p>
        <div className="hero-buttons">
          <a href="#contact" className="cta-btn">
            Solicitar cotización
          </a>
          <a
            href="https://wa.me/525547656048?text=Hola%2C%20me%20interesa%20una%20cotización"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn"
          >
            <div>WhatsApp</div>
          </a>
        </div>
      </div>
      <div className="hero-image">
        {/* <img src="/img/React.svg" alt="Consultoría en seguridad, higiene, protección civil y gestión ambiental" /> */}
        <ResponsiveImg base="image-1" alt="Descripción de image-1" customSizes={[640, 1280]} loading="eager" />
      </div>
    </div>
  </section>
);

export default Hero; 