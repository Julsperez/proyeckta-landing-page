import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './layout/Layout';
import Hero from './sections/Hero/Hero';
import Services from './sections/Services/Services';
import About from './sections/About/About';
import Contact from './sections/Contact/Contact';

const App: React.FC = () => (
  <Router>
    <Layout>
      <Hero />
      <Services />
      <About />
      <Contact />
    </Layout>
  </Router>
);

export default App; 