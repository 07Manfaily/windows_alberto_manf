// À ajouter avec les autres states
const [filteredApiData, setFilteredApiData] = useState(null); // NOUVEAU: données filtrées

// NOUVEAU: Effect pour filtrer les données selon le participant sélectionné
useEffect(() => {
  if (!apiData) {
    setFilteredApiData(null);
    return;
  }

  let newFilteredData = { ...apiData };

  // Si un participant est sélectionné, filtrer les données
  if (filters.username && apiData.data) {
    const filteredParticipants = apiData.data.filter(
      (item) =>
        item.full_name === filters.username.name ||
        item.matricule === filters.username.matricule
    );
    
    newFilteredData = {
      ...apiData,
      data: filteredParticipants
    };
  }

  setFilteredApiData(newFilteredData);
}, [apiData, filters.username]);

// MODIFIÉ: Utiliser filteredApiData au lieu d'apiData
useEffect(() => { 
  if (filteredApiData?.quiz) { 
    const timer = setTimeout(() => { 
      const newChartKeys = {}; 
      Object.keys(filteredApiData.quiz).forEach((question, index) => { 
        newChartKeys[index] = Date.now() + Math.random(); 
      }); 
      setChartKeys(newChartKeys); 
    }, 100); 
    return () => clearTimeout(timer); 
  } 
}, [filteredApiData]); // CHANGÉ: filteredApiData au lieu d'apiData

useEffect(() => { 
  if (filteredApiData?.prepared_text_for_word_cloud) { 
    const timer = setTimeout(() => { 
      setWordCloudKey((prev) => prev + 1); 
    }, 200); 
    return () => clearTimeout(timer); 
  } 
}, [filteredApiData]); // CHANGÉ: filteredApiData au lieu d'apiData

// MODIFIÉ: Utiliser filteredApiData
const calculateAverageScore = () => {
  if (!filteredApiData?.data || filteredApiData.data.length === 0) return "4.6";
  
  const average =
    filteredApiData.data.reduce((sum, item) => sum + (item.score || 0), 0) /
    filteredApiData.data.length;
  return average.toFixed(1);
};


// MODIFIÉ: Utiliser filteredApiData avec vérifications renforcées
const getTotalByAnswerType = (answerType) => {
  if (!filteredApiData?.quiz) return 0;

  let total = 0;
  Object.values(filteredApiData.quiz).forEach((questionData) => {
    if (questionData && questionData[answerType]) { // AJOUTÉ: vérification questionData
      total += questionData[answerType];
    }
  });
  return total;
};

// MODIFIÉ: Vérification et utilisation de filteredApiData
const ModernWordCloud = () => { 
  const [wordCloudError, setWordCloudError] = useState(false); 
  const [isVisible, setIsVisible] = useState(false); 
  const containerRef = useRef(null); 

  // ... useEffect inchangé ...

  // MODIFIÉ: Utiliser filteredApiData avec vérifications renforcées
  if (!filteredApiData?.prepared_text_for_word_cloud) {
    return (
      <div ref={containerRef} /* styles inchangés */>
        <h3>💭 Commentaires et Suggestions</h3>
        <div>Aucun commentaire disponible</div>
      </div>
    );
  }

  // MODIFIÉ: Traitement sécurisé du texte
  let words = [];
  try {
    if (typeof filteredApiData.prepared_text_for_word_cloud === 'string' && 
        filteredApiData.prepared_text_for_word_cloud.trim()) {
      words = filteredApiData.prepared_text_for_word_cloud 
        .split(" ") 
        .filter((word) => word && word.length > 2) 
        .map((word, index) => ({ 
          text: word, 
          value: 30 + (index % 3) * 10,
        }));
    }
  } catch (error) {
    console.error("Erreur lors du traitement du texte pour le word cloud:", error);
    setWordCloudError(true);
    return null;
  }

  // ... reste du composant inchangé ...
};


// MODIFIÉ: Utiliser filteredApiData pour le comptage
const getFilteredData = () => {
  if (!filteredApiData?.data) return [];
  return filteredApiData.data;
};

const filteredDataCount = getFilteredData();
const participantCount = filteredDataCount.length;
const totalParticipants = apiData?.data ? apiData.data.length : 0;



// MODIFIÉ: Affichage du participant sélectionné dans l'en-tête
<p style={{ /* styles existants */ }}>
  Tableau de bord interactif des formations
  {filters.sessions && (
    <span style={{ display: "block", fontSize: "14px", marginTop: "8px", color: "#3b82f6" }}>
      🎯 Session: {filters.sessions.code_session}
    </span>
  )}
  {/* NOUVEAU: Affichage du participant sélectionné */}
  {filters.username && (
    <span style={{ display: "block", fontSize: "14px", marginTop: "4px", color: "#10b981" }}>
      👤 Participant: {filters.username.name}
    </span>
  )}
</p>

// MODIFIÉ: Utiliser filteredApiData dans les conditions d'affichage
{filteredApiData?.quiz && (
  <div /* Légende */>
    {(() => {
      const allAnswers = new Set();
      Object.values(filteredApiData.quiz).forEach((questionData) => {
        if (questionData) { // AJOUTÉ: vérification
          Object.keys(questionData).forEach((answer) =>
            allAnswers.add(answer)
          );
        }
      });
      // ... reste inchangé ...
    })()}
  </div>
)}

// MODIFIÉ: Graphiques avec filteredApiData
{filteredApiData?.quiz && (
  <div /* Grille des graphiques */>
    {Object.entries(filteredApiData.quiz).map(
      ([question, answers], index) => (
        <ApexPieChart
          key={`${index}-${JSON.stringify(answers)}-${filters.username?.name || 'all'}`} // MODIFIÉ: key plus unique
          title={question}
          data={answers}
          color={["#10b981","#3b82f6","#8b5cf6", "#f59e0b", "#ef4444","#06b6d4",][index % 6]}
          chartKey={chartKeys[index] || 0}
        />
      )
    )}
  </div>
)}

// MODIFIÉ: Word Cloud avec filteredApiData
{filteredApiData?.prepared_text_for_word_cloud && <ModernWordCloud />}

// MODIFIÉ: Message si pas de données filtrées
{!filteredApiData && !loading && (
  <div /* Message aucune donnée */>
    <div>📊</div>
    <div>Aucune donnée disponible</div>
    <div>{filters.sessions ? "Aucune évaluation trouvée pour cette session." : "Aucune évaluation trouvée pour cette formation."}</div>
  </div>
)}



// MODIFIÉ: Au début du composant ApexPieChart
const ApexPieChart = ({ title, data, color = "#475569", chartKey = 0 }) => { 
  // AJOUTÉ: Vérification de sécurité pour data
  const safeData = data || {};
  const total = Object.values(safeData).reduce((sum, val) => sum + (val || 0), 0); 

  // MODIFIÉ: Vérifications dans le titre
  <h3 title={title}>
    {title && title.length <= 25 ? title : (title ? title.substring(0, 25) + "..." : "Question")} 
  </h3>

  // MODIFIÉ: Dans la légende en bas
  {Object.entries(safeData).map(([label, value], index) => {
    return (
      <span>{value || 0} {label || "Réponse"}</span> // AJOUTÉ: valeurs par défaut
    );
  })}
};