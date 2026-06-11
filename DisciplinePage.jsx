import React, { useState } from 'react';
import ModalDiscipline from './ModalDiscipline';
import '../styles/portail.css';

const SANCTIONS = [
  { id: 1, title: 'Avertissement' },
  { id: 2, title: 'Blâme' },
];

/** Onglet — Discipline */
const DisciplinePage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="section-eyebrow">Information RH</div>
      <h2 className="section-title">Sanctions et Avertissement</h2>
      <div className="section-underline" />

      <h3 className="notes-section-title">Liste des sanctions</h3>

      <div className="filter-row">
        <label>Filtre</label>
        <select className="filter-select"><option>Tout</option></select>
      </div>

      <div className="history-date-label">11 Mai 2026</div>

      <div className="cards-grid-2">
        {SANCTIONS.map(item => (
          <div
            key={item.id}
            className="tag-card red-border"
            onClick={() => setShowModal(true)}
          >
            <div className="tag-card-left">
              <div className="tag-card-icon">📄</div>
              <div>
                <span className="tag-card-label">Distinction</span>
                <span className="tag-card-title">{item.title}</span>
              </div>
            </div>
            <span className="tag-card-chevron">›</span>
          </div>
        ))}
      </div>

      {showModal && <ModalDiscipline onClose={() => setShowModal(false)} />}
    </>
  );
};

export default DisciplinePage;
