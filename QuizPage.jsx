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
  const [timeLeft, setTimeLeft] = useState(47 * 60); // 47 minutes en secondes
  const navigate = useNavigate();

  const TOTAL_TIME_LIMIT = 47 * 60; // 47 minutes en secondes

  useEffect(() => {
    const nom = localStorage.getItem('participantNom');
    if (!nom) {
      navigate('/');
      return;
    }

    loadQuestions();
    const start = Date.now();
    setStartTime(start);

    // Timer global unique pour 47 minutes
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
    
    const quizData = {
      nom,
      email,
      reponses: answers,
      temps_total: timeElapsed
    };

    try {
      const result = await quizAPI.submitQuiz(quizData);
      localStorage.setItem('quizResult', JSON.stringify(result));
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
    if (totalMinutes > 15) return '#4CAF50'; // Vert
    if (totalMinutes > 5) return '#FF9800';  // Orange
    return '#F44336'; // Rouge
  };

  const handleAnswerChange = (questionId, optionIndex, isChecked) => {
    const question = questions[currentQuestionIndex];
    
    if (question.type === 'QCU') {
      // Question à choix unique
      setAnswers(prev => ({
        ...prev,
        [questionId]: optionIndex
      }));
      console.log('📝 QCU: Réponse sélectionnée:', optionIndex);
    } else {
      // Question à choix multiples (QCM)
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
    <div className="container">
      <div className="quiz-header">
        <h1>Quiz UX Designer</h1>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div className="timer">⏱️ Temps écoulé : {formatTime(timeElapsed)}</div>
          
          <div 
            className="timer" 
            style={{ 
              background: getTimerColor(timeLeft),
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold',
              animation: timeLeft <= 300 ? 'pulse 1s infinite' : 'none', // Pulse si moins de 5 minutes
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
        <div className="question-type">
          {currentQuestion.type === 'QCU' ? 'Choix Unique' : 'Choix Multiples'}
        </div>
        
        <h2 className="question-title">{currentQuestion.texte}</h2>
        
        <div className="options-list">
          {currentQuestion.options.map((option, index) => {
            const questionId = currentQuestion.id;
            const isSelected = currentQuestion.type === 'QCU' 
              ? answers[questionId] === index
              : (answers[questionId] || []).includes(index);

            return (
              <div key={index} className="option-item">
                <label className={`option-label ${isSelected ? 'selected' : ''}`}>
                  <input
                    type={currentQuestion.type === 'QCU' ? 'radio' : 'checkbox'}
                    name={`question-${questionId}`}
                    checked={isSelected}
                    onChange={(e) => handleAnswerChange(questionId, index, e.target.checked)}
                  />
                  {option}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation simplifiée */}
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

      {/* Navigation rapide par questions */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ fontSize: '14px', marginBottom: '10px', color: '#666' }}>
          🎯 Navigation rapide :
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px' }}>
          {questions.map((_, index) => {
            const isAnswered = answers[questions[index].id] !== undefined;
            const isCurrent = index === currentQuestionIndex;
            
            return (
              <button
                key={index}
                onClick={() => goToQuestion(index)}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '50%',
                  background: isCurrent ? '#667eea' : 
                             isAnswered ? '#4CAF50' : '#e0e0e0',
                  color: isCurrent || isAnswered ? 'white' : '#666',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  minWidth: '35px',
                  minHeight: '35px',
                  transition: 'all 0.2s ease'
                }}
                title={`Question ${index + 1} ${isAnswered ? '(répondue)' : '(non répondue)'}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Info utilisateur */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ fontSize: '14px', opacity: 0.8 }}>
          💡 Vous avez <strong>{formatTime(timeLeft)}</strong> pour terminer le quiz complet.
          Vous pouvez naviguer librement entre toutes les questions.
        </p>
      </div>

      {/* DEBUG INFO */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '20px',
        background: '#000',
        color: '#00ff00',
        padding: '10px',
        borderRadius: '10px',
        fontFamily: 'monospace',
        fontSize: '12px'
      }}>
        🔍 DEBUG: Temps restant = {formatTime(timeLeft)} | Question {currentQuestionIndex + 1}/{questions.length}
        <br/>
        📊 Réponses: {answeredQuestions}/{questions.length} | Actuelle: {JSON.stringify(answers[currentQuestion?.id] || 'aucune')}
        <br/>
        ⚡ Navigation libre activée - 47 minutes au total
      </div>
    </div>
  );
};

export default QuizPage;