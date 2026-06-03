import { useState } from "react";

const initialData = [
  { id: 1, date: "25/02/2026", b2i: [45, 50, 53], cds: [20, 80, 56], efi: [10, 90, 84], mei: [20, 20, 100], nea: [20, 20, 100], pme: [20, 20, 100] },
  { id: 2, date: "24/02/2026", b2i: [45, 50, 53], cds: [20, 80, 56], efi: [10, 90, 84], mei: [20, 20, 100], nea: [20, 20, 100], pme: [20, 20, 100] },
  { id: 3, date: "23/02/2026", b2i: [45, 50, 53], cds: [20, 80, 56], efi: [10, 90, 84], mei: [20, 20, 100], nea: [20, 20, 100], pme: [20, 20, 100] },
  { id: 4, date: "22/02/2026", b2i: [40, 55, 72], cds: [18, 75, 60], efi: [12, 85, 90], mei: [22, 22, 100], nea: [15, 20, 75], pme: [18, 20, 90] },
  { id: 5, date: "21/02/2026", b2i: [38, 50, 76], cds: [22, 80, 55], efi: [14, 90, 78], mei: [20, 22, 91], nea: [20, 20, 100], pme: [19, 20, 95] },
  { id: 6, date: "20/02/2026", b2i: [42, 50, 84], cds: [25, 80, 69], efi: [10, 90, 84], mei: [20, 20, 100], nea: [18, 20, 90], pme: [20, 20, 100] },
  { id: 7, date: "19/02/2026", b2i: [30, 50, 60], cds: [20, 80, 56], efi: [8,  90, 71], mei: [19, 20, 95], nea: [20, 20, 100], pme: [17, 20, 85] },
  { id: 8, date: "18/02/2026", b2i: [45, 50, 90], cds: [20, 80, 56], efi: [10, 90, 84], mei: [20, 20, 100], nea: [20, 20, 100], pme: [20, 20, 100] },
  { id: 9, date: "17/02/2026", b2i: [44, 50, 88], cds: [19, 80, 52], efi: [11, 90, 83], mei: [20, 20, 100], nea: [20, 20, 100], pme: [20, 20, 100] },
  { id: 10, date: "16/02/2026", b2i: [43, 50, 86], cds: [21, 80, 58], efi: [9,  90, 80], mei: [20, 20, 100], nea: [20, 20, 100], pme: [20, 20, 100] },
  { id: 11, date: "15/02/2026", b2i: [35, 50, 70], cds: [20, 80, 56], efi: [10, 90, 84], mei: [18, 20, 90], nea: [16, 20, 80], pme: [20, 20, 100] },
  { id: 12, date: "14/02/2026", b2i: [28, 50, 56], cds: [15, 80, 45], efi: [7,  90, 62], mei: [17, 20, 85], nea: [14, 20, 70], pme: [19, 20, 95] },
];

const GROUPS = ["b2i", "cds", "efi", "mei", "nea", "pme"];
const GROUP_LABELS = { b2i: "B2I", cds: "CDS", efi: "EFI", mei: "MEI", nea: "NEA", pme: "PME" };
const PAGE_SIZE = 10;

function pctStyle(val) {
  if (val <= 60) return { color: "#993C1D", fontWeight: 600 };
  if (val <= 85) return { color: "#854F0B", fontWeight: 600 };
  return { color: "#3B6D11", fontWeight: 600 };
}

