import React from 'react';
import '../styles/portail.css';

const ModalNoteInformation = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
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

        {/* Document preview */}
        <div className="modal-body">
          <div className="modal-doc-preview">
            {/* En-tête note */}
            <div className="modal-doc-note-header">
              <div className="modal-doc-note-place-date">[LIEU], [DATE]</div>
              <div className="modal-doc-note-recipient">
                [NOM DU DESTINATAIRE]<br />
                [ADRESSE 1]<br />
                [ADRESSE 2]<br />
                [VILLE, ÉTAT/PROVINCE]<br />
                [CODE POSTAL]
              </div>
            </div>

            {/* Objet */}
            <div className="modal-doc-note-subject-line">
              OBJET : NOTE D'INFORMATION RELATIVE À UNE PROMOTION
            </div>

            {/* Corps */}
            <div className="modal-doc-greeting">
              Madame, Monsieur [NOM DE LA PERSONNE],
            </div>

            <div className="modal-doc-body-text">
              Nous avons le plaisir d'informer tout le personnel que [NOM DE LA PERSONNE]
              a été promu au poste de [POSTE] au [DÉPARTEMENT]. [NOM DE LA PERSONNE] a rejoint
              notre entreprise il y a [NOMBRE] ans en qualité de [TITRE]. Il a aussi occupé les
              postes ci-après : [LISTE DES DIFFÉRENTS POSTES OCCUPÉS].
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

export default ModalNoteInformation;
