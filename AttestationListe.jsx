import FilterBar from "../components/FilterBar";
import DemandeItem from "../components/DemandeItem";
import { IconSearch } from "../components/Icons";
import { demandes } from "../data/mockData";
import "./AttestationListe.css";

// type : "travail" | "conge"
function AttestationListe({ type }) {
  const titre = type === "conge" ? "Attestations de congés" : "Attestations de travails";
  const visibles = demandes.filter((d) => d.type === type);

  return (
    <div className="page">
      <h1 className="page-title">{titre}</h1>

      <div className="search-box att-search">
        <input className="search-input" placeholder="Rechercher" />
        <span className="search-icon"><IconSearch /></span>
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

export default AttestationListe;
