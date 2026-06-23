import { IconFile, IconValidated, IconRejected } from "./Icons";
import "./DemandeItem.css";

function DemandeItem({ demande, onApprove, onRefuse }) {
  const { matricule, nom, type, statut } = demande;
  const isConge = type === "conge";
  const accent = isConge ? "conge" : "travail";
  const iconColor = isConge ? "var(--conge)" : "var(--travail)";
  const libelle = isConge ? "Demande d'attestation de congé" : "Demande d'attestation de travail";

  return (
    <div className={`demande-item demande-item--${accent}`}>
      <div className="demande-left">
        <span className="demande-file" style={{ color: iconColor }}>
          <IconFile />
        </span>
        <div className="demande-info">
          <span className="demande-matricule">Matricule : {matricule}</span>
          <span className="demande-nom">{nom}</span>
          <span className="demande-libelle" style={{ color: iconColor }}>{libelle}</span>
        </div>
      </div>

      <div className="demande-right">
        {statut === "valide" && <IconValidated color={iconColor} />}
        {statut === "refuse" && <IconRejected />}
        {statut === "attente" && (
          <div className="demande-actions">
            <button className="btn btn-blue" onClick={() => onApprove?.(demande)}>Approuver</button>
            <button className="btn btn-red" onClick={() => onRefuse?.(demande)}>Refuser</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DemandeItem;
