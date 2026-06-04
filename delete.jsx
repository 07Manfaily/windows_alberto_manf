.espace-salarie {
  background: var(--gris-clair);
  padding: 0 60px;           /* ← plus de padding vertical */
  display: flex;             /* ← flex pour photo + contenu côte à côte */
  align-items: stretch;
  min-height: 420px;
  overflow: hidden;
}

/* ← NOUVEAU : colonne photo gauche */
.espace-salarie-photo {
  flex: 0 0 280px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
}

/* ← NOUVEAU : colonne contenu droite */
.espace-salarie-content {
  flex: 1;
  padding: 50px 0 50px 60px;
  text-align: left;          /* ← aligné à gauche */
}

.espace-salarie-content .section-title::after {
  margin: 8px 0 0 0;        /* ← plus centré */
}

.espace-salarie-content .subtitle {
  font-size: 15px;
  color: var(--gris-texte);
  max-width: 620px;
  margin: 20px 0 36px 0;    /* ← plus auto */
  line-height: 1.6;
}

.espace-icons {
  display: flex;
  justify-content: flex-start;  /* ← aligné à gauche */
  gap: 48px;
  margin-bottom: 36px;
  flex-wrap: wrap;
}


function EspaceSalarie() {
  const colors = ['#7c5cbf', '#2db09e', '#f4a032', '#c8102e'];
  const docs = [
    { label: 'Attestation de travail' },
    { label: 'Attestation de congé' },
    { label: "Notes d'informations" },
    { label: 'Décisions RH' },
  ];
 
  return (
    <div className="espace-salarie">
 
      {/* Photo à gauche */}
      <div className="espace-salarie-photo">
        <div className="photo-placeholder">👩‍💼</div>
      </div>
 
      {/* Contenu à droite */}
      <div className="espace-salarie-content">
        <h2 className="section-title">Espace salarié</h2>
        <p className="subtitle">
          Cet espace personnel a été conçu pour vous offrir plus d'autonomie, de
          transparence et de réactivité dans la gestion de votre vie professionnelle au
          sein de la SGCI.
        </p>
 
        <div className="espace-icons">
          {docs.map((d, i) => (
            <div className="espace-icon-item" key={i}>
              <svg className="icon-doc" viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="0" width="34" height="44" rx="4"
                  fill={colors[i]} fillOpacity="0.15"
                  stroke={colors[i]} strokeWidth="2.2"
                />
                <line x1="12" y1="18" x2="30" y2="18" stroke={colors[i]} strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="12" y1="25" x2="30" y2="25" stroke={colors[i]} strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="12" y1="32" x2="22" y2="32" stroke={colors[i]} strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <span>{d.label}</span>
            </div>
          ))}
        </div>
 
        <button className="btn-connecter">Se connecter</button>
      </div>
 
    </div>
  );
}
