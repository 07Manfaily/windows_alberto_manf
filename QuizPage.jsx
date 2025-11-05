import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(17 * 60); // 17 minutes en secondes
  const [penalties, setPenalties] = useState(0); // Nombre de pénalités
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  // États pour les popups
  const [showRulesModal, setShowRulesModal] = useState(true);
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [penaltyInfo, setPenaltyInfo] = useState({ reason: '', count: 0 });
  
  const navigate = useNavigate();

  const TOTAL_TIME_LIMIT = 17 * 60; // 17 minutes en secondes
  const PENALTY_PERCENTAGE = 10; // -10% par violation

  // Composant Modal Personnalisé
  const CustomModal = ({ isOpen, onClose, title, children, type = 'info' }) => {
    if (!isOpen) return null;

    const getModalStyle = () => {
      switch (type) {
        case 'warning':
          return {
            borderColor: '#ff9800',
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffecb3 100%)'
          };
        case 'danger':
          return {
            borderColor: '#f44336',
            background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)'
          };
        default:
          return {
            borderColor: '#2196f3',
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
          };
      }
    };

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(5px)'
      }}>
        <div style={{
          ...getModalStyle(),
          border: `3px solid`,
          borderRadius: '20px',
          padding: '30px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          animation: 'modalSlideIn 0.3s ease-out'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '2px solid rgba(0,0,0,0.1)',
            paddingBottom: '15px'
          }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: '24px',
              fontWeight: 'bold',
              color: type === 'danger' ? '#d32f2f' : type === 'warning' ? '#f57c00' : '#1976d2'
            }}>
              {title}
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '5px',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            )}
          </div>
          <div style={{ fontSize: '16px', lineHeight: '1.6' }}>
            {children}
          </div>
        </div>
      </div>
    );
  };

  // Protection anti-capture et anti-copie
  useEffect(() => {
    // Bloquer le menu contextuel
    const handleContextMenu = (e) => {
      e.preventDefault();
      showPenaltyPopup('Tentative d\'accès au menu contextuel');
      return false;
    };

    // Bloquer les raccourcis clavier dangereux
    const handleKeyDown = (e) => {
      // F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S, etc.
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.key === 'a') ||
        (e.ctrlKey && e.key === 'c') ||
        (e.key === 'PrintScreen')
      ) {
        e.preventDefault();
        showPenaltyPopup('Tentative d\'utilisation de raccourci interdit');
        return false;
      }
    };

    // Détecter les tentatives de capture d'écran
    const handleKeyUp = (e) => {
      if (e.key === 'PrintScreen') {
        showPenaltyPopup('Tentative de capture d\'écran');
      }
    };

    // Bloquer la sélection de texte
    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };

    // Bloquer le glisser-déposer
    const handleDragStart = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  // Détection des changements d'onglet/fenêtre
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false);
        console.log('🚨 ATTENTION: Utilisateur a quitté l\'onglet');
      } else {
        if (!isVisible) {
          // Retour sur l'onglet après l'avoir quitté
          setTabSwitchCount(prev => prev + 1);
          showPenaltyPopup('Changement d\'onglet/fenêtre détecté');
          setIsVisible(true);
        }
      }
    };

    const handleBlur = () => {
      console.log('🚨 Fenêtre perdue focus');
    };

    const handleFocus = () => {
      console.log('✅ Fenêtre récupérée focus');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isVisible]);

  const showPenaltyPopup = (reason) => {
    const newPenaltyCount = penalties + 1;
    setPenalties(newPenaltyCount);
    setPenaltyInfo({ reason, count: newPenaltyCount });
    setShowPenaltyModal(true);
    console.log(`🚨 PÉNALITÉ ${newPenaltyCount}: ${reason}`);
  };

  const startQuiz = () => {
    setShowRulesModal(false);
    loadQuestions();
    const start = Date.now();
    setStartTime(start);

    // Timer global pour 17 minutes
    const globalTimer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const remaining = TOTAL_TIME_LIMIT - elapsed;
      
      setTimeElapsed(elapsed);
      setTimeLeft(remaining);
      
      // Auto-soumission quand le temps est écoulé
      if (remaining <= 0) {
        console.log('⏰ Temps total écoulé - Soumission automatique');
        clearInterval(globalTimer);
        submitQuiz();
      }
    }, 1000);

    return () => clearInterval(globalTimer);
  };

  useEffect(() => {
    const nom = localStorage.getItem('participantNom');
    if (!nom) {
      navigate('/');
      return;
    }
  }, [navigate]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const questionsData = await quizAPI.getQuestions();
      console.log('📚 Questions chargées:', questionsData.length);
      setQuestions(questionsData);
      setLoading(false);
    } catch (error) {
      console.error('❌ Erreur chargement questions:', error);
      alert('Erreur lors du chargement du quiz. Veuillez réessayer.');
      navigate('/');
    }
  };

  const submitQuiz = async () => {
    console.log('📤 Soumission du quiz...');
    const nom = localStorage.getItem('participantNom');
    const email = localStorage.getItem('participantEmail') || '';
    
    // Calculer la pénalité totale
    const penaltyPercentage = penalties * PENALTY_PERCENTAGE;
    
    const quizData = {
      nom,
      email,
      reponses: answers,
      temps_total: timeElapsed,
      penalites: penalties,
      penalite_pourcentage: penaltyPercentage,
      changements_onglet: tabSwitchCount
    };

    try {
      const result = await quizAPI.submitQuiz(quizData);
      
      // Ajouter les informations de pénalité au résultat
      const finalResult = {
        ...result,
        penalites: penalties,
        penalite_pourcentage: penaltyPercentage,
        score_final: Math.max(0, result.pourcentage - penaltyPercentage)
      };
      
      localStorage.setItem('quizResult', JSON.stringify(finalResult));
      navigate('/result');
    } catch (error) {
      console.error('❌ Erreur soumission:', error);
      alert('Erreur lors de la soumission du quiz.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (timeLeft) => {
    const totalMinutes = Math.floor(timeLeft / 60);
    if (totalMinutes > 10) return '#4CAF50'; // Vert
    if (totalMinutes > 5) return '#FF9800';  // Orange
    return '#F44336'; // Rouge
  };

  const handleAnswerChange = (questionId, optionIndex, isChecked) => {
    const question = questions[currentQuestionIndex];
    
    if (question.type === 'QCU') {
      setAnswers(prev => ({
        ...prev,
        [questionId]: optionIndex
      }));
      console.log('📝 QCU: Réponse sélectionnée:', optionIndex);
    } else {
      setAnswers(prev => {
        const currentAnswers = prev[questionId] || [];
        let newAnswers;
        
        if (isChecked) {
          if (!currentAnswers.includes(optionIndex)) {
            newAnswers = [...currentAnswers, optionIndex];
          } else {
            newAnswers = currentAnswers;
          }
        } else {
          newAnswers = currentAnswers.filter(index => index !== optionIndex);
        }
        
        console.log('📝 QCM: Réponses actuelles:', newAnswers);
        
        return {
          ...prev,
          [questionId]: newAnswers
        };
      });
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      console.log('👉 Passage à la question suivante');
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      console.log('👈 Retour à la question précédente');
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (questionIndex) => {
    console.log('🎯 Navigation directe vers question', questionIndex + 1);
    setCurrentQuestionIndex(questionIndex);
  };

  // Calculer les statistiques de progression
  const answeredQuestions = Object.keys(answers).length;
  const progressPercentage = (answeredQuestions / questions.length) * 100;

  // Modal des règles
  if (showRulesModal) {
    return (
      <CustomModal
        isOpen={showRulesModal}
        title="📋 RÈGLES DE L'EXAMEN"
        type="warning"
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold', color: '#f57c00' }}>
            ⏰ <strong>Durée :</strong> 17 minutes maximum
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#d32f2f', marginBottom: '10px' }}>🚫 INTERDICTIONS STRICTES :</h3>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Captures d'écran (PrintScreen)</li>
              <li>Changement d'onglet ou de fenêtre</li>
              <li>Copie de texte (Ctrl+C)</li>
              <li>Outils développeur (F12)</li>
              <li>Aide externe de toute sorte</li>
            </ul>
          </div>

          <div style={{ marginBottom: '20px', background: '#ffcdd2', padding: '15px', borderRadius: '10px' }}>
            <h3 style={{ color: '#d32f2f', margin: '0 0 10px 0' }}>⚠️ SYSTÈME DE PÉNALITÉS :</h3>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
              Chaque violation = <span style={{ color: '#d32f2f' }}>-10% sur votre score final</span>
            </p>
          </div>

          <div style={{ marginBottom: '30px', background: '#e8f5e8', padding: '15px', borderRadius: '10px' }}>
            <h3 style={{ color: '#2e7d2e', margin: '0 0 10px 0' }}>📊 INFORMATIONS QUIZ :</h3>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>20 questions sélectionnées aléatoirement</li>
              <li>Questions à choix unique (QCU) et multiples (QCM)</li>
              <li>1 question bonus (non comptée)</li>
              <li>Navigation libre entre questions</li>
            </ul>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={startQuiz}
              style={{
                background: 'linear-gradient(135deg, #4caf50 0%, #2e7d2e 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                fontSize: '18px',
                fontWeight: 'bold',
                borderRadius: '10px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                transition: 'transform 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              🚀 J'AI LU ET J'ACCEPTE - COMMENCER L'EXAMEN
            </button>
          </div>
        </div>
      </CustomModal>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container">
        <div className="card">
          <h2>Aucune question disponible</h2>
          <button onClick={() => navigate('/')} className="btn">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div 
      className="container"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitTouchCallout: 'none',
        KhtmlUserSelect: 'none'
      }}
    >
      {/* Modal de pénalité */}
      <CustomModal
        isOpen={showPenaltyModal}
        onClose={() => setShowPenaltyModal(false)}
        title={`🚨 VIOLATION DÉTECTÉE #${penaltyInfo.count}`}
        type="danger"
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', marginBottom: '20px', color: '#d32f2f' }}>
            <strong>Raison :</strong> {penaltyInfo.reason}
          </div>
          
          <div style={{ background: '#ffcdd2', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#d32f2f' }}>
              Pénalité : -10% sur le score final
            </div>
            <div style={{ fontSize: '16px', marginTop: '5px' }}>
              Total des pénalités : -{penalties * PENALTY_PERCENTAGE}%
            </div>
          </div>

          <div style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
            ⚠️ <strong>Attention :</strong> Continuez à respecter les règles de l'examen.
          </div>

          <button
            onClick={() => setShowPenaltyModal(false)}
            style={{
              background: '#f44336',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            J'AI COMPRIS
          </button>
        </div>
      </CustomModal>

      {/* Avertissement de surveillance */}
      <div style={{
        background: '#ffebee',
        border: '2px solid #f44336',
        borderRadius: '10px',
        padding: '10px',
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#d32f2f'
      }}>
        🔒 EXAMEN SURVEILLÉ | Violations: {penalties} | Pénalités: -{penalties * PENALTY_PERCENTAGE}%
      </div>

      <div className="quiz-header">
        <h1 style={{ userSelect: 'none' }}>Quiz UX Designer - Niveau Intermédiaire</h1>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div className="timer">⏱️ Temps écoulé : {formatTime(timeElapsed)}</div>
          
          <div 
            className="timer" 
            style={{ 
              background: getTimerColor(timeLeft),
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold',
              animation: timeLeft <= 300 ? 'pulse 1s infinite' : 'none',
              padding: '12px 25px',
              borderRadius: '30px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            ⏰ {formatTime(timeLeft)} restantes
          </div>
        </div>

        {/* Indicateur de progression */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '15px',
          padding: '8px 15px',
          borderRadius: '20px',
          background: '#e3f2fd',
          color: '#1976d2',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          📊 Progression : {answeredQuestions} / {questions.length} questions répondues ({Math.round(progressPercentage)}%)
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        
        <p>Question {currentQuestionIndex + 1} sur {questions.length}</p>
      </div>

      <div className="question-card">
        {/* Indicateur question bonus */}
        {currentQuestion.categorie === 'Bonus Data' && (
          <div style={{
            background: '#e8f5e8',
            border: '2px solid #4caf50',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '15px',
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#2e7d2e'
          }}>
            🎁 QUESTION BONUS - Non comptée dans le score
          </div>
        )}

        {/* Indicateur question sélective data */}
        {currentQuestion.categorie === 'Selective Data' && (
          <div style={{
            background: '#e1f5fe',
            border: '2px solid #0288d1',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '15px',
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#0277bd'
          }}>
            🔍 QUESTION SÉLECTIVE DATA - Évaluation qualitative
          </div>
        )}

        <div className="question-type">
          {currentQuestion.type === 'QCU' ? 'Choix Unique' : 'Choix Multiples'}
          {currentQuestion.piege && (
            <span style={{ marginLeft: '10px', color: '#ff5722', fontSize: '12px' }}>
              ⚠️ Attention
            </span>
          )}
        </div>
        
        <h2 className="question-title" style={{ userSelect: 'none' }}>
          {currentQuestion.texte}
        </h2>
        
        <div className="options-list">
          {currentQuestion.options.map((option, index) => {
            const questionId = currentQuestion.id;
            const isSelected = currentQuestion.type === 'QCU' 
              ? answers[questionId] === index
              : (answers[questionId] || []).includes(index);

            return (
              <div key={index} className="option-item">
                <label className={`option-label ${isSelected ? 'selected' : ''}`} style={{ userSelect: 'none' }}>
                  <input
                    type={currentQuestion.type === 'QCU' ? 'radio' : 'checkbox'}
                    name={`question-${questionId}`}
                    checked={isSelected}
                    onChange={(e) => handleAnswerChange(questionId, index, e.target.checked)}
                  />
                  <span style={{ userSelect: 'none' }}>{option}</span>
                </label>
              </div>
            );
          })}
        </div>

        {/* Message pour questions sans bonne réponse */}
        {currentQuestion.piege && (
          <div style={{
            marginTop: '15px',
            padding: '10px',
            background: '#fff3e0',
            border: '1px solid #ff9800',
            borderRadius: '5px',
            fontSize: '14px',
            color: '#e65100'
          }}>
            💡 <strong>Indice :</strong> Réfléchissez bien. Parfois, la meilleure réponse n'est pas toujours proposée...
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        {currentQuestionIndex > 0 && (
          <button onClick={goToPreviousQuestion} className="btn btn-secondary">
            ← Précédent
          </button>
        )}
        
        {currentQuestionIndex < questions.length - 1 ? (
          <button onClick={goToNextQuestion} className="btn">
            Suivant →
          </button>
        ) : (
          <button onClick={submitQuiz} className="btn">
            🏁 Terminer le Quiz
          </button>
        )}
      </div>

      {/* Navigation rapide */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ fontSize: '14px', marginBottom: '10px', color: '#666' }}>
          🎯 Navigation rapide :
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px' }}>
          {questions.map((question, index) => {
            const isAnswered = answers[questions[index].id] !== undefined;
            const isCurrent = index === currentQuestionIndex;
            const isBonus = question.categorie === 'Bonus Data';
            const isSelective = question.categorie === 'Selective Data';
            
            return (
              <button
                key={index}
                onClick={() => goToQuestion(index)}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '50%',
                  background: isCurrent ? '#667eea' : 
                             isBonus ? '#ff9800' :
                             isSelective ? '#0288d1' :
                             isAnswered ? '#4CAF50' : '#e0e0e0',
                  color: isCurrent || isAnswered || isBonus || isSelective ? 'white' : '#666',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  minWidth: '35px',
                  minHeight: '35px',
                  transition: 'all 0.2s ease'
                }}
                title={`Question ${index + 1} ${isBonus ? '(Bonus)' : isSelective ? '(Sélective)' : ''} ${isAnswered ? '(répondue)' : '(non répondue)'}`}
              >
                {index + 1}
                {isBonus && '🎁'}
                {isSelective && '🔍'}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Info surveillance */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ fontSize: '14px', opacity: 0.8 }}>
          🔒 <strong>Examen surveillé</strong> - Temps restant: <strong>{formatTime(timeLeft)}</strong>
          <br />
          ⚠️ Violations détectées: {penalties} | Changements d'onglet: {tabSwitchCount}
        </p>
      </div>

      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default QuizPage;