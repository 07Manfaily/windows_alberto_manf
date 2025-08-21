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








const ModernWordCloud = () => { 
  const [wordCloudError, setWordCloudError] = useState(false); 
  const [isVisible, setIsVisible] = useState(false); 
  const containerRef = useRef(null); 

  // ✅ AJOUT: Vérification précoce pour éviter les erreurs
  if (!filteredApiData || !filteredApiData.prepared_text_for_word_cloud) {
    return (
      <div
        ref={containerRef}
        style={{
          background: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 12px 48px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          minHeight: "320px",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
          color: "#64748b"
        }}
      >
        <h3 style={{ margin: "0 0 28px 0", fontSize: "20px", fontWeight: "700", color: "#1e293b" }}>
          💭 Commentaires et Suggestions
        </h3>
        <div>Aucun commentaire disponible</div>
      </div>
    );
  }

  // ✅ AJOUT: useEffect avec vérification robuste
  useEffect(() => { 
    const container = containerRef.current; 
    if (!container) return; 

    let observer;
    try {
      observer = new IntersectionObserver( 
        ([entry]) => { 
          if (entry && entry.isIntersecting) { 
            setIsVisible(true); 
            observer.disconnect(); 
          } 
        }, 
        { threshold: 0.1 } 
      ); 

      observer.observe(container); 
    } catch (error) {
      console.error("Erreur IntersectionObserver:", error);
      setIsVisible(true); // Fallback: afficher directement
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  // ✅ CORRECTION: Traitement ultra-sécurisé du texte
  let words = [];
  try {
    const textData = filteredApiData.prepared_text_for_word_cloud;
    if (textData && typeof textData === 'string' && textData.trim().length > 0) {
      words = textData
        .trim()
        .split(/\s+/) // Utilise une regex pour gérer tous types d'espaces
        .filter((word) => word && word.length > 2)
        .slice(0, 50) // Limite le nombre de mots pour éviter les problèmes de performance
        .map((word, index) => ({ 
          text: word.toLowerCase(), // Normalise le texte
          value: Math.max(20, 50 - index), // Valeurs décroissantes
        }));
    }
  } catch (error) {
    console.error("Erreur traitement texte WordCloud:", error);
    setWordCloudError(true);
  }

  // Si aucun mot valide
  if (words.length === 0) {
    return (
      <div ref={containerRef} /* styles identiques au return du début */>
        <h3>💭 Commentaires et Suggestions</h3>
        <div>Aucun commentaire analysable</div>
      </div>
    );
  }

  const WordCloudWrapper = () => { 
  if (!isVisible || wordCloudError) return null; 

  try { 
    return ( 
      <div 
        key={`wordcloud-${wordCloudKey}-${words.length}`} // ✅ Key plus stable
        style={{ 
          width: "100%", 
          height: "100%", 
          position: "relative", 
        }} 
      > 
        <ReactWordcloud 
          words={words} 
          options={{
            colors: ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"], 
            enableTooltip: false, 
            deterministic: true, 
            fontFamily: "Inter, sans-serif", 
            fontSizes: [16, 32], // ✅ Tailles réduites pour éviter les débordements
            fontStyle: "normal", 
            fontWeight: "normal", 
            padding: 2, 
            rotations: 1, // ✅ Réduit les rotations
            rotationAngles: [0], 
            scale: "linear", 
            spiral: "archimedean", 
            transitionDuration: 0, 
            enableOptimizations: true,
          }} 
        /> 
      </div> 
    ); 
  } catch (error) { 
    console.error("Erreur rendu WordCloud:", error);
    setWordCloudError(true); 
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "#64748b",
        fontSize: "14px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }}>
          🔧
        </div>
        <div>Visualisation temporairement indisponible</div>
        <div style={{ fontSize: "12px", marginTop: "8px", opacity: 0.7 }}>
          Mots: {words.slice(0, 5).map(w => w.text).join(", ")}...
        </div>
      </div>
    );
  } 
};

// ✅ NOUVEAU: Composant Error Boundary à ajouter au début de votre fichier
class WordCloudErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('WordCloud Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          padding: "32px",
          textAlign: "center",
          color: "#64748b"
        }}>
          <h3>💭 Commentaires et Suggestions</h3>
          <div>Erreur lors du chargement des commentaires</div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ✅ MODIFIÉ: Dans votre rendu principal, wrappez le WordCloud
{filteredApiData?.prepared_text_for_word_cloud && (
  <WordCloudErrorBoundary>
    <ModernWordCloud />
  </WordCloudErrorBoundary>
)}


// ✅ MODIFIÉ: useEffect pour le wordCloudKey avec protection
useEffect(() => { 
  if (filteredApiData?.prepared_text_for_word_cloud && 
      typeof filteredApiData.prepared_text_for_word_cloud === 'string') { 
    const timer = setTimeout(() => { 
      setWordCloudKey((prev) => prev + 1); 
    }, 300); // ✅ Délai augmenté pour laisser le temps au composant
    return () => clearTimeout(timer); 
  } 
}, [filteredApiData?.prepared_text_for_word_cloud]); // ✅ Dépendance plus spécifique


// ✅ ALTERNATIVE: Si les erreurs persistent, utilisez cette version simplifiée
const SimpleWordDisplay = () => {
  if (!filteredApiData?.prepared_text_for_word_cloud) return null;

  const words = filteredApiData.prepared_text_for_word_cloud
    .split(' ')
    .filter(word => word.length > 2)
    .slice(0, 20);

  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.6)",
      backdropFilter: "blur(20px)",
      borderRadius: "24px",
      padding: "32px",
      textAlign: "center"
    }}>
      <h3>💭 Commentaires et Suggestions</h3>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        justifyContent: "center",
        marginTop: "20px"
      }}>
        {words.map((word, index) => (
          <span key={index} style={{
            background: "#f1f5f9",
            padding: "4px 12px",
            borderRadius: "16px",
            fontSize: `${Math.max(12, 20 - index)}px`,
            color: ["#10b981", "#3b82f6", "#8b5cf6"][index % 3]
          }}>
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};
