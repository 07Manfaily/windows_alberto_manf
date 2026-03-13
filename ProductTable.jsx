import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, Card, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DataTable from "react-data-table-component";
import Filter from "../utils/tableFilter";
import Wizard from "../components/modal/createFormationAction";
import { api } from "../services/api";
import Gant from "./gantt";
import { Calendar } from "lucide-react";
import Skeleton from "@mui/material/Skeleton";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

/* ─── Injected global styles ──────────────────────────────────────────────── */
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --accent:     #1a3c5e;
    --accent-mid: #2a5298;
    --accent-lt:  #e8f0fb;
    --gold:       #c8972a;
    --gold-lt:    #fdf6e3;
    --danger:     #d64545;
    --danger-lt:  #fdf0f0;
    --success:    #1a7a4a;
    --surface:    #ffffff;
    --bg:         #f7f8fc;
    --border:     #e4e8f0;
    --text:       #1a2332;
    --muted:      #7a8aa0;
    --radius-lg:  18px;
    --radius-md:  12px;
    --radius-sm:  8px;
    --shadow-sm:  0 2px 8px rgba(26,60,94,.07);
    --shadow-md:  0 6px 24px rgba(26,60,94,.10);
    --shadow-lg:  0 16px 48px rgba(26,60,94,.14);
  }

  body { background: var(--bg); }

  /* ── Typography ── */
  .pf-display { font-family: 'Playfair Display', serif; }
  .pf-body    { font-family: 'Outfit', sans-serif; }

  /* ── Page wrapper ── */
  .pf-page {
    font-family: 'Outfit', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    padding: 32px 36px;
    color: var(--text);
  }

  /* ── Top bar ── */
  .pf-topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
  }
  .pf-page-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: -.3px;
    line-height: 1;
  }
  .pf-page-sub {
    font-size: 12.5px;
    color: var(--muted);
    margin-top: 4px;
    letter-spacing: .4px;
  }

  /* ── Year navigator ── */
  .pf-year-nav {
    display: inline-flex;
    align-items: center;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 50px;
    padding: 4px 6px;
    gap: 2px;
    box-shadow: var(--shadow-sm);
  }
  .pf-year-arrow {
    width: 32px; height: 32px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background .18s, color .18s;
  }
  .pf-year-arrow:hover { background: var(--accent-lt); color: var(--accent-mid); }
  .pf-year-arrow:disabled { opacity: .3; cursor: not-allowed; }

  .pf-year-pill {
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 50px;
    padding: 6px 20px;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex; align-items: center; gap: 7px;
    transition: background .2s, transform .2s;
    letter-spacing: .3px;
  }
  .pf-year-pill:hover { background: var(--accent-mid); transform: scale(1.03); }

  /* ── Year dropdown ── */
  .pf-year-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 16px;
    box-shadow: var(--shadow-lg);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    min-width: 240px;
    max-height: 320px;
    overflow-y: auto;
    z-index: 200;
    animation: dropIn .18s ease;
  }
  @keyframes dropIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }

  .pf-year-opt {
    border: 1.5px solid transparent;
    border-radius: var(--radius-sm);
    background: none;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--muted);
    padding: 8px;
    cursor: pointer;
    transition: all .15s;
    text-align: center;
  }
  .pf-year-opt:hover { background: var(--accent-lt); color: var(--accent); border-color: var(--border); }
  .pf-year-opt.active {
    background: var(--accent);
    color: #fff;
    font-weight: 700;
    border-color: var(--accent);
    box-shadow: 0 3px 10px rgba(26,60,94,.25);
  }

  /* ── DataTable overrides ── */
  .rdt_TableHead .rdt_TableHeadRow {
    background: var(--accent) !important;
    border-radius: var(--radius-md) var(--radius-md) 0 0 !important;
    overflow: hidden;
  }
  .rdt_TableHead .rdt_TableCol {
    color: #fff !important;
    font-family: 'Outfit', sans-serif !important;
    font-size: 11.5px !important;
    font-weight: 600 !important;
    letter-spacing: 1.2px !important;
    text-transform: uppercase !important;
  }
  .rdt_TableRow {
    border-bottom: 1px solid var(--border) !important;
    font-family: 'Outfit', sans-serif !important;
    font-size: 13.5px !important;
    color: var(--text) !important;
    transition: background .15s !important;
  }
  .rdt_TableRow:hover { background: var(--accent-lt) !important; }
  .rdt_Pagination {
    font-family: 'Outfit', sans-serif !important;
    color: var(--muted) !important;
    border-top: 1.5px solid var(--border) !important;
  }
  .rdt_TableWrapper { border-radius: 0 0 var(--radius-lg) var(--radius-lg); overflow: hidden; }

  /* ── Code badge ── */
  .pf-code-badge {
    background: var(--accent-lt);
    color: var(--accent-mid);
    border: 1px solid #c4d6f5;
    font-size: 11.5px;
    font-weight: 700;
    padding: 3px 11px;
    border-radius: 50px;
    letter-spacing: .4px;
    font-family: 'Outfit', sans-serif;
    display: inline-block;
  }

  /* ── View button ── */
  .pf-view-btn {
    background: none !important;
    border: 1.5px solid var(--border) !important;
    border-radius: var(--radius-sm) !important;
    color: var(--muted) !important;
    width: 34px !important; height: 34px !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    cursor: pointer !important;
    transition: all .18s !important;
    padding: 0 !important;
    min-width: unset !important;
  }
  .pf-view-btn:hover {
    background: var(--accent-lt) !important;
    border-color: var(--accent-mid) !important;
    color: var(--accent) !important;
  }
  .pf-view-btn svg { color: inherit !important; font-size: 18px !important; }

  /* ── Add button ── */
  .pf-add-btn {
    background: var(--accent) !important;
    color: #fff !important;
    font-family: 'Outfit', sans-serif !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    text-transform: none !important;
    border-radius: 50px !important;
    padding: 8px 22px !important;
    letter-spacing: .3px !important;
    box-shadow: 0 4px 14px rgba(26,60,94,.25) !important;
    transition: all .22s !important;
  }
  .pf-add-btn:hover {
    background: var(--accent-mid) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 22px rgba(26,60,94,.3) !important;
  }

  /* ── Skeleton ── */
  .pf-skeleton { border-radius: var(--radius-sm) !important; }

  /* ══════════════════ DIALOG / MODAL ══════════════════ */
  dialog.pf-dialog {
    border: none !important;
    border-radius: var(--radius-lg) !important;
    padding: 0 !important;
    max-width: 900px !important;
    width: 92% !important;
    max-height: 90vh !important;
    overflow: hidden !important;
    box-shadow: var(--shadow-lg) !important;
    background: transparent !important;
  }
  dialog.pf-dialog::backdrop {
    background: rgba(10,20,40,.45);
    backdrop-filter: blur(4px);
  }

  .pf-dialog-inner {
    background: var(--bg);
    padding: 28px;
    overflow-y: auto;
    max-height: 90vh;
  }

  .pf-dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  .pf-dialog-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--accent);
  }
  .pf-dialog-close {
    width: 34px; height: 34px;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 50%;
    font-size: 17px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--muted);
    transition: all .2s;
    line-height: 1;
  }
  .pf-dialog-close:hover { background: var(--danger-lt); border-color: var(--danger); color: var(--danger); }

  /* ── Form sections ── */
  .pf-section {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    padding: 22px;
    margin-bottom: 18px;
    box-shadow: var(--shadow-sm);
  }
  .pf-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-weight: 700;
    color: var(--accent);
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .pf-section-title::before {
    content: '';
    display: inline-block;
    width: 4px; height: 18px;
    border-radius: 3px;
    background: var(--gold);
    flex-shrink: 0;
  }

  /* ── Form labels + inputs ── */
  .pf-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.3px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 7px;
    font-family: 'Outfit', sans-serif;
  }
  .pf-input, .pf-textarea {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-family: 'Outfit', sans-serif;
    color: var(--text);
    background: var(--bg);
    outline: none;
    transition: border-color .2s, box-shadow .2s;
    box-sizing: border-box;
  }
  .pf-input::placeholder, .pf-textarea::placeholder { color: #b0bcc8; }
  .pf-input:focus, .pf-textarea:focus {
    border-color: var(--accent-mid);
    box-shadow: 0 0 0 3px rgba(42,82,152,.10);
    background: var(--surface);
  }
  .pf-textarea { resize: vertical; font-family: 'Outfit', sans-serif; }

  .pf-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .pf-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }

  /* ── Budget / OGF sub-cards ── */
  .pf-sub-card {
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 16px;
    margin-bottom: 12px;
    transition: box-shadow .2s;
  }
  .pf-sub-card:hover { box-shadow: var(--shadow-sm); }
  .pf-sub-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }
  .pf-sub-card-label {
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--accent);
    font-family: 'Outfit', sans-serif;
  }

  .pf-sub-scroll { max-height: 260px; overflow-y: auto; padding-right: 2px; }
  .pf-sub-scroll::-webkit-scrollbar { width: 3px; }
  .pf-sub-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  /* ── Buttons inside dialog ── */
  .pf-btn-add-sub {
    display: flex; align-items: center; justify-content: center; gap: 7px;
    width: 100%;
    border: 1.5px dashed var(--border);
    border-radius: var(--radius-sm);
    background: none;
    color: var(--muted);
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 10px;
    cursor: pointer;
    margin-top: 10px;
    transition: all .2s;
  }
  .pf-btn-add-sub:hover { border-color: var(--accent-mid); color: var(--accent); background: var(--accent-lt); }

  .pf-btn-delete {
    display: flex; align-items: center; gap: 5px;
    background: var(--danger-lt);
    border: 1.5px solid #f5c0c0;
    color: var(--danger);
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 50px;
    cursor: pointer;
    transition: all .2s;
  }
  .pf-btn-delete:hover { background: #f9d4d4; border-color: var(--danger); }

  /* ── Dialog footer ── */
  .pf-dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
  }
  .pf-btn-cancel {
    background: var(--surface);
    border: 1.5px solid var(--border);
    color: var(--muted);
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 500;
    padding: 11px 26px;
    border-radius: 50px;
    cursor: pointer;
    transition: all .2s;
  }
  .pf-btn-cancel:hover { border-color: var(--muted); color: var(--text); }
  .pf-btn-submit {
    background: var(--accent);
    border: none;
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 700;
    padding: 11px 32px;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(26,60,94,.28);
    letter-spacing: .4px;
    transition: all .22s;
  }
  .pf-btn-submit:hover { background: var(--accent-mid); transform: translateY(-2px); box-shadow: 0 8px 22px rgba(26,60,94,.32); }

  /* ── File info tag ── */
  .pf-file-info {
    display: inline-flex; align-items: center; gap: 5px;
    margin-top: 8px;
    font-size: 12px;
    color: var(--success);
    font-weight: 500;
    font-family: 'Outfit', sans-serif;
  }

  /* ── Misc ── */
  .pf-gold-accent { color: var(--gold); }
