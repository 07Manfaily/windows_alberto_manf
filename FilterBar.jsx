import { IconCalendar } from "./Icons";

// Barre réutilisée sur la plupart des pages : Date du jour + Trier + Hier/Semaine/Mois
function FilterBar({ withTrier = true }) {
  return (
    <div className="filterbar">
      <div className="field">
        <label className="field-label">Date du jour</label>
        <div style={{ position: "relative" }}>
          <input className="input-date" type="text" defaultValue="21/05/2025" />
          <span style={{ position: "absolute", right: 12, top: 14, color: "var(--text-mute)" }}>
            <IconCalendar />
          </span>
        </div>
      </div>

      {withTrier && (
        <div className="field">
          <label className="field-label">Trier</label>
          <select className="select-trier" defaultValue="">
            <option value="" disabled>Validées / Refusées / En attente</option>
            <option value="valide">Validées</option>
            <option value="refuse">Refusées</option>
            <option value="attente">En attente</option>
          </select>
        </div>
      )}

      <div className="quick-filters">
        <button className="chip-quick">Hier</button>
        <button className="chip-quick">Semaine dernière</button>
        <button className="chip-quick">Mois dernier</button>
      </div>
    </div>
  );
}

export default FilterBar;
