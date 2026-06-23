import FilterBar from "../components/FilterBar";
import { IconFile, IconChevronDown } from "../components/Icons";
import { documents } from "../data/mockData";
import "./AjoutDocuments.css";

function AjoutDocuments() {
  return (
    <div className="page">
      <h1 className="page-title">Ajout de documents</h1>

      {/* Créer une */}
      <div className="creer-panel">
        <span className="creer-title">Créer une</span>
        <div className="creer-actions">
          <button className="creer-btn">
            <IconChevronDown />
            <span>Note d’information</span>
          </button>
          <button className="creer-btn">
            <IconChevronDown />
            <span>Decision RH</span>
          </button>
        </div>
      </div>

      <FilterBar />

      <h2 className="section-title doc-list-title">Liste des documents</h2>
      <div className="date-heading">11 Mai 2026</div>

      <div className="doc-list">
        {documents.map((doc) => (
          <div className="doc-item" key={doc.id}>
            <div className="doc-left">
              <span className="doc-icon"><IconFile /></span>
              <div className="doc-info">
                <span className="doc-type">{doc.type}</span>
                <div className="doc-tags">
                  <span className="doc-tag">{doc.cible}</span>
                  {doc.agent && <span className="doc-tag">{doc.agent}</span>}
                </div>
              </div>
            </div>
            <button className="btn btn-dark doc-consulter">Consulter</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AjoutDocuments;
