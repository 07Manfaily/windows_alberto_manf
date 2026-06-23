import { useState } from "react";
import { IconBack, IconCheck, IconClose, IconCalendar } from "../components/Icons";
import "./OffreEmplois.css";

const CONTRATS = ["CDD", "CDI", "Interim"];

function CreerOffre({ onBack }) {
  const [actifs, setActifs] = useState(["CDD"]);

  const toggle = (c) =>
    setActifs((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  return (
    <div className="page">
      <button className="back-link" onClick={onBack}>
        <IconBack />
        <span>Retour</span>
      </button>

      <div className="form-field">
        <label className="form-label">Intitulé du poste</label>
        <input className="form-input" placeholder="Ex : Sécrétaire" />
      </div>

      <div className="contrat-panel">
        <span className="contrat-title">Type du contrat</span>
        <div className="contrat-toggles">
          {CONTRATS.map((c) => {
            const on = actifs.includes(c);
            return (
              <button
                key={c}
                className={`contrat-toggle ${on ? "contrat-toggle--on" : ""}`}
                onClick={() => toggle(c)}
              >
                {on ? <IconClose /> : <IconCheck className="contrat-check" />}
                <span>{c}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label">Date de début</label>
          <div style={{ position: "relative" }}>
            <input className="form-input" placeholder="jj/mm/aaaa" />
            <span className="form-cal"><IconCalendar /></span>
          </div>
        </div>
        <div className="form-field">
          <label className="form-label">Date de fin</label>
          <div style={{ position: "relative" }}>
            <input className="form-input" placeholder="jj/mm/aaaa" />
            <span className="form-cal"><IconCalendar /></span>
          </div>
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">Lieu</label>
        <input className="form-input" placeholder="Ex : Sécrétaire" />
      </div>

      <div className="form-field">
        <label className="form-label">Description du poste</label>
        <textarea className="form-textarea" defaultValue="Value" rows={8} />
      </div>

      <div className="form-actions">
        <button className="btn btn-red form-btn" onClick={onBack}>Annuler</button>
        <button className="btn btn-dark form-btn">Créer</button>
      </div>
    </div>
  );
}

export default CreerOffre;