`;

const ProductTable = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [columns, setColumn] = useState([]);
  const [data, setData] = useState();
  const [filterText, setFilterText] = useState("");
  const [value, setValue] = React.useState("1");
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 27 }, (_, i) => currentYear - 26 + i);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showDropdown, setShowDropdown] = useState(false);

  const handlePrevious = () => {
    setSelectedYear((prev) => Math.max(prev - 1, years[0]));
  };

  const dialogRef = useRef(null);
  const [formData, setFormData] = useState({
    year: "",
    cotisation: "",
    note: null,
    budget: [{ intitule: "", compte: "", budget: "" }],
    ogf: [{ intitule: "", description: "" }],
  });

  const openDialog = () => { dialogRef.current?.showModal(); };
  const closeDialog = () => { dialogRef.current?.close(); };

  const handleChangee = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    setFormData({ ...formData, note: e.target.files[0] });
  };

  const handleBudgetChange = (index, field, value) => {
    const nouveauxBudgets = [...formData.budget];
    nouveauxBudgets[index][field] = value;
    setFormData({ ...formData, budget: nouveauxBudgets });
  };
  const _addBudget = () => {
    setFormData({ ...formData, budget: [...formData.budget, { intitule: "", compte: "", budget: "" }] });
  };
  const _deleteBudget = (index) => {
    const nouveauxBudgets = formData.budget.filter((_, i) => i !== index);
    setFormData({ ...formData, budget: nouveauxBudgets });
  };

  const handleOgfChange = (index, field, value) => {
    const nouveauxOgfs = [...formData.ogf];
    nouveauxOgfs[index][field] = value;
    setFormData({ ...formData, ogf: nouveauxOgfs });
  };
  const _addOgf = () => {
    setFormData({ ...formData, ogf: [...formData.ogf, { intitule: "", description: "" }] });
  };
  const _deleteOgf = (index) => {
    const nouveauxOgfs = formData.ogf.filter((_, i) => i !== index);
    setFormData({ ...formData, ogf: nouveauxOgfs });
  };

  const _sendFormationPlan = {
    annee_d_execution: formData.year,
    cotisation_fdfp_part_entreprise: formData.cotisation,
    note_orientation: formData.note ? formData.note.name : null,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const _formationPlanData = new FormData();
    Object.keys(_sendFormationPlan).forEach((k) => {
      _formationPlanData.append(k, _sendFormationPlan[k]);
    });
    if (formData.note) _formationPlanData.append("note_orientation", formData.note);
    _formationPlanData.append("budget", JSON.stringify(formData.budget));
    _formationPlanData.append("ogf", JSON.stringify(formData.ogf));
    try {
      const response = await api.post("/creation/plan/formation", _formationPlanData, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 201) {
        alert("Formulaire soumis avec succès !");
        closeDialog();
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      alert("erreur", error);
    }
  };

  const handleNext = () => {
    selectedYear === years[years.length - 1]
      ? openDialog()
      : setSelectedYear((prev) => Math.min(prev + 1, years[years.length - 1]));
  };
  const handleYearSelect = (year) => { setSelectedYear(year); setShowDropdown(false); };

  const Click = (code) => { navigate(`/unfold/${code}`); };

  const handleChange = (event, newValue) => { setValue(newValue); };
  const handleOpenModal = () => { setModalOpen(true); };
  const handleCloseModal = () => { setModalOpen(false); };

  /* ── "Ajouter" button in subheader ── */
  const subHeaderComponentMemo = (
    <Button
      size="small"
      variant="contained"
      onClick={handleOpenModal}
      startIcon={<AddIcon />}
      className="pf-add-btn"
    >
      Ajouter
    </Button>
  );

  const handleGetFormationPlan = async () => {
    try {
      const response = await api.get("get/formations/2025");
      if (response.status === 200) {
        const col = [
          {
            name: "Code formation",
            selector: (row) => row.code_formation,
            sortable: true,
            cell: (row) => (
              <span className="pf-code-badge">{row.code_formation}</span>
            ),
          },
          { name: "Intitulé formation", selector: (row) => row.title, sortable: true },
          {
            name: "Date de début",
            selector: (row) => row.prevision_prevision_start_date,
            sortable: true,
            cell: (row) => (
              <span style={{ color: row.prevision_prevision_start_date ? "#1a2332" : "#b0bcc8", fontSize: 13 }}>
                {row.prevision_prevision_start_date || "——"}
              </span>
            ),
          },
          {
            name: "Date de fin",
            selector: (row) => row.prevision_prevision_end_date,
            sortable: true,
            cell: (row) => (
              <span style={{ color: row.prevision_prevision_end_date ? "#1a2332" : "#b0bcc8", fontSize: 13 }}>
                {row.prevision_prevision_end_date || "——"}
              </span>
            ),
          },
          {
            name: "Formateur",
            selector: (row) => row.teacher,
            sortable: true,
            cell: (row) => (
              <span style={{ color: row.teacher ? "#c8972a" : "#b0bcc8", fontWeight: row.teacher ? 600 : 400, fontSize: 13 }}>
                {row.teacher || "——"}
              </span>
            ),
          },
          {
            name: "Action",
            button: true,
            cell: (row) => (
              <Button className="pf-view-btn" onClick={() => Click(row.code_formation)}>
                <VisibilityIcon style={{ color: "inherit", fontSize: 18 }} />
              </Button>
            ),
          },
        ];
        setData(response.data.data);
        setColumn(col);
      }
    } catch (error) {
      // handle error
    }
  };

  const filteredItems = data
    ? data.filter((item) =>
        Object.values(item).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(filterText.toLowerCase())
        )
      )
    : [];

  useEffect(() => { handleGetFormationPlan(); }, []);

  /* ── DataTable custom styles ── */
  const customStyles = {
    header: {
      style: { minHeight: "56px", fontSize: "22px", fontWeight: "700", fontFamily: "'Playfair Display', serif", color: "#1a3c5e", margin: 0 },
    },
    headRow: {
      style: { backgroundColor: "#1a3c5e", borderTopLeftRadius: "12px", borderTopRightRadius: "12px", fontWeight: "600" },
    },
    headCells: {
      style: { color: "#ffffff", fontFamily: "'Outfit', sans-serif", fontSize: "11.5px", letterSpacing: "1.2px", textTransform: "uppercase" },
    },
    rows: {
      style: { fontFamily: "'Outfit', sans-serif", fontSize: "13.5px", color: "#1a2332", borderBottom: "1px solid #e4e8f0" },
      highlightOnHoverStyle: { backgroundColor: "#e8f0fb" },
    },
    pagination: {
      style: {
        display: "flex", justifyContent: "center", alignItems: "center",
        borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px",
        backgroundColor: "#fff", fontFamily: "'Outfit', sans-serif",
        color: "#7a8aa0", borderTop: "1.5px solid #e4e8f0",
      },
      pageButtonsStyle: {
        borderRadius: "50%", height: "36px", width: "36px", padding: "8px",
        cursor: "pointer", transition: "0.2s", backgroundColor: "transparent",
        "&:disabled": { cursor: "unset" },
        "&:hover:not(:disabled)": { backgroundColor: "#e8f0fb" },
        "&:focus": { outline: "none" },
      },
    },
  };

  return (
    <>
      {/* Inject styles */}
      <style>{GLOBAL_STYLE}</style>

      {/* ═══════════════ DIALOG ═══════════════ */}
      <dialog ref={dialogRef} className="pf-dialog">
        <div className="pf-dialog-inner">

          {/* Header */}
          <div className="pf-dialog-header">
            <h2 className="pf-dialog-title">Créer un Plan de Formation</h2>
            <button onClick={closeDialog} className="pf-dialog-close">✕</button>
          </div>

          <form onSubmit={handleSubmit}>

            {/* ── Section Infos générales ── */}
            <div className="pf-section">
              <div className="pf-section-title">Informations Générales</div>
              <div className="pf-grid-2" style={{ marginBottom: 16 }}>
                <div>
                  <label className="pf-label">Année d'exécution *</label>
                  <input className="pf-input" type="number" name="year" value={formData.year}
                    onChange={handleChangee} required placeholder="Ex : 2025" />
                </div>
                <div>
                  <label className="pf-label">Cotisation FDFP Part Entreprise</label>
                  <input className="pf-input" type="text" name="cotisation" value={formData.cotisation}
                    onChange={handleChangee} required placeholder="Cotisation FDFP" />
                </div>
              </div>
              <div>
                <label className="pf-label">Note d'orientation (fichier) *</label>
                <input type="file" name="note" onChange={handleFileChange} required
                  accept=".pdf,.doc,.docx,.txt"
                  style={{
                    width: "100%", padding: "11px 14px", border: "1.5px dashed #c4d0de",
                    borderRadius: 8, fontSize: 13.5, fontFamily: "'Outfit', sans-serif",
                    cursor: "pointer", backgroundColor: "#f7f8fc", color: "#7a8aa0",
                    boxSizing: "border-box", outline: "none",
                  }}
                />
                {formData.note && (
                  <p className="pf-file-info">✓ Fichier sélectionné : {formData.note.name}</p>
                )}
              </div>
            </div>

            {/* ── Section Budget ── */}
            <div className="pf-section">
              <div className="pf-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div className="pf-section-title" style={{ marginBottom: 0 }}>Budget(s)</div>
                <button type="button" onClick={_addBudget}
                  style={{
                    background: "#1a3c5e", color: "#fff", border: "none",
                    padding: "8px 18px", borderRadius: 50, fontSize: 13,
                    fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                    display: "flex", alignItems: "center", gap: 6,
                    boxShadow: "0 3px 10px rgba(26,60,94,.22)", transition: "all .2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#2a5298"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#1a3c5e"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  + Ajouter un budget
                </button>
              </div>
              <div className="pf-sub-scroll">
                {formData.budget.map((budgetItem, index) => (
                  <div className="pf-sub-card" key={index}>
                    <div className="pf-sub-card-header">
                      <span className="pf-sub-card-label">Budget #{index + 1}</span>
                      {formData.budget.length > 1 && (
                        <button type="button" className="pf-btn-delete" onClick={() => _deleteBudget(index)}>
                          ✕ Supprimer
                        </button>
                      )}
                    </div>
                    <div className="pf-grid-3">
                      <div>
                        <label className="pf-label">Intitulé *</label>
                        <input className="pf-input" type="text" value={budgetItem.intitule}
                          onChange={(e) => handleBudgetChange(index, "intitule", e.target.value)}
                          required placeholder="Intitulé du compte" />
                      </div>
                      <div>
                        <label className="pf-label">Compte *</label>
                        <input className="pf-input" type="text" value={budgetItem.compte}
                          onChange={(e) => handleBudgetChange(index, "compte", e.target.value)}
                          required placeholder="Numéro de compte" />
                      </div>
                      <div>
                        <label className="pf-label">Montant *</label>
                        <input className="pf-input" type="number" step="0.01" value={budgetItem.budget}
                          onChange={(e) => handleBudgetChange(index, "budget", e.target.value)}
                          required placeholder="0.00" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Section OGF ── */}
            <div className="pf-section">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div className="pf-section-title" style={{ marginBottom: 0 }}>OGF — Objectifs Globaux de Formation</div>
                <button type="button"
                  style={{
                    background: "#c8972a", color: "#fff", border: "none",
                    padding: "8px 18px", borderRadius: 50, fontSize: 13,
                    fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                    display: "flex", alignItems: "center", gap: 6,
                    boxShadow: "0 3px 10px rgba(200,151,42,.25)", transition: "all .2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = ".88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
                  onClick={_addOgf}
                >
                  + Ajouter un OGF
                </button>
              </div>
              <div className="pf-sub-scroll">
                {formData.ogf.map((ogfItem, index) => (
                  <div className="pf-sub-card" key={index}>
                    <div className="pf-sub-card-header">
                      <span className="pf-sub-card-label">OGF #{index + 1}</span>
                      {formData.ogf.length > 1 && (
                        <button type="button" className="pf-btn-delete" onClick={() => _deleteOgf(index)}>
                          ✕ Supprimer
                        </button>
                      )}
                    </div>
                    <div style={{ display: "grid", gap: 12 }}>
                      <div>
                        <label className="pf-label">Intitulé de l'OGF *</label>
                        <input className="pf-input" type="text" value={ogfItem.intitule}
                          onChange={(e) => handleOgfChange(index, "intitule", e.target.value)}
                          required placeholder="Intitulé de l'OGF" />
                      </div>
                      <div>
                        <label className="pf-label">Description de l'OGF *</label>
                        <textarea className="pf-textarea" value={ogfItem.description}
                          onChange={(e) => handleOgfChange(index, "description", e.target.value)}
                          required placeholder="Description détaillée de l'OGF" rows="3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Footer buttons ── */}
            <div className="pf-dialog-footer">
              <button type="button" onClick={closeDialog} className="pf-btn-cancel">Annuler</button>
              <button type="submit" className="pf-btn-submit">✓ Enregistrer</button>
            </div>
          </form>
        </div>
      </dialog>

      {/* ═══════════════ MAIN PAGE ═══════════════ */}
      <div className="pf-page">
        <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden", background: "transparent" }}>

          {/* Top bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 0 24px 0" }}>
            <div>
              <h5 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 26, color: "#1a3c5e", margin: 0, letterSpacing: "-.3px" }}>
                Plan de Formations
              </h5>
              <p style={{ fontSize: 12.5, color: "#7a8aa0", marginTop: 4, fontFamily: "'Outfit', sans-serif" }}>
                Gestion et suivi des formations · {selectedYear}
              </p>
            </div>

            {/* Year navigator */}
            <div style={{ position: "relative" }}>
              <div className="pf-year-nav">
                <button className="pf-year-arrow" onClick={handlePrevious} disabled={selectedYear === years[0]}>
                  <FaChevronCircleLeft color="currentColor" size={18} />
                </button>
                <button className="pf-year-pill" onClick={() => setShowDropdown(!showDropdown)}>
                  {selectedYear} <Calendar size={14} />
                </button>
                <button className="pf-year-arrow" onClick={handleNext} disabled={selectedYear === years[years.length - 1]}>
                  <FaChevronCircleRight size={18} color="currentColor" />
                </button>
              </div>

              {showDropdown && (
                <div className="pf-year-dropdown">
                  {years.map((year) => (
                    <button
                      key={year}
                      className={`pf-year-opt${year === selectedYear ? " active" : ""}`}
                      onClick={() => handleYearSelect(year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table card */}
          <Card sx={{ border: "1.5px solid #e4e8f0", margin: 0, padding: "1%", borderRadius: 3, boxShadow: "0 6px 24px rgba(26,60,94,.08)", background: "#fff" }}>
            {filteredItems.length > 0 ? (
              <DataTable
                columns={columns}
                customStyles={customStyles}
                data={filteredItems}
                pagination
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
                highlightOnHover
              />
            ) : (
              Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} height={56} width="100%"
                  sx={{ borderRadius: 1, mb: .5, bgcolor: "#f0f3f8" }} />
              ))
            )}
          </Card>

          <Wizard sx={{ borderRadius: 7 }} open={modalOpen} onClose={handleCloseModal} />
        </Paper>
      </div>
    </>
  );
};

export default ProductTable;
