import React, { useState } from 'react';
import DocumentsPage from './components/DocumentsPage';
import FormationPage from './components/FormationPage';
import ContactPage from './components/ContactPage';

function App() {
  const [nav, setNav] = useState('Dashboard');

  return (
    <>
      {(nav === 'Dashboard' || nav === 'Accueil') &&
        <DocumentsPage activeNav={nav} onNavChange={setNav} />}
      {nav === 'Formation et Carrière' &&
        <FormationPage activeNav={nav} onNavChange={setNav} />}
      {nav === 'Contactez les RH' &&
        <ContactPage activeNav={nav} onNavChange={setNav} />}
    </>
  );
}

export default App;
