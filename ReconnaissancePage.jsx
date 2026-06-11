import React, { useState } from 'react';
import ModalTableauHonneur from './ModalTableauHonneur';
import '../styles/portail.css';

const GROUPES = [
  {
    date: '11 Mai 2026',
    items: [
      { id: 1, title: "Tableau d'honneur" },
      { id: 2, title: 'Bravo et Merci' },
      { id: 3, title: "Médaille d'honneur" },
    ],
  },
  {
    date: '15 Février 2026',
    items: [{ id: 4, title: "Tableau d'honneur" }],
  },
];

/** Onglet — Reconnaissance et culture d'entreprise */
const ReconnaissancePage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="section-eyebrow">Distinctions</div>
      <h2 className="section-title">Bravos et tableau d'honneur</h2>
      <div className="section-underline" />

      <h3 className="notes-section-title">Liste des distinctions</h3>

      <div className="filter-row">
        <label>Filtre</label>
        <select className="filter-select"><option>Tout</option></select>
      </div>

      {GROUPES.map(groupe => (
        <div key={groupe.date} style={{ marginBottom: 24 }}>
          <div className="history-date-label">{groupe.date}</div>
          <div className="cards-grid-3">
            {groupe.items.map(item => (
              <div
                key={item.id}
                className="tag-card gold-border"
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
        </div>
      ))}

      {showModal && <ModalTableauHonneur onClose={() => setShowModal(false)} />}
    </>
  );
};

export default ReconnaissancePage;
