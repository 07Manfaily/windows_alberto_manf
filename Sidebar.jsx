import { useState } from "react";
import { IconChevron, IconChevronDown } from "./Icons";
import "./Sidebar.css";

function Sidebar({ current, onNavigate }) {
  const [attOpen, setAttOpen] = useState(true);

  const isActive = (key) => current === key;

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <button
          className={`nav-item ${isActive("dashboard") ? "active" : ""}`}
          onClick={() => onNavigate("dashboard")}
        >
          <IconChevron className="nav-arrow" />
          <span>Tableau de bord</span>
        </button>

        <button
          className={`nav-item ${isActive("demandes") ? "active" : ""}`}
          onClick={() => onNavigate("demandes")}
        >
          <IconChevron className="nav-arrow" />
          <span>Demandes</span>
        </button>

        <button
          className="nav-item"
          onClick={() => setAttOpen((o) => !o)}
        >
          {attOpen ? <IconChevronDown className="nav-arrow" /> : <IconChevron className="nav-arrow" />}
          <span>Attestations de</span>
        </button>

        {attOpen && (
          <div className="nav-sub">
            <button
              className={`nav-subitem ${isActive("travail") ? "active" : ""}`}
              onClick={() => onNavigate("travail")}
            >
              <IconChevron className="nav-arrow-sm" />
              <span>Travail</span>
            </button>
            <button
              className={`nav-subitem ${isActive("conge") ? "active" : ""}`}
              onClick={() => onNavigate("conge")}
            >
              <IconChevron className="nav-arrow-sm" />
              <span>Congé</span>
            </button>
          </div>
        )}

        <button
          className={`nav-item ${isActive("documents") ? "active" : ""}`}
          onClick={() => onNavigate("documents")}
        >
          <IconChevron className="nav-arrow" />
          <span>Ajouter documents</span>
        </button>

        <button
          className={`nav-item ${isActive("offres") || isActive("offre-creer") || isActive("offre-detail") ? "active" : ""}`}
          onClick={() => onNavigate("offres")}
        >
          <IconChevron className="nav-arrow" />
          <span>Offre Emplois</span>
        </button>

        <button
          className={`nav-item ${isActive("gestionnaires") ? "active" : ""}`}
          onClick={() => onNavigate("gestionnaires")}
        >
          <IconChevron className="nav-arrow" />
          <span>gestionnaires</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
