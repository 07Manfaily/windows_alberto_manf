import React, { useState } from 'react';
import Navbar from './Navbar';
import '../styles/portail.css';

/**
 * Page — Contactez les RH
 * @param {string} imgContact  image gauche (optionnel)
 */
const ContactPage = ({ activeNav, onNavChange, imgContact }) => {
  const [form, setForm] = useState({ matricule: '', departement: '', objet: '', message: '' });

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = () => console.log('Formulaire envoyé', form);

  return (
    <div>
      <Navbar activeNav={activeNav} onNavChange={onNavChange} />
      <div className="page-full">
        <div className="page-full-header">
          <h1>Formation et Carrière</h1>
        </div>

        <div className="contact-grid">
          <div className="contact-image">
            {imgContact
              ? <img src={imgContact} alt="Contact RH" />
              : <div className="contact-image-placeholder" />}
          </div>

          <div className="contact-form-wrap">
            <h2 className="contact-form-title">Formulaire de contact</h2>

            <div className="contact-field">
              <label>Identifiant / Matricule</label>
              <input
                className="contact-input" name="matricule"
                placeholder="ex : 5454" value={form.matricule} onChange={onChange}
              />
            </div>

            <div className="contact-field">
              <label>Departement</label>
              <input
                className="contact-input" name="departement"
                placeholder="ex : Innovation" value={form.departement} onChange={onChange}
              />
            </div>

            <div className="contact-field">
              <label>Objet</label>
              <input
                className="contact-input" name="objet"
                placeholder="ex : Demande d'assistance" value={form.objet} onChange={onChange}
              />
            </div>

            <div className="contact-field">
              <label>Message</label>
              <textarea
                className="contact-textarea" name="message"
                placeholder="Ecrivez ici" value={form.message} onChange={onChange}
              />
            </div>

            <button className="contact-submit" onClick={onSubmit}>Envoyer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
