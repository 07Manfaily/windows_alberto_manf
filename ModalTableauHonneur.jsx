import React from 'react';
import '../styles/portail.css';

/**
 * Modal — Distinction / Certificat
 * @param {string} certificatImg  URL ou import de l'image du certificat (optionnel)
 */
const ModalTableauHonneur = ({ onClose, certificatImg }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <div className="modal-header-left">
          <div className="modal-header-icon dark">📄</div>
          <div className="modal-header-text">
            <span className="modal-header-date">Date de publicatuion : 11 Mai 2026</span>
            <span className="modal-header-title">Tableau d'honneur</span>
          </div>
        </div>
        <button className="btn btn-consult">Telecharger</button>
      </div>

      <div className="modal-body">
        <div className="modal-doc-certificate">
          {certificatImg
            ? <img src={certificatImg} alt="Certificat tableau d'honneur" />
            : <div className="certificate-placeholder">Emplacement du certificat (image)</div>}
        </div>
      </div>

      <div className="modal-footer">
        <button className="btn btn-close" onClick={onClose}>Fermer</button>
      </div>
    </div>
  </div>
);

export default ModalTableauHonneur;
