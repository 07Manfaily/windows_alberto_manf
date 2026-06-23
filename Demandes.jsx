import { useState } from "react";
import FilterBar from "../components/FilterBar";
import DemandeItem from "../components/DemandeItem";
import { IconSearch } from "../components/Icons";
import { demandes } from "../data/mockData";
import "./Demandes.css";

const TABS = [
  { key: "tout", label: "Tout" },
  { key: "travail", label: "Attestation de travail" },
  { key: "conge", label: "Attestation de congés" },
];

function Demandes() {
  const [tab, setTab] = useState("tout");

  const visibles = demandes.filter((d) => tab === "tout" || d.type === tab);

  return (
    <div className="page">
      <h1 className="page-title">Listes des demandes</h1>

      {/* Bloc Trier par */}
      <div className="sort-panel">
        <span className="sort-title">Trier par</span>
        <div className="sort-row">
          <div className="tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`tab ${tab === t.key ? "tab--active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="search-box sort-search">
            <input className="search-input" placeholder="Rechercher" />
            <span className="search-icon"><IconSearch /></span>
          </div>
        </div>
      </div>

      <FilterBar />

      <div className="date-heading">21 Mai 2026</div>

      <div className="demande-list">
        {visibles.map((d) => (
          <DemandeItem key={d.id} demande={d} />
        ))}
      </div>
    </div>
  );
}

export default Demandes;
