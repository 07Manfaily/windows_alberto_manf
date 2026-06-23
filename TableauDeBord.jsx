import { useState } from "react";
import { IconFolder, IconDocFolded, IconDocAlert, IconSearch, IconCalendar, IconChevronDown } from "../components/Icons";
import { statsCards, chartData, demandesTable } from "../data/mockData";
import "./TableauDeBord.css";

const cardIcon = {
  total: <IconFolder />,
  traitees: <IconDocFolded />,
  non_traitees: <IconDocAlert />,
};

function StatCard({ card }) {
  return (
    <div className={`stat-card stat-card--${card.variant}`}>
      <span className="stat-icon">{cardIcon[card.id]}</span>
      <div className="stat-body">
        <span className="stat-label">{card.label}</span>
        <span className="stat-value">{card.value}</span>
        <a className="stat-link" href="#voir">Voir</a>
      </div>
    </div>
  );
}

function Chart() {
  const max = 400;
  const ticks = [400, 300, 200, 100];

  return (
    <div className="chart">
      <div className="chart-legend">
        <button className="legend-pill legend-pill--travail">Attestation de travail</button>
        <button className="legend-pill legend-pill--conge">Attestation de congé</button>
      </div>

      <div className="chart-area">
        <div className="chart-yaxis">
          {ticks.map((t) => (
            <span key={t} className="ytick">{t}</span>
          ))}
        </div>

        <div className="chart-grid">
          <div className="chart-bars">
            {chartData.map((d) => (
              <div className="bar-col" key={d.mois}>
                <div className="bar-stack">
                  {d.conge > 0 && (
                    <div
                      className="bar-seg bar-seg--conge"
                      style={{ height: `${(d.conge / max) * 100}%` }}
                    >
                      <span className="bar-val">{d.conge}</span>
                    </div>
                  )}
                  {d.travail > 0 && (
                    <div
                      className="bar-seg bar-seg--travail"
                      style={{ height: `${(d.travail / max) * 100}%` }}
                    >
                      <span className="bar-val">{d.travail}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="chart-xaxis">
            <span className="xlabel">Mois</span>
            {chartData.map((d) => (
              <span className="xlabel" key={d.mois}>{d.mois}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TableauDeBord() {
  const [date] = useState("21/05/2025");

  return (
    <div className="page">
      <h1 className="page-title">Tableau de bord</h1>

      {/* Filtres haut */}
      <div className="dashboard-top">
        <div className="field">
          <label className="field-label">Date du jour</label>
          <div style={{ position: "relative" }}>
            <input className="input-date" type="text" defaultValue={date} />
            <span style={{ position: "absolute", right: 12, top: 14, color: "var(--text-mute)" }}>
              <IconCalendar />
            </span>
          </div>
        </div>
        <div className="quick-filters">
          <button className="chip-quick">Hier</button>
          <button className="chip-quick">Semaine dernière</button>
          <button className="chip-quick">Mois dernier</button>
        </div>
      </div>

      {/* Cartes */}
      <div className="stat-cards">
        {statsCards.map((c) => <StatCard key={c.id} card={c} />)}
      </div>

      {/* Statistiques */}
      <h2 className="section-title">Statistique de demandes Année 2026</h2>
      <Chart />

      {/* Liste des demandes */}
      <h2 className="section-title">Liste des demandes</h2>

      <div className="table-filters">
        <div className="search-box" style={{ width: 350 }}>
          <input className="search-input" placeholder="Rechercher" />
          <span className="search-icon"><IconSearch /></span>
        </div>
        <div className="field">
          <label className="field-label">Trier</label>
          <div className="select-wrap">
            <select className="select-trier" style={{ minWidth: 230 }} defaultValue="type">
              <option value="type">Par type</option>
              <option value="date">Par date</option>
              <option value="statut">Par statut</option>
            </select>
            <IconChevronDown className="select-caret" />
          </div>
        </div>
      </div>

      <div className="table">
        <div className="table-head">
          <div className="th th-check"><input type="checkbox" /></div>
          <div className="th">Date</div>
          <div className="th">Matricule</div>
          <div className="th">Nom</div>
          <div className="th">Prénoms</div>
          <div className="th">Documents</div>
          <div className="th">Statut</div>
          <div className="th">Actions</div>
        </div>
        {demandesTable.map((row, i) => (
          <div className="table-row" key={i}>
            <div className="td td-check"><input type="checkbox" /></div>
            <div className="td">{row.date}</div>
            <div className="td">{row.matricule}</div>
            <div className="td">{row.nom}</div>
            <div className="td">{row.prenoms}</div>
            <div className="td">{row.document}</div>
            <div className={`td td-statut ${row.statut === "Validé" ? "is-valide" : "is-encours"}`}>
              {row.statut}
            </div>
            <div className="td td-action">Détails</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TableauDeBord;
