import React from 'react';
import '../styles/portail.css';

/** Modal — Sanction disciplinaire (avertissement / blâme) */
const ModalDiscipline = ({ onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <div className="modal-header-left">
          <div className="modal-header-icon dark">📄</div>
          <div className="modal-header-text">
            <span className="modal-header-date">Date de publicatuion : 11 Mai 2026</span>
            <span className="modal-header-title">Note d'information</span>
          </div>
        </div>
        <button className="btn btn-consult">Telecharger</button>
      </div>

      <div className="modal-body">
        <div className="modal-doc-typed">
          <p>&lt;Sur papier entête&gt;</p>
          <p style={{ marginTop: 20 }}>
            Nom, prénom<br />Adresse<br />CP - Ville
          </p>
          <p style={{ marginTop: 24 }}><strong>A &lt;.Ville .&gt;, Le &lt;...&gt;</strong></p>
          <p><u>Lettre recommandée avec AR</u></p>
          <p>Monsieur,</p>
          <p>
            En application des dispositions de <strong>l'article 37 du code du travail et
            conformément au règlement intérieur,</strong> nous avons le regret de vous infliger
            la sanction suivante : Selon le cas :
          </p>
          <p>&nbsp;Un deuxième blâme -une mise à pied de — ou = à 8 jours</p>
          <p>Un troisième blâme -un changement de service ou d'établissement</p>
        </div>
      </div>

      <div className="modal-footer">
        <button className="btn btn-close" onClick={onClose}>Fermer</button>
      </div>
    </div>
  </div>
);

export default ModalDiscipline;
