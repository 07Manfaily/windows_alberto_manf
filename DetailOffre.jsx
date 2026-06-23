import { IconBack, IconClose, IconCheck } from "../components/Icons";
import "./OffreEmplois.css";

const CONTRATS = ["CDD", "CDI", "Interim"];

function DetailOffre({ offre, onBack }) {
  if (!offre) return null;

  return (
    <div className="page">
      <button className="back-link" onClick={onBack}>
        <IconBack />
        <span>Retour</span>
      </button>

      <div className="contrat-panel">
        <span className="contrat-title">{offre.titre}</span>
        <div className="contrat-toggles">
          {CONTRATS.map((c) => {
            const on = offre.contrats.includes(c);
            return (
              <span key={c} className={`contrat-toggle ${on ? "contrat-toggle--on" : ""}`}>
                {on ? <IconClose /> : <IconCheck className="contrat-check" />}
                <span>{c}</span>
              </span>
            );
          })}
        </div>
      </div>

      <p className="detail-lieu"><strong>Lieu :</strong> {offre.lieu}</p>

      <div className="detail-block">
        <h3 className="detail-h">Description du poste</h3>
        {offre.description.split("\n").map((line, i) => (
          <p className="detail-p" key={i}>{line}</p>
        ))}
      </div>

      <div className="detail-block">
        <h3 className="detail-h">Missions principales :</h3>
        <ul className="detail-list">
          {offre.missions.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      </div>

      <div className="detail-block">
        <h3 className="detail-h">Profil recherché</h3>
        <ul className="detail-list">
          {offre.profil.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </div>

      <div className="form-actions">
        <button className="btn btn-red form-btn">Supprimer</button>
        <button className="btn btn-dark form-btn">Modifier</button>
      </div>
    </div>
  );
}

export default DetailOffre;
