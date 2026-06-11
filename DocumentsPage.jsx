import React, { useState } from 'react';
import Navbar from './Navbar';
import ModalAttestationTravail from './ModalAttestationTravail';
import ModalNoteInformation from './ModalNoteInformation';
import '../styles/portail.css';

// ─── Données fictives ──────────────────────────────────────────
const DEMANDES = [
  {
    id: 1,
    date: '11 Mai 2026',
    type: 'Demande',
    label: 'Attestation de travail',
    status: 'en_cours',
    iconColor: 'blue',
  },
  {
    id: 2,
    date: '11 Mai 2026',
    type: 'Demande',
    label: 'Attestation de Congé',
    status: 'disponible',
    iconColor: 'teal',
  },
];

const NOTES = [
  { id: 1, date: '11 Mai 2026', label: 'Note d\'information', type: 'note' },
  { id: 2, date: '11 Mai 2026', label: 'Note d\'information', type: 'note' },
];

// ─── Sous-onglets ──────────────────────────────────────────────
const SUB_TABS = ['Demande de document', 'Notes d\'informations', 'Décisions RH'];

const DocumentsPage = () => {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [activeSubTab, setActiveSubTab] = useState('Demande de document');
  const [modal, setModal] = useState(null); // 'attestation' | 'note' | null

  // ─── Rendu de la section "Demande de document" ───────────────
  const renderDemandeDocument = () => (
    <>
      {/* Cartes d'action */}
      <div className="action-cards-grid">
        <div className="action-card">
          <div className="action-card-left">
            <div className="action-card-icon">📄</div>
            <div className="action-card-text">
              <span className="action-card-label">Faire une demande</span>
              <span className="action-card-title">Attestation de travail</span>
            </div>
          </div>
          <span className="action-card-chevron">›</span>
        </div>

        <div className="action-card">
          <div className="action-card-left">
            <div className="action-card-icon">📄</div>
            <div className="action-card-text">
              <span className="action-card-label">Faire une demande</span>
              <span className="action-card-title">Attestation de congé</span>
            </div>
          </div>
          <span className="action-card-chevron">›</span>
        </div>
      </div>

      {/* Historique */}
      <div className="history-section">
        <h3 className="history-title">Historique de demande</h3>

        <div className="history-date-group">
          <div className="history-date-label">11 Mai 2026</div>

          {DEMANDES.map(item => (
            <div
              key={item.id}
              className={`history-item ${item.status === 'disponible' ? 'available' : ''}`}
            >
              <div className="history-item-left">
                <div className={`history-item-icon ${item.iconColor}`}>📄</div>
                <div className="history-item-text">
                  <span className="history-item-sublabel">{item.type}</span>
                  <span className="history-item-name">{item.label}</span>
                </div>
              </div>

              {item.status === 'en_cours' && (
                <button className="btn btn-pending" disabled>
                  En cours ...
                </button>
              )}
              {item.status === 'disponible' && (
                <button
                  className="btn btn-download"
                  onClick={() => setModal('attestation')}
                >
                  Telecharger
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // ─── Rendu "Notes d'informations" ─────────────────────────────
  const renderNotes = () => (
    <div className="notes-list">
      <h3 className="notes-section-title">Liste des notes d'informations</h3>

      {/* Filtre */}
      <div className="filter-row">
        <label>Filtre</label>
        <select className="filter-select">
          <option>Tout</option>
          <option>Promotion</option>
          <option>Mutation</option>
        </select>
      </div>

      {/* Date group */}
      <div className="history-date-group">
        <div className="history-date-label">11 Mai 2026</div>

        {NOTES.map(item => (
          <div key={item.id} className="history-item">
            <div className="history-item-left">
              <div className="history-item-icon dark">📄</div>
              <div className="history-item-text">
                <span className="history-item-name">{item.label}</span>
              </div>
            </div>
            <button
              className="btn btn-consult"
              onClick={() => setModal('note')}
            >
              Consulter
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── Rendu "Décisions RH" ─────────────────────────────────────
  const renderDecisions = () => (
    <div className="notes-list">
      <h3 className="notes-section-title">Liste des décisions RH</h3>

      <div className="filter-row">
        <label>Filtre</label>
        <select className="filter-select">
          <option>Tout</option>
        </select>
      </div>

      <div className="empty-state">
        <div className="empty-state-icon">📄</div>
        <div className="empty-state-text">Aucune décision RH</div>
      </div>
    </div>
  );

  // ─── Render principal ──────────────────────────────────────────
  return (
    <div>
      <Navbar activeNav={activeNav} onNavChange={setActiveNav} />

      <div className="page-container">
        {/* En-tête page */}
        <div className="page-header">
          <h1>Espace Salarié</h1>
        </div>

        {/* Barre d'onglets principale */}
        <div className="tabs-bar">
          <span className="tabs-label">Tableau de bord</span>
          {['Documents', 'Carrière professionnelle', 'Reconnaissance et culture d\'entreprise', 'Discipline', 'Emplois & Mobilité'].map(tab => (
            <button
              key={tab}
              className={`tab-item ${tab === 'Documents' ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* En-tête section */}
        <div className="section-eyebrow">Accedez à vos documents RH</div>
        <h2 className="section-title">Demande et consultation</h2>
        <div className="section-underline" />

        {/* Filtres par type */}
        <div className="filter-tabs">
          {SUB_TABS.map(tab => (
            <button
              key={tab}
              className={`filter-tab ${activeSubTab === tab ? 'active' : ''}`}
              onClick={() => setActiveSubTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Contenu dynamique selon sous-onglet */}
        {activeSubTab === 'Demande de document' && renderDemandeDocument()}
        {activeSubTab === 'Notes d\'informations' && renderNotes()}
        {activeSubTab === 'Décisions RH' && renderDecisions()}
      </div>

      {/* Modals */}
      {modal === 'attestation' && (
        <ModalAttestationTravail onClose={() => setModal(null)} />
      )}
      {modal === 'note' && (
        <ModalNoteInformation onClose={() => setModal(null)} />
      )}
    </div>
  );
};

export default DocumentsPage;
