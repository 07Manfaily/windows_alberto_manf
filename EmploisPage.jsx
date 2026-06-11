import React, { useState } from 'react';
import '../styles/portail.css';

const OFFRES = [
  { id: 1, title: 'Data Analyste',  tags: ['CDD'] },
  { id: 2, title: 'Data ingénieur', tags: ['CDI', 'Interim'] },
  { id: 3, title: 'Data Analyste',  tags: ['CDD'] },
];

// Détail affiché quand on clique sur "Détails"
const DETAIL = {
  title: 'Data analyste',
  contrat: 'CDI / Temps plein',
  lieu: 'Hybride (Paris / Télétravail)',
  description:
    "Rattaché(e) au pôle Business Intelligence, vous aurez pour mission de transformer nos données brutes en leviers de décision stratégiques. Vous travaillerez sur l'optimisation des parcours clients et l'analyse de performance de nos campagnes marketing.",
  missions: [
    'Collecter, nettoyer et structurer les données provenant de diverses sources (SQL, APIs).',
    'Concevoir et maintenir des tableaux de bord interactifs (Tableau, Power BI).',
    'Réaliser des analyses exploratoires pour identifier les tendances et les points de friction.',
    'Collaborer avec les équipes produits pour définir les KPI clés.',
  ],
  profil: [
    'Formation Bac+5 en Statistiques, Informatique ou Mathématiques Décisionnelles.',
    'Maîtrise indispensable de SQL et Python (Pandas, Numpy).',
    'Capacité à vulgariser des données complexes auprès de profils non techniques.',
  ],
};

/** Onglet — Emplois & Mobilité */
const EmploisPage = () => {
  const [view, setView] = useState('list'); // 'list' | 'detail'

  if (view === 'detail') {
    return (
      <>
        <button className="job-detail-back" onClick={() => setView('list')}>
          ↖ Retour aux offres d'emplois
        </button>
        <h2 className="job-detail-title">{DETAIL.title}</h2>
        <div className="section-underline" />

        <div className="job-detail-meta">
          <strong>Type de contrat :</strong> {DETAIL.contrat}<br />
          <strong>Lieu :</strong> {DETAIL.lieu}
        </div>

        <div className="job-detail-section">
          <h3>Description du poste</h3>
          <p>{DETAIL.description}</p>
        </div>

        <div className="job-detail-section">
          <h3>Missions principales :</h3>
          <ul>{DETAIL.missions.map((m, i) => <li key={i}>{m}</li>)}</ul>
        </div>

        <div className="job-detail-section">
          <h3>Profil recherché</h3>
          <ul>{DETAIL.profil.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </div>

        <button className="job-detail-apply">Candidature spontanée</button>
      </>
    );
  }

  return (
    <>
      <div className="section-eyebrow">Carrière</div>
      <h2 className="section-title">Emplois &amp; Mobilité</h2>
      <div className="section-underline" />

      <h3 className="notes-section-title">Liste des offres</h3>

      <div className="filter-row">
        <label>Filtre</label>
        <select className="filter-select"><option>Tout</option></select>
      </div>

      <div className="cards-grid-3">
        {OFFRES.map(offre => (
          <div key={offre.id} className="job-card">
            <div className="job-card-title">{offre.title}</div>
            <div className="job-card-tags">
              {offre.tags.map(t => <span key={t} className="job-tag">{t}</span>)}
            </div>
            <span className="job-card-details" onClick={() => setView('detail')}>
              Détails ↗
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default EmploisPage;
