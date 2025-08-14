import React, { useState } from 'react';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';
import './Contact.css';

const initialForm = { name: '', email: '', message: '' };

const Contact: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name) newErrors.name = 'El nombre es obligatorio';
    if (!form.email) newErrors.email = 'El correo es obligatorio';
    if (!form.message) newErrors.message = 'El mensaje es obligatorio';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      // Aquí puedes manejar el envío del formulario
      alert('Mensaje enviado');
      setForm(initialForm);
    }
  };

  return (
    <section className="contact" id="contact">
      <h2>Contacto</h2>
      <div className="contact-buttons">
        <a
          href="https://wa.me/521234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-btn"
        >
        WhatsApp
        </a>
        <a href="tel:+521234567890" className="phone-btn">
        Llamar
        </a>
      </div>
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error">{errors.name}</span>}
        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
        <textarea
          name="message"
          placeholder="Mensaje"
          value={form.message}
          onChange={handleChange}
        />
        {errors.message && <span className="error">{errors.message}</span>}
        <button type="submit">Enviar</button>
      </form>
    </section>
  );
};

export default Contact; 