// ─────────────────────────────────────────────
// PAGE DÉTAIL
// ─────────────────────────────────────────────
function DetailPage({ row, onBack }) {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 700 }}>
      <button
        onClick={onBack}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "#EEEDFE", color: "#3C3489", border: "none",
          borderRadius: 6, padding: "7px 14px", cursor: "pointer",
          fontSize: 13, fontWeight: 500, marginBottom: "1.5rem",
        }}
      >
        ← Retour
      </button>

      <h2 style={{ fontSize: 20, color: "#3C3489", margin: "0 0 4px" }}>
        Détail du {row.date}
      </h2>
      <p style={{ color: "#888", fontSize: 13, margin: "0 0 1.5rem" }}>
        Récapitulatif de toutes les catégories pour cette date
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
        {GROUPS.map((g) => {
          const [traite, recus, pct] = row[g];
          return (
            <div
              key={g}
              style={{
                border: "1px solid #d1cff0", borderRadius: 10,
                padding: "14px 16px", background: "#fafaff",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: "#3C3489", marginBottom: 10 }}>
                {GROUP_LABELS[g]}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#888" }}>Traité</span>
                  <span style={{ fontWeight: 500 }}>{traite}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#888" }}>Reçus</span>
                  <span style={{ fontWeight: 500 }}>{recus}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, borderTop: "1px solid #e8e7f5", paddingTop: 6 }}>
                  <span style={{ color: "#888" }}>Taux</span>
                  <span style={pctStyle(pct)}>{pct}%</span>
                </div>
                <div style={{ background: "#e8e7f5", borderRadius: 99, height: 5, marginTop: 4 }}>
                  <div style={{
                    height: 5, borderRadius: 99,
                    width: `${pct}%`,
                    background: pct <= 60 ? "#993C1D" : pct <= 85 ? "#854F0B" : "#3B6D11",
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TABLE PRINCIPALE
// ─────────────────────────────────────────────
const s = {
  wrapper: { fontFamily: "system-ui, sans-serif", fontSize: 13 },
  table: { borderCollapse: "collapse", width: "100%", minWidth: 700 },
  groupTh: {
    background: "#EEEDFE", color: "#3C3489", fontWeight: 500, fontSize: 13,
    textAlign: "center", padding: "8px 10px", border: "0.5px solid #d1cff0",
  },
  subTh: {
    background: "#f5f5f3", color: "#888780", fontWeight: 400, fontSize: 12,
    textAlign: "center", padding: "6px 10px", border: "0.5px solid #e0dfd8",
  },
  dateCell: {
    background: "#EEEDFE", color: "#3C3489", fontWeight: 400,
    padding: "8px 12px", border: "0.5px solid #d1cff0", whiteSpace: "nowrap",
  },
  cell: { textAlign: "center", padding: "8px 10px", border: "0.5px solid #e0dfd8", color: "#2C2C2A" },
};

export default function App() {
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);

  const totalPages = Math.ceil(initialData.length / PAGE_SIZE);
  const paged = initialData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (selectedRow) {
    return <DetailPage row={selectedRow} onBack={() => setSelectedRow(null)} />;
  }

  return (
    <div style={s.wrapper}>
      <div style={{ overflowX: "auto", border: "0.5px solid #d1cff0", borderRadius: 8, overflow: "hidden" }}>
        <table style={s.table}>
          <thead>
            <tr>
              <th rowSpan={2} style={{ ...s.groupTh, background: "transparent", border: "0.5px solid #e0dfd8" }} />
              {GROUPS.map((g) => (
                <th key={g} colSpan={3} style={s.groupTh}>{GROUP_LABELS[g]}</th>
              ))}
            </tr>
            <tr>
              {GROUPS.map((g) => (
                <>
                  <th key={g + "-t"} style={s.subTh}>Traité</th>
                  <th key={g + "-r"} style={s.subTh}>Reçus</th>
                  <th key={g + "-p"} style={s.subTh}>%</th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row) => (
              <tr
                key={row.id}
                onClick={() => setSelectedRow(row)}
                style={{ cursor: "pointer", transition: "background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F4FD")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "")}
              >
                <td style={s.dateCell}>{row.date}</td>
                {GROUPS.map((g) => {
                  const [traite, recus, pct] = row[g];
                  return (
                    <>
                      <td key={g + "-t"} style={s.cell}>{traite}</td>
                      <td key={g + "-r"} style={s.cell}>{recus}</td>
                      <td key={g + "-p"} style={{ ...s.cell, ...pctStyle(pct) }}>{pct}%</td>
                    </>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination — visible seulement si > 10 éléments */}
      {initialData.length > PAGE_SIZE && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, marginTop: 12, fontSize: 13 }}>
          <span style={{ color: "#888", marginRight: 4 }}>
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, initialData.length)} sur {initialData.length}
          </span>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: "5px 12px", borderRadius: 6, border: "1px solid #d1cff0",
              background: page === 1 ? "#f5f5f3" : "#EEEDFE",
              color: page === 1 ? "#aaa" : "#3C3489",
              cursor: page === 1 ? "default" : "pointer", fontWeight: 500,
            }}
          >
            ‹ Préc.
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                padding: "5px 10px", borderRadius: 6,
                border: "1px solid " + (p === page ? "#7F77DD" : "#d1cff0"),
                background: p === page ? "#3C3489" : "#fff",
                color: p === page ? "#fff" : "#3C3489",
                cursor: "pointer", fontWeight: p === page ? 600 : 400,
              }}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: "5px 12px", borderRadius: 6, border: "1px solid #d1cff0",
              background: page === totalPages ? "#f5f5f3" : "#EEEDFE",
              color: page === totalPages ? "#aaa" : "#3C3489",
              cursor: page === totalPages ? "default" : "pointer", fontWeight: 500,
            }}
          >
            Suiv. ›
          </button>
        </div>
      )}
    </div>
  );
}
