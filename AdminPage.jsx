import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';

const AdminPage = () => {
  const [participants, setParticipants] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'authentification admin
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      navigate('/admin-login');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [participantsData, statsData] = await Promise.all([
        quizAPI.admin.getParticipants(),
        quizAPI.admin.getStats()
      ]);
      
      setParticipants(participantsData);
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      alert('Erreur lors du chargement des données admin');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#4caf50';
    if (percentage >= 65) return '#ff9800';
    return '#f44336';
  };

  const getPenaltyBadge = (penalties) => {
    if (penalties === 0) return { color: '#4caf50', text: 'Aucune', icon: '✅' };
    if (penalties <= 2) return { color: '#ff9800', text: `${penalties}`, icon: '⚠️' };
    return { color: '#f44336', text: `${penalties}`, icon: '🚨' };
  };

  const getTabSwitchBadge = (switches) => {
    if (switches === 0) return { color: '#4caf50', text: '0', icon: '✅' };
    if (switches <= 2) return { color: '#ff9800', text: `${switches}`, icon: '⚠️' };
    return { color: '#f44336', text: `${switches}`, icon: '🚨' };
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '50px' }}>
        <h2>🔄 Chargement des données administrateur...</h2>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '50px' }}>
        <h2>❌ Erreur de chargement des statistiques</h2>
        <button onClick={loadData} className="btn">Réessayer</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Admin */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '15px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>
          🔐 Administration Quiz UX Surveillé
        </h1>
        <p style={{ margin: '0', fontSize: '16px', opacity: 0.9 }}>
          Tableau de bord complet avec surveillance anti-triche
        </p>
        <button 
          onClick={handleLogout}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '8px 15px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🚪 Déconnexion
        </button>
      </div>

      {/* Statistiques Globales */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '15px',
          textAlign: 'center',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>👥 Total Candidats</h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>
            {stats.total_participants || 0}
          </p>
        </div>

        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '15px',
          textAlign: 'center',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>📊 Score Moyen</h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>
            {stats.score_moyen ? `${stats.score_moyen.toFixed(1)}%` : '0%'}
          </p>
        </div>

        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '15px',
          textAlign: 'center',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>🏆 Meilleur Score</h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>
            {stats.meilleur_score ? `${stats.meilleur_score}%` : '0%'}
          </p>
        </div>

        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '15px',
          textAlign: 'center',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>✅ Taux Réussite</h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>
            {stats.taux_reussite ? `${stats.taux_reussite}%` : '0%'}
          </p>
        </div>
      </div>

      {/* Tableau des Participants avec Surveillance Détaillée */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          padding: '25px',
          borderBottom: '2px solid #dee2e6'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#333' }}>
            🔒 Candidats Surveillés ({participants.length})
          </h2>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
            Surveillance anti-triche en temps réel avec compteurs détaillés
          </p>
        </div>

        {participants.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#999' }}>
            <h3>📭 Aucun candidat enregistré</h3>
            <p>Les candidats qui passent le quiz apparaîtront ici avec leurs métriques de surveillance.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '20px 15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>
                    👤 Candidat
                  </th>
                  <th style={{ padding: '20px 15px', textAlign: 'center', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>
                    📊 Score Final
                  </th>
                  <th style={{ padding: '20px 15px', textAlign: 'center', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>
                    ⏱️ Temps
                  </th>
                  <th style={{ padding: '20px 15px', textAlign: 'center', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>
                    🚨 Nb Pénalités
                  </th>
                  <th style={{ padding: '20px 15px', textAlign: 'center', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>
                    💥 % Déduit
                  </th>
                  <th style={{ padding: '20px 15px', textAlign: 'center', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>
                    🔄 Changements Onglet
                  </th>
                  <th style={{ padding: '20px 15px', textAlign: 'center', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>
                    📅 Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant, index) => {
                  const penaltyBadge = getPenaltyBadge(participant.penalites || 0);
                  const tabBadge = getTabSwitchBadge(participant.changements_onglet || 0);
                  const scoreBase = participant.score_max > 0 ? ((participant.score / participant.score_max) * 100) : 0;
                  
                  return (
                    <tr 
                      key={participant.id}
                      style={{ 
                        borderBottom: '1px solid #dee2e6',
                        background: index % 2 === 0 ? 'white' : '#f8f9fa',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.closest('tr').style.background = '#e3f2fd'}
                      onMouseLeave={(e) => e.target.closest('tr').style.background = index % 2 === 0 ? 'white' : '#f8f9fa'}
                    >
                      {/* Candidat */}
                      <td style={{ padding: '20px 15px' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#333', fontSize: '16px' }}>
                            {participant.nom}
                          </div>
                          {participant.email && (
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
                              📧 {participant.email}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Score */}
                      <td style={{ padding: '20px 15px', textAlign: 'center' }}>
                        <div style={{
                          display: 'inline-block',
                          padding: '10px 15px',
                          borderRadius: '25px',
                          background: getScoreColor(participant.pourcentage),
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}>
                          {participant.pourcentage.toFixed(1)}%
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                          {participant.score}/{participant.score_max} bonnes réponses
                        </div>
                        {participant.penalite_pourcentage > 0 && (
                          <div style={{ fontSize: '11px', color: '#f44336', marginTop: '3px' }}>
                            (Score base: {scoreBase.toFixed(1)}%)
                          </div>
                        )}
                      </td>

                      {/* Temps */}
                      <td style={{ padding: '20px 15px', textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                          {formatTime(participant.temps_total)}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          sur 17:00
                        </div>
                      </td>

                      {/* Nombre de Pénalités */}
                      <td style={{ padding: '20px 15px', textAlign: 'center' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '8px 12px',
                          borderRadius: '20px',
                          background: penaltyBadge.color,
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          minWidth: '50px'
                        }}>
                          {penaltyBadge.icon} {penaltyBadge.text}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
                          {participant.penalites === 0 ? 'violations' : 
                           participant.penalites === 1 ? 'violation' : 'violations'}
                        </div>
                      </td>

                      {/* Pourcentage Déduit */}
                      <td style={{ padding: '20px 15px', textAlign: 'center' }}>
                        <div style={{ 
                          color: participant.penalite_pourcentage > 0 ? '#f44336' : '#4caf50',
                          fontWeight: 'bold',
                          fontSize: '18px'
                        }}>
                          -{participant.penalite_pourcentage || 0}%
                        </div>
                        <div style={{ fontSize: '11px', color: '#666', marginTop: '3px' }}>
                          {participant.penalites > 0 ? 
                            `${participant.penalites} × 10%` : 'aucune pénalité'}
                        </div>
                      </td>

                      {/* Changements d'Onglet */}
                      <td style={{ padding: '20px 15px', textAlign: 'center' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '8px 12px',
                          borderRadius: '20px',
                          background: tabBadge.color,
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          minWidth: '50px'
                        }}>
                          {tabBadge.icon} {tabBadge.text}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
                          {participant.changements_onglet === 0 ? 'changements' :
                           participant.changements_onglet === 1 ? 'changement' : 'changements'}
                        </div>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '20px 15px', textAlign: 'center' }}>
                        <div style={{ fontSize: '13px', fontWeight: '500' }}>
                          {formatDate(participant.date_creation).split(' ')[0]}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {formatDate(participant.date_creation).split(' ')[1]}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Légende détaillée */}
      <div style={{
        marginTop: '25px',
        padding: '25px',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        borderRadius: '12px',
        border: '1px solid #dee2e6'
      }}>
        <h4 style={{ color: '#333', marginBottom: '20px', fontSize: '18px' }}>
          🔍 Légende du Système de Surveillance Anti-Triche
        </h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '15px',
          fontSize: '14px'
        }}>
          <div style={{ padding: '10px', background: 'white', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <strong>🚨 Nb Pénalités :</strong> Nombre total de violations détectées (captures d'écran, raccourcis interdits, etc.)
          </div>
          <div style={{ padding: '10px', background: 'white', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <strong>💥 % Déduit :</strong> Pourcentage soustrait du score final (10% par violation)
          </div>
          <div style={{ padding: '10px', background: 'white', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <strong>🔄 Changements Onglet :</strong> Nombre de fois où le candidat a changé d'onglet/fenêtre
          </div>
          <div style={{ padding: '10px', background: 'white', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <strong>📊 Score Final :</strong> Score après déduction des pénalités (affiché avec score de base si différent)
          </div>
        </div>
        
        {/* Codes couleur */}
        <div style={{ marginTop: '20px', fontSize: '13px' }}>
          <strong>🎨 Codes Couleur :</strong>
          <span style={{ marginLeft: '15px', color: '#4caf50' }}>✅ Vert = Aucune violation</span>
          <span style={{ marginLeft: '15px', color: '#ff9800' }}>⚠️ Orange = 1-2 violations</span>
          <span style={{ marginLeft: '15px', color: '#f44336' }}>🚨 Rouge = 3+ violations</span>
        </div>
      </div>

      {/* Actions Admin */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '20px',
        marginTop: '30px',
        marginBottom: '30px'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          🏠 Retour à l'accueil
        </button>
        
        <button
          onClick={loadData}
          style={{
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(67, 233, 123, 0.3)',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          🔄 Actualiser les données
        </button>
      </div>
    </div>
  );
};

export default AdminPage;