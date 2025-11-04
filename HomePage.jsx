import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleStartQuiz = (e) => {
    e.preventDefault();
    if (nom.trim() === '') {
      alert('Veuillez entrer votre nom');
      return;
    }
    
    // Stocker les informations du participant
    localStorage.setItem('participantNom', nom);
    localStorage.setItem('participantEmail', email);
    
    // Rediriger vers le quiz
    navigate('/quiz');
  };

  return (
    <div className="container">
      <div className="card">
        <h1>🎯 Quiz UX Designer</h1>
        <p style={{ fontSize: '18px', marginBottom: '30px', color: '#666' }}>
          Évaluez vos connaissances en UX Design à travers ce quiz de recrutement.
        </p>
        
        <div style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
            <h3>📋 Informations sur le quiz :</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>⏱️ Durée : 47 minutes au total</li>
              <li>❓ 20 questions sélectionnées aléatoirement</li>
              <li>🎯 Niveau : UX Designer Intermédiaire</li>
              <li>📊 QCM et QCU (choix multiples/unique)</li>
              <li>🔄 Navigation libre entre questions</li>
              <li>🎲 Questions différentes pour chaque candidat</li>
            </ul>
          </div>
          
          <form onSubmit={handleStartQuiz}>
            <div className="form-group">
              <label htmlFor="nom">Nom complet *</label>
              <input
                type="text"
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Entrez votre nom complet"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email (optionnel)</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@example.com"
              />
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button type="submit" className="btn">
                🚀 Commencer le Quiz
              </button>
            </div>
          </form>
        </div>
        
        <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <p style={{ fontSize: '14px', color: '#888' }}>
            💡 <strong>Quiz adaptatif :</strong> Les questions sont sélectionnées aléatoirement parmi un pool de 40 questions.
            Chaque candidat a un quiz unique ! Focus sur les compétences UX/UI pratiques pour profil intermédiaire.
            Vous avez 47 minutes pour naviguer librement entre les questions.
          </p>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <a href="/admin-login" className="btn btn-secondary">
          🔐 Accès Administrateur
        </a>
      </div>
    </div>
  );
};

export default HomePage;