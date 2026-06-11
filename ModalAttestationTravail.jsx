import React from 'react';
import '../styles/portail.css';

const ModalAttestationTravail = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header teal-bg">
          <div className="modal-header-left">
            <div className="modal-header-icon">📄</div>
            <div className="modal-header-text">
              <span className="modal-header-sublabel">Demande</span>
              <span className="modal-header-title">Attestation de Congé</span>
              <span className="modal-header-date">11 Mai 2026</span>
            </div>
          </div>
          <button className="btn btn-download">Telecharger</button>
        </div>

        {/* Document preview */}
        <div className="modal-body">
          <div className="modal-doc-preview">
            {/* En-tête lettre */}
            <div className="modal-doc-letter-header">
              <div className="modal-doc-sender">
                <strong>[Nom de l'entreprise]</strong>
                [Adresse du siège social]<br />
                [Code postal et Ville]
              </div>

              <div className="modal-doc-envelope">
                {/* X croisé simulé via CSS pseudo-elements */}
              </div>

              <div className="modal-doc-recipient">
                <strong>[Prénom et nom du destinataire]</strong>
                [Adresse du destinataire]<br />
                [Code postal et Ville]
              </div>
            </div>

            {/* Lieu et date */}
            <div className="modal-doc-location">
              [Ville], le [date de création]
            </div>

            {/* Objet */}
            <div className="modal-doc-subject">
              Objet : Attestation de travail / [Nom et prénom du salarié]
            </div>

            {/* Titre principal */}
            <div className="modal-doc-main-title">Attestation de travail</div>

            {/* Corps du document — tronqué dans la preview */}
            <div className="modal-doc-body-text">
              Nous, soussigné(e), [Nom et fonction du responsable], agissant au nom de la société
              [Nom de l'entreprise], certifions que Madame/Monsieur [Prénom et nom du salarié],
              né(e) le [date de naissance] à [lieu de naissance], exerce les fonctions de
              [intitulé du poste] au sein de notre entreprise depuis le [date d'entrée]…
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-close" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default ModalAttestationTravail;
