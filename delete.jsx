import { useState } from "react";
import DataTable from "react-data-table-component";

const initialData = [
  { id: 1, date: "25/02/2026", b2i_t: 45, b2i_r: 50, b2i_p: 53, cds_t: 20, cds_r: 80, cds_p: 56, efi_t: 10, efi_r: 90, efi_p: 84, mei_t: 20, mei_r: 20, mei_p: 100, nea_t: 20, nea_r: 20, nea_p: 100, pme_t: 20, pme_r: 20, pme_p: 100 },
  { id: 2, date: "24/02/2026", b2i_t: 45, b2i_r: 50, b2i_p: 53, cds_t: 20, cds_r: 80, cds_p: 56, efi_t: 10, efi_r: 90, efi_p: 84, mei_t: 20, mei_r: 20, mei_p: 100, nea_t: 20, nea_r: 20, nea_p: 100, pme_t: 20, pme_r: 20, pme_p: 100 },
  { id: 3, date: "23/02/2026", b2i_t: 45, b2i_r: 50, b2i_p: 53, cds_t: 20, cds_r: 80, cds_p: 56, efi_t: 10, efi_r: 90, efi_p: 84, mei_t: 20, mei_r: 20, mei_p: 100, nea_t: 20, nea_r: 20, nea_p: 100, pme_t: 20, pme_r: 20, pme_p: 100 },
];

const GROUPS = ["b2i", "cds", "efi", "mei", "nea", "pme"];

// Couleur du pourcentage
function PctCell({ value }) {
  let color = "#3B6D11"; // vert
  if (value <= 60) color = "#993C1D";       // rouge
  else if (value <= 85) color = "#854F0B";  // orange
  return <span style={{ color, fontWeight: 500 }}>{value}%</span>;
}

// Génère les 3 colonnes (Traité, Reçus, %) pour un groupe
function makeGroupColumns(key) {
  return [
    {
      name: "Traité",
      selector: (row) => row[`${key}_t`],
      center: true,
      width: "65px",
    },
    {
      name: "Reçus",
      selector: (row) => row[`${key}_r`],
      center: true,
      width: "65px",
    },
    {
      name: "%",
      selector: (row) => row[`${key}_p`],
      cell: (row) => <PctCell value={row[`${key}_p`]} />,
      center: true,
      width: "60px",
      sortable: true,
    },
  ];
}

const columns = [
  {
    name: "Date",
    selector: (row) => row.date,
    sortable: true,
    width: "110px",
    style: { background: "#EEEDFE", color: "#3C3489" },
  },
  ...GROUPS.flatMap((g) => makeGroupColumns(g)),
];

// En-tête groupée sur 2 niveaux (superposée au-dessus du DataTable)
function GroupHeader() {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid #d1cff0" }}>
      {/* Colonne Date vide */}
      <div style={{ width: 110, flexShrink: 0 }} />
      {GROUPS.map((g) => (
        <div
          key={g}
          style={{
            width: 190, // 65 + 65 + 60
            flexShrink: 0,
            textAlign: "center",
            padding: "8px 0",
            background: "#EEEDFE",
            color: "#3C3489",
            fontWeight: 500,
            fontSize: 13,
            borderLeft: "1px solid #d1cff0",
          }}
        >
          {g.toUpperCase()}
        </div>
      ))}
    </div>
  );
}

const customStyles = {
  headRow: {
    style: {
      background: "#f5f5f3",
      borderTop: "none",
      minHeight: "34px",
    },
  },
  headCells: {
    style: {
      fontSize: 12,
      color: "#888780",
      fontWeight: 400,
      paddingLeft: 8,
      paddingRight: 8,
      borderLeft: "0.5px solid #e0dfd8",
      justifyContent: "center",
    },
  },
  rows: {
    style: {
      fontSize: 13,
      minHeight: "40px",
      borderBottom: "0.5px solid #e0dfd8",
    },
    highlightOnHoverStyle: {
      background: "#EEEDFE22",
    },
  },
  cells: {
    style: {
      borderLeft: "0.5px solid #e0dfd8",
      paddingLeft: 8,
      paddingRight: 8,
    },
  },
};

export default function GroupedDataTable() {
  const [data] = useState(initialData);

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        border: "0.5px solid #d1cff0",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {/* En-tête groupée niveau 1 */}
      <GroupHeader />

      {/* DataTable avec les sous-colonnes niveau 2 */}
      <DataTable
        columns={columns}
        data={data}
        customStyles={customStyles}
        noTableHead={false}
        dense
        noDataComponent="Aucune donnée"
      />
    </div>
  );
}
