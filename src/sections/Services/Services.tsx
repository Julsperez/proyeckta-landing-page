import React from 'react';
import { FaBriefcase, FaChartLine, FaUsers } from 'react-icons/fa';
import './Services.css';

const services = [
  { icon: undefined, title: 'Consultoría', desc: 'Asesoría profesional para tu negocio.' },
  { icon: undefined, title: 'Estrategia', desc: 'Desarrollo de estrategias efectivas.' },
  { icon: undefined, title: 'Soporte', desc: 'Acompañamiento y soporte continuo.' },
];

const Services: React.FC = () => (
  <section className="services" id="services">
    <h2>Servicios</h2>
    <div className="services-list">
      {services.map((s, i) => (
        <div className="service-item" key={i}>
          <span className="icon">{s.icon}</span>
          <h3>{s.title}</h3>
          <p>{s.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Services; 