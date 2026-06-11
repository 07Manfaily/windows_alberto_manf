import React from 'react';
import '../styles/portail.css';

/** Modal — Décision RH (ex: décision de congé) */
const ModalDecisionRH = ({ onClose }) => (
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
          <div className="modal-doc-typed-center-title">Décision du congé</div>
          <p>
            Nous, soussignés, (nom de la société), (forme juridique) au capital de
            00.000.000 de Dirhams, sise à (adresse), certifions par la présente que :
          </p>
          <p>Monsieur <strong>(….).</strong></p>
          <p>Titulaire de la CIN N° .............</p>
          <p>Immatriculé à la CNSS sous le n°000 000 000.</p>
          <p>En qualité de (... ... )</p>
          <p style={{ marginTop: 20 }}>Bénéficiera d'un congé payé pendant la période ci-dessus :</p>
          <p>Du ......... au ......... inclus.</p>
          <p style={{ marginTop: 20 }}>Fait à .........., le ..........</p>
          <p style={{ textAlign: 'right', marginTop: 30 }}>Signature et cachet</p>
        </div>
      </div>

      <div className="modal-footer">
        <button className="btn btn-close" onClick={onClose}>Fermer</button>
      </div>
    </div>
  </div>
);

export default ModalDecisionRH;
