# Portail RH — Reproduction des écrans (React JS)

Reproduction fidèle des 8 maquettes : Tableau de bord, Demandes, Attestations
(Travail / Congé), Ajout de documents et Offres d'emploi (liste, création, détail).

## Structure (divs + className, CSS séparé)

```
src/
├── App.jsx                 # routage par état (switch de page)
├── index.css               # variables, reset, layout + barre de filtres
├── components/
│   ├── Sidebar.jsx/.css     # navigation latérale
│   ├── FilterBar.jsx        # Date du jour + Trier + Hier/Semaine/Mois
│   ├── DemandeItem.jsx/.css # ligne de demande réutilisable
│   └── Icons.jsx            # icônes SVG inline (zéro dépendance)
├── pages/
│   ├── TableauDeBord.jsx/.css   # cartes + graphique + tableau
│   ├── Demandes.jsx/.css
│   ├── AttestationListe.jsx/.css # Travail & Congé (prop type)
│   ├── AjoutDocuments.jsx/.css
│   ├── OffreEmplois.jsx/.css     # liste + intègre Créer / Détail
│   ├── CreerOffre.jsx
│   └── DetailOffre.jsx
└── data/mockData.js        # données mockées (à remplacer par tes appels API)
```

## Lancer

```bash
npm install
npm run dev
```

## Notes
- Chaque composant a son fichier CSS dédié (className uniquement, pas d'inline style).
- Le graphique est en CSS pur (divs empilées), data-driven via `chartData`.
- Aucune librairie d'icônes : tout est en SVG inline dans `Icons.jsx`.
- Pour brancher tes données : remplace les imports de `data/mockData.js` par
  ton hook `useAxios` (API interne).
