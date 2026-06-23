import { useState } from "react";
import FilterBar from "../components/FilterBar";
import { IconSearch, IconArrowUpRight } from "../components/Icons";
import { offres } from "../data/mockData";
import CreerOffre from "./CreerOffre";
import DetailOffre from "./DetailOffre";
import "./OffreEmplois.css";

const TABS = [
  { key: "tout", label: "Tout" },
  { key: "en_cours", label: "En cours" },
  { key: "expire", label: "Expiré" },
];

function OffreEmplois() {
  const [view, setView] = useState("list"); // list | creer | detail
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("tout");

  if (view === "creer") return <CreerOffre onBack={() => setView("list")} />;
  if (view === "detail") return <DetailOffre offre={selected} onBack={() => setView("list")} />;

  const visibles = offres.filter((o) => tab === "tout" || o.statut === tab);

  return (
    <div className="page">
      <div className="offre-header">
        <h1 className="page-title" style={{ margin: 0 }}>Offres d’emplois / mobilité</h1>
        <button className="btn btn-dark" onClick={() => setView("creer")}>
          Créer une offre d’emploi
        </button>
      </div>

      <FilterBar />

      <h2 className="section-title">Liste des offres en cours</h2>

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

      <div className="date-heading">11 Mai 2026</div>

      <div className="offre-grid">
        {visibles.map((o) => (
          <div className="offre-card" key={o.id}>
            <h3 className="offre-card-title">{o.titre}</h3>
            <div className="offre-tags">
              {o.contrats.map((c) => (
                <span className="offre-tag" key={c}>{c}</span>
              ))}
            </div>
            <button
              className="offre-details"
              onClick={() => { setSelected(o); setView("detail"); }}
            >
              Détails <IconArrowUpRight />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OffreEmplois;
