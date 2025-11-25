import React, { useState } from 'react';

const FormationDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('2025-08');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les données
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://192.168.115.90:28/api/generation/formation-stat/${selectedMonth}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Données mock pour la démo
  const mockData = {
    formation_presence: [
      {
        code_formation: "P25001",
        title: "IA Générative",
        num_effective_participate: 0,
        num_no_participate: 0
      },
      {
        code_formation: "P25003",
        title: "Changement climatique",
        num_effective_participate: 0,
        num_no_participate: 0
      },
      {
        code_formation: "P25005",
        title: "Gestion de projet Agile",
        num_effective_participate: 15,
        num_no_participate: 3
      },
      {
        code_formation: "P25007",
        title: "Leadership et management",
        num_effective_participate: 22,
        num_no_participate: 1
      },
      {
        code_formation: "P25009",
        title: "Communication efficace",
        num_effective_participate: 18,
        num_no_participate: 2
      }
    ],
    repartition_new_formation: [
      {
        diffusion_mode: "Interne",
        internal_external: "Interne",
        num: 1,
        ogf: "Accompagner le développement personnel et l'efficacité professionnelle"
      },
      {
        diffusion_mode: "Interne",
        internal_external: "Formation",
        num: 1,
        ogf: "Acquérir et développer les compétences métier"
      },
      {
        diffusion_mode: "Externe",
        internal_external: "Externe",
        num: 3,
        ogf: "Développer les compétences techniques et digitales"
      },
      {
        diffusion_mode: "Mixte",
        internal_external: "Formation",
        num: 2,
        ogf: "Renforcer les capacités managériales"
      }
    ]
  };

  const displayData = data || mockData;

  // Calcul des statistiques
  const totalFormations = displayData.formation_presence.length;
  const totalParticipants = displayData.formation_presence.reduce((sum, f) => sum + f.num_effective_participate, 0);
  const totalNonParticipants = displayData.formation_presence.reduce((sum, f) => sum + f.num_no_participate, 0);
  const totalNouvelles = displayData.repartition_new_formation.reduce((sum, f) => sum + f.num, 0);
  const tauxParticipation = totalParticipants + totalNonParticipants > 0 
    ? ((totalParticipants / (totalParticipants + totalNonParticipants)) * 100).toFixed(1)
    : 0;

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '36px', 
            fontWeight: '700',
            marginBottom: '10px',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            📊 Tableau de Bord Formations
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
            Suivi et analyse des formations en temps réel
          </p>
        </div>

        {/* Sélecteur de mois */}
        <div style={{ 
          marginBottom: '30px', 
          padding: '25px', 
          backgroundColor: 'white', 
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: '1', minWidth: '250px' }}>
            <span style={{ fontSize: '24px' }}>📅</span>
            <div style={{ flex: '1' }}>
              <label style={{ 
                display: 'block',
                fontWeight: '600', 
                color: '#333',
                marginBottom: '8px',
                fontSize: '14px'
              }}>
                Période d'analyse
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  fontSize: '16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
              />
            </div>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            style={{
              padding: '12px 35px',
              fontSize: '16px',
              fontWeight: '600',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              minWidth: '150px'
            }}
          >
            {loading ? '⏳ Chargement...' : '🔍 Analyser'}
          </button>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div style={{
            padding: '20px',
            marginBottom: '30px',
            backgroundColor: '#fff',
            border: '2px solid #ff6b6b',
            borderRadius: '15px',
            color: '#c92a2a',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.2)'
          }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <span style={{ fontSize: '16px', fontWeight: '500' }}>{error}</span>
          </div>
        )}

        {/* KPIs Cards */}
        {displayData && (
          <>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {/* Card 1 */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '25px',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>📚</div>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '5px' }}>
                    {totalFormations}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Formations actives</div>
                </div>
                <div style={{
                  position: 'absolute',
                  right: '-20px',
                  bottom: '-20px',
                  fontSize: '120px',
                  opacity: 0.1
                }}>📚</div>
              </div>

              {/* Card 2 */}
              <div style={{
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                padding: '25px',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(17, 153, 142, 0.3)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '5px' }}>
                    {totalParticipants}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Participants</div>
                </div>
                <div style={{
                  position: 'absolute',
                  right: '-20px',
                  bottom: '-20px',
                  fontSize: '120px',
                  opacity: 0.1
                }}>✅</div>
              </div>

              {/* Card 3 */}
              <div style={{
                background: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
                padding: '25px',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(238, 9, 121, 0.3)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>❌</div>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '5px' }}>
                    {totalNonParticipants}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Absents</div>
                </div>
                <div style={{
                  position: 'absolute',
                  right: '-20px',
                  bottom: '-20px',
                  fontSize: '120px',
                  opacity: 0.1
                }}>❌</div>
              </div>

              {/* Card 4 */}
              <div style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                padding: '25px',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(240, 147, 251, 0.3)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>🆕</div>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '5px' }}>
                    {totalNouvelles}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Nouvelles formations</div>
                </div>
                <div style={{
                  position: 'absolute',
                  right: '-20px',
                  bottom: '-20px',
                  fontSize: '120px',
                  opacity: 0.1
                }}>🆕</div>
              </div>

              {/* Card 5 */}
              <div style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                padding: '25px',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(79, 172, 254, 0.3)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>📈</div>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '5px' }}>
                    {tauxParticipation}%
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Taux de participation</div>
                </div>
                <div style={{
                  position: 'absolute',
                  right: '-20px',
                  bottom: '-20px',
                  fontSize: '120px',
                  opacity: 0.1
                }}>📈</div>
              </div>
            </div>

            {/* Tables Container */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '30px'
            }}>
              {/* Formation Présence */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '30px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  marginBottom: '25px',
                  paddingBottom: '20px',
                  borderBottom: '2px solid #f0f0f0'
                }}>
                  <span style={{ fontSize: '32px' }}>👥</span>
                  <h3 style={{ 
                    fontSize: '24px', 
                    fontWeight: '700',
                    color: '#333',
                    margin: 0
                  }}>
                    Présence aux Formations
                  </h3>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse'
                  }}>
                    <thead>
                      <tr>
                        <th style={{ 
                          padding: '15px', 
                          textAlign: 'left',
                          backgroundColor: '#f8f9fa',
                          color: '#495057',
                          fontWeight: '600',
                          fontSize: '14px',
                          borderBottom: '2px solid #dee2e6'
                        }}>
                          CODE
                        </th>
                        <th style={{ 
                          padding: '15px', 
                          textAlign: 'left',
                          backgroundColor: '#f8f9fa',
                          color: '#495057',
                          fontWeight: '600',
                          fontSize: '14px',
                          borderBottom: '2px solid #dee2e6'
                        }}>
                          TITRE DE LA FORMATION
                        </th>
                        <th style={{ 
                          padding: '15px', 
                          textAlign: 'center',
                          backgroundColor: '#f8f9fa',
                          color: '#495057',
                          fontWeight: '600',
                          fontSize: '14px',
                          borderBottom: '2px solid #dee2e6'
                        }}>
                          PARTICIPANTS
                        </th>
                        <th style={{ 
                          padding: '15px', 
                          textAlign: 'center',
                          backgroundColor: '#f8f9fa',
                          color: '#495057',
                          fontWeight: '600',
                          fontSize: '14px',
                          borderBottom: '2px solid #dee2e6'
                        }}>
                          ABSENTS
                        </th>
                        <th style={{ 
                          padding: '15px', 
                          textAlign: 'center',
                          backgroundColor: '#f8f9fa',
                          color: '#495057',
                          fontWeight: '600',
                          fontSize: '14px',
                          borderBottom: '2px solid #dee2e6'
                        }}>
                          TAUX
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayData.formation_presence.map((formation, index) => {
                        const total = formation.num_effective_participate + formation.num_no_participate;
                        const taux = total > 0 ? ((formation.num_effective_participate / total) * 100).toFixed(0) : 0;
                        
                        return (
                          <tr key={index} style={{ 
                            borderBottom: '1px solid #f0f0f0',
                            transition: 'background-color 0.2s'
                          }}>
                            <td style={{ padding: '15px' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '6px 12px',
                                backgroundColor: '#e7f5ff',
                                color: '#1971c2',
                                borderRadius: '6px',
                                fontSize: '13px',
                                fontWeight: '600'
                              }}>
                                {formation.code_formation}
                              </span>
                            </td>
                            <td style={{ 
                              padding: '15px',
                              color: '#333',
                              fontSize: '15px'
                            }}>
                              {formation.title}
                            </td>
                            <td style={{ 
                              padding: '15px', 
                              textAlign: 'center'
                            }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                backgroundColor: '#d3f9d8',
                                color: '#2b8a3e',
                                fontWeight: 'bold',
                                fontSize: '16px'
                              }}>
                                {formation.num_effective_participate}
                              </span>
                            </td>
                            <td style={{ 
                              padding: '15px', 
                              textAlign: 'center'
                            }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                backgroundColor: '#ffe3e3',
                                color: '#c92a2a',
                                fontWeight: 'bold',
                                fontSize: '16px'
                              }}>
                                {formation.num_no_participate}
                              </span>
                            </td>
                            <td style={{ 
                              padding: '15px', 
                              textAlign: 'center'
                            }}>
                              <div style={{
                                display: 'inline-block',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                backgroundColor: taux >= 80 ? '#d3f9d8' : taux >= 50 ? '#fff3bf' : '#ffe3e3',
                                color: taux >= 80 ? '#2b8a3e' : taux >= 50 ? '#e67700' : '#c92a2a',
                                fontWeight: 'bold',
                                fontSize: '14px'
                              }}>
                                {taux}%
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Répartition Nouvelles Formations */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '30px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  marginBottom: '25px',
                  paddingBottom: '20px',
                  borderBottom: '2px solid #f0f0f0'
                }}>
                  <span style={{ fontSize: '32px' }}>🎯</span>
                  <h3 style={{ 
                    fontSize: '24px', 
                    fontWeight: '700',
                    color: '#333',
                    margin: 0
                  }}>
                    Répartition Nouvelles Formations
                  </h3>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse'
                  }}>
                    <thead>
                      <tr>
                        <th style={{ 
                          padding: '15px', 
                          textAlign: 'left',
                          backgroundColor: '#f8f9fa',
                          color: '#495057',
                          fontWeight: '600',
                          fontSize: '14px',
                          borderBottom: '2px solid #dee2e6'
                        }}>
                          MODE DIFFUSION
                        </th>
                        <th style={{ 
                          padding: '15px', 
                          textAlign: 'left',
                          backgroundColor: '#f8f9fa',
                          color: '#495057',
                          fontWeight: '600',
                          fontSize: '14px',
                          borderBottom: '2px solid #dee2e6'
                        }}>
                          TYPE
                        </th>
                        <th style={{ 
                          padding: '15px', 
                          textAlign: 'center',
                          backgroundColor: '#f8f9fa',
                          color: '#495057',
                          fontWeight: '600',
                          fontSize: '14px',
                          borderBottom: '2px solid #dee2e6'
                        }}>
                          NOMBRE
                        </th>
                        <th style={{ 
                          padding: '15px', 
                          textAlign: 'left',
                          backgroundColor: '#f8f9fa',
                          color: '#495057',
                          fontWeight: '600',
                          fontSize: '14px',
                          borderBottom: '2px solid #dee2e6'
                        }}>
                          OBJECTIF
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayData.repartition_new_formation.map((formation, index) => (
                        <tr key={index} style={{ 
                          borderBottom: '1px solid #f0f0f0',
                          transition: 'background-color 0.2s'
                        }}>
                          <td style={{ padding: '15px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              background: formation.diffusion_mode === 'Interne' 
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                                : formation.diffusion_mode === 'Externe' 
                                ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' 
                                : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                              color: 'white',
                              fontSize: '13px',
                              fontWeight: '600',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                            }}>
                              {formation.diffusion_mode}
                            </span>
                          </td>
                          <td style={{ 
                            padding: '15px',
                            color: '#555',
                            fontSize: '14px'
                          }}>
                            {formation.internal_external}
                          </td>
                          <td style={{ 
                            padding: '15px', 
                            textAlign: 'center'
                          }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '45px',
                              height: '45px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '18px',
                              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                            }}>
                              {formation.num}
                            </span>
                          </td>
                          <td style={{ 
                            padding: '15px',
                            color: '#333',
                            fontSize: '14px',
                            lineHeight: '1.6'
                          }}>
                            {formation.ogf}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FormationDashboard;
