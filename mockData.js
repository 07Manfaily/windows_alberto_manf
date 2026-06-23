// Données de démonstration. À remplacer par tes appels API (useAxios).

export const statsCards = [
  { id: "total", label: "Demandes", value: 150, variant: "neutral" },
  { id: "traitees", label: "Demandes traitées", value: 150, variant: "success" },
  { id: "non_traitees", label: "Demandes non traitées", value: 50, variant: "danger" },
];

// Données du graphique (par mois) : travail = violet, conge = vert
export const chartData = [
  { mois: "Jan", travail: 100, conge: 0 },
  { mois: "Fev", travail: 100, conge: 150 },
  { mois: "Mar", travail: 50, conge: 100 },
  { mois: "Avr", travail: 100, conge: 100 },
  { mois: "Mai", travail: 100, conge: 300 },
  { mois: "Jui", travail: 100, conge: 200 },
  { mois: "Juil", travail: 100, conge: 100 },
  { mois: "Aout", travail: 100, conge: 200 },
  { mois: "Sept", travail: 100, conge: 150 },
  { mois: "Oct", travail: 100, conge: 200 },
  { mois: "Nov", travail: 200, conge: 100 },
  { mois: "Dec", travail: 100, conge: 100 },
];

export const demandesTable = [
  { date: "21/05/2026", matricule: "4758", nom: "Kacou", prenoms: "Jean Jacques", document: "Att. congé", statut: "Validé" },
  { date: "21/05/2026", matricule: "4520", nom: "Koné", prenoms: "Mamadou", document: "Att. travail", statut: "En cours" },
];

// statut : "valide" | "refuse" | "attente"
// type   : "travail" | "conge"
export const demandes = [
  { id: 1, matricule: "5852", nom: "Kouakou Marcelle", type: "travail", statut: "valide" },
  { id: 2, matricule: "5852", nom: "Kouakou Marcelle", type: "travail", statut: "refuse" },
  { id: 3, matricule: "5852", nom: "Kouakou Marcelle", type: "travail", statut: "attente" },
  { id: 4, matricule: "5852", nom: "Traoré Ali", type: "conge", statut: "valide" },
  { id: 5, matricule: "5852", nom: "Traoré Ali", type: "conge", statut: "attente" },
];

export const documents = [
  { id: 1, type: "Note d’information", cible: "Ensemble du personnel" },
  { id: 2, type: "Décision RH", cible: "Ensemble du personnel" },
  { id: 3, type: "Décision RH", cible: "Agent", agent: "4875 / Kouamé Kacou Christian" },
];

export const offres = [
  {
    id: 1,
    titre: "Data Analyste",
    contrats: ["CDD"],
    lieu: "Hybride (Paris / Télétravail)",
    statut: "en_cours",
    description:
      "Rattaché(e) au pôle Business Intelligence, vous aurez pour mission de transformer nos données brutes en leviers de décision stratégiques.\nVous travaillerez sur l'optimisation des parcours clients et l'analyse de performance de nos campagnes marketing.",
    missions: [
      "Collecter, nettoyer et structurer les données provenant de diverses sources (SQL, APIs).",
      "Concevoir et maintenir des tableaux de bord interactifs (Tableau, Power BI).",
      "Réaliser des analyses exploratoires pour identifier les tendances et les points de friction.",
      "Collaborer avec les équipes produits pour définir les KPI clés.",
    ],
    profil: [
      "Formation Bac+5 en Statistiques, Informatique ou Mathématiques Décisionnelles.",
      "Maîtrise indispensable de SQL et Python (Pandas, Numpy).",
      "Capacité à vulgariser des données complexes auprès de profils non techniques.",
    ],
  },
  {
    id: 2,
    titre: "Data ingénieur",
    contrats: ["CDI", "Interim"],
    lieu: "Abidjan",
    statut: "en_cours",
    description:
      "Vous concevez et maintenez les pipelines de données de l'entreprise.",
    missions: ["Construire les pipelines ETL.", "Garantir la qualité des données."],
    profil: ["Bac+5 en informatique.", "Maîtrise de Spark / Airflow."],
  },
];
