import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TableauDeBord from "./pages/TableauDeBord";
import Demandes from "./pages/Demandes";
import AttestationListe from "./pages/AttestationListe";
import AjoutDocuments from "./pages/AjoutDocuments";
import OffreEmplois from "./pages/OffreEmplois";
import "./index.css";

function App() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <TableauDeBord />;
      case "demandes": return <Demandes />;
      case "travail": return <AttestationListe type="travail" />;
      case "conge": return <AttestationListe type="conge" />;
      case "documents": return <AjoutDocuments />;
      case "offres": return <OffreEmplois />;
      default: return <TableauDeBord />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar current={page} onNavigate={setPage} />
      {renderPage()}
    </div>
  );
}

export default App;
