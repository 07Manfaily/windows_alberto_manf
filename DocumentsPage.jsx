import React, { useState } from 'react';
import Navbar from './Navbar';
import ModalAttestationTravail from './ModalAttestationTravail';
import ModalNoteInformation from './ModalNoteInformation';
import ModalDecisionRH from './ModalDecisionRH';
import ReconnaissancePage from './ReconnaissancePage';
import DisciplinePage from './DisciplinePage';
import EmploisPage from './EmploisPage';
import '../styles/portail.css';

// ─── Données fictives ──────────────────────────────────────────
const DEMANDES = [
  { id: 1, type: 'Demande', label: 'Attestation de travail', status: 'en_cours', iconColor: 'blue' },
  { id: 2, type: 'Demande', label: 'Attestation de Congé',   status: 'disponible', iconColor: 'teal' },
];
const NOTES     = [{ id: 1 }, { id: 2 }];
const DECISIONS = [{ id: 1 }, { id: 2 }];

const SUB_TABS    = ['Demande de document', "Notes d'informations", 'Décisions RH'];
const MAIN_TABS   = ['Documents', 'Carrière professionnelle',
                     "Reconnaissance et culture d'entreprise", 'Discipline', 'Emplois & Mobilité'];

const DocumentsPage = ({ activeNav, onNavChange }) => {
  const [activeTab, setActiveTab]       = useState('Documents');
  const [activeSubTab, setActiveSubTab] = useState('Demande de document');
  const [modal, setModal]               = useState(null); // attestation | note | decision

  // ═══ Sous-onglet : Demande de document ═══
  const renderDemande = () => (
    <>
      <div className="action-cards-grid">
        {['Attestation de travail', 'Attestation de congé'].map(label => (
          <div className="action-card" key={label}>
            <div className="action-card-left">
              <div className="action-card-icon">📄</div>
              <div className="action-card-text">
                <span className="action-card-label">Faire une demande</span>
                <span className="action-card-title">{label}</span>
              </div>
            </div>
            <span className="action-card-chevron">›</span>
          </div>
        ))}
      </div>

      <div className="history-section">
        <h3 className="history-title">Historique de demande</h3>
        <div className="history-date-group">
          <div className="history-date-label">11 Mai 2026</div>
          {DEMANDES.map(item => (
            <div key={item.id}
              className={`history-item ${item.status === 'disponible' ? 'available' : ''}`}>
              <div className="history-item-left">
                <div className={`history-item-icon ${item.iconColor}`}>📄</div>
                <div className="history-item-text">
                  <span className="history-item-sublabel">{item.type}</span>
                  <span className="history-item-name">{item.label}</span>
                </div>
              </div>
              {item.status === 'en_cours'
                ? <button className="btn btn-pending" disabled>En cours ...</button>
                : <button className="btn btn-download"
                    onClick={() => setModal('attestation')}>Telecharger</button>}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // ═══ Sous-onglet : Notes d'informations ═══
  const renderNotes = () => (
    <div className="notes-list">
      <h3 className="notes-section-title">Liste des notes d'informations</h3>
      <div className="filter-row">
        <label>Filtre</label>
        <select className="filter-select"><option>Tout</option></select>
      </div>
      <div className="history-date-group">
        <div className="history-date-label">11 Mai 2026</div>
        {NOTES.map(item => (
          <div key={item.id} className="history-item">
            <div className="history-item-left">
              <div className="history-item-icon dark">📄</div>
              <div className="history-item-text">
                <span className="history-item-name">Note d'information</span>
              </div>
            </div>
            <button className="btn btn-consult" onClick={() => setModal('note')}>Consulter</button>
          </div>
        ))}
      </div>
    </div>
  );

  // ═══ Sous-onglet : Décisions RH ═══
  const renderDecisions = () => (
    <div className="notes-list">
      <h3 className="notes-section-title">Liste des notes d'informations</h3>
      <div className="filter-row">
        <label>Filtre</label>
        <select className="filter-select"><option>Tout</option></select>
      </div>
      <div className="history-date-group">
        <div className="history-date-label">11 Mai 2026</div>
        {DECISIONS.map(item => (
          <div key={item.id} className="history-item">
            <div className="history-item-left">
              <div className="history-item-icon dark">📄</div>
              <div className="history-item-text">
                <span className="history-item-name">Décision RH</span>
              </div>
            </div>
            <button className="btn btn-consult" onClick={() => setModal('decision')}>Consulter</button>
          </div>
        ))}
      </div>
    </div>
  );

  // ═══ Contenu de l'onglet Documents (avec sous-onglets) ═══
  const renderDocuments = () => (
    <>
      <div className="section-eyebrow">Accedez à vos documents RH</div>
      <h2 className="section-title">Demande et consultation</h2>
      <div className="section-underline" />

      <div className="filter-tabs">
        {SUB_TABS.map(tab => (
          <button key={tab}
            className={`filter-tab ${activeSubTab === tab ? 'active' : ''}`}
            onClick={() => setActiveSubTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {activeSubTab === 'Demande de document'   && renderDemande()}
      {activeSubTab === "Notes d'informations"  && renderNotes()}
      {activeSubTab === 'Décisions RH'          && renderDecisions()}
    </>
  );

  return (
    <div>
      <Navbar activeNav={activeNav} onNavChange={onNavChange} />

      <div className="page-container">
        <div className="page-header"><h1>Espace Salarié</h1></div>

        {/* Onglets principaux */}
        <div className="tabs-bar">
          <span className="tabs-label">Tableau de bord</span>
          {MAIN_TABS.map(tab => (
            <button key={tab}
              className={`tab-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>

        {/* Contenu selon l'onglet principal */}
        {activeTab === 'Documents'                                  && renderDocuments()}
        {activeTab === "Reconnaissance et culture d'entreprise"     && <ReconnaissancePage />}
        {activeTab === 'Discipline'                                 && <DisciplinePage />}
        {activeTab === 'Emplois & Mobilité'                         && <EmploisPage />}
        {activeTab === 'Carrière professionnelle' && (
          <div className="empty-state">
            <div className="empty-state-icon">📄</div>
            <div className="empty-state-text">À venir</div>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal === 'attestation' && <ModalAttestationTravail onClose={() => setModal(null)} />}
      {modal === 'note'        && <ModalNoteInformation    onClose={() => setModal(null)} />}
      {modal === 'decision'    && <ModalDecisionRH         onClose={() => setModal(null)} />}
    </div>
  );
};

export default DocumentsPage;
