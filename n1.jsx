import React, { useState } from 'react';

const FormationDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('2025-08');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction pour récupérer les données
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://10.9.100.115:5020/api/generation/formation-stat/${selectedMonth}`);
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
        participants: []
      },
      {
        code_formation: "P25003",
        title: "Changement climatique",
        participants: [
          {
            activite: "AUTRES FILIERES",
            anciennete: "84419436",
            date_embauche: "10/09/2025",
            date_naissance: "08/09/2025",
            fonction: "DATA SCIENTIST",
            effective_participate: null,
            email: "participant1@example.com"
          },
          {
            activite: "TECH",
            anciennete: "12345",
            date_embauche: "15/03/2024",
            fonction: "DEVELOPER",
            effective_participate: 1,
            email: "participant2@example.com"
          },
          {
            activite: "MANAGEMENT",
            anciennete: "98765",
            fonction: "MANAGER",
            effective_participate: 0,
            email: "participant3@example.com"
          }
        ]
      },
      {
        code_formation: "P25005",
        title: "Gestion de projet Agile",
        participants: Array(18).fill(null).map((_, i) => ({
          fonction: i < 15 ? "SCRUM MASTER" : "PRODUCT OWNER",
          effective_participate: i < 15 ? 1 : 0,
          email: `participant${i}@example.com`,
          activite: "TECH"
        }))
      },
      {
        code_formation: "P25007",
        title: "Leadership et management",
        participants: Array(23).fill(null).map((_, i) => ({
          fonction: "MANAGER",
          effective_participate: i < 22 ? 1 : 0,
          email: `manager${i}@example.com`,
          activite: "MANAGEMENT"
        }))
      }
    ],
    repartition_new_formation: [
      {
        internal_external: "interne",
        num: 1,
        ogf: "Accompagner le développement personnel et l'efficacité professionnelle",
        program_type: "Présentiel"
      },
      {
        internal_external: "Formation",
        num: 1,
        ogf: "Acquérir et développer les compétences métier",
        program_type: "Présentiel"
      },
      {
        internal_external: "external",
        num: 1,
        ogf: "Développer la culture du digital et de l'innovation",
        program_type: "Présentiel"
      },
      {
        internal_external: null,
        num: 1,
        ogf: "Renforcer les compétences managériales et la culture du pilotage",
        program_type: "Interne"
      }
    ]
  };

  const displayData = data || mockData;

  // Fonction pour calculer les stats d'une formation
  const getFormationStats = (participants) => {
    const presents = participants.filter(p => p.effective_participate === 1).length;
    const absents = participants.filter(p => p.effective_participate === 0 || (p.effective_participate !== 1 && p.effective_participate !== null)).length;
    const inconnus = participants.filter(p => p.effective_participate === null).length;
    const total = participants.length;
    const taux = total > 0 ? ((presents / total) * 100).toFixed(0) : 0;
    
    return { presents, absents, inconnus, total, taux };
  };

  // Calcul des statistiques globales
  const totalFormations = displayData.formation_presence.length;
  const allParticipants = displayData.formation_presence.flatMap(f => f.participants);
  const totalParticipants = allParticipants.filter(p => p.effective_participate === 1).length;
  const totalAbsents = allParticipants.filter(p => p.effective_participate === 0 || (p.effective_participate !== 1 && p.effective_participate !== null)).length;
  const totalInconnus = allParticipants.filter(p => p.effective_participate === null).length;
  const totalNouvelles = displayData.repartition_new_formation.reduce((sum, f) => sum + f.num, 0);
  const tauxGlobal = allParticipants.length > 0 
    ? ((totalParticipants / allParticipants.length) * 100).toFixed(1)
    : 0;

  // Fonction pour ouvrir le modal
  const openModal = (formation) => {
    setSelectedFormation(formation);
  };

  // Fonction pour fermer le modal
  const closeModal = () => {
    setSelectedFormation(null);
    setSearchTerm('');
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative'
    }}>
      {/* Éléments de décoration animés */}
      <div style={{
        position: 'fixed',
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'float 6s ease-in-out infinite',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        bottom: '10%',
        right: '5%',
        width: '400px',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'float 8s ease-in-out infinite',
        zIndex: 0
      }} />

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-30px); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes slideIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .glass {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }
          .hover-lift:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
          }
        `}
      </style>

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', animation: 'slideIn 0.6s ease-out' }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '42px', 
            fontWeight: '800',
            marginBottom: '10px',
            textShadow: '0 4px 6px rgba(0,0,0,0.3)',
            letterSpacing: '-1px'
          }}>
            ✨ Tableau de Bord Formations
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '18px', fontWeight: '300' }}>
            Suivi et analyse en temps réel
          </p>
        </div>

        {/* Sélecteur de mois - Glass morphism */}
        <div className="glass hover-lift" style={{ 
          marginBottom: '30px', 
          padding: '30px', 
          borderRadius: '20px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          border: '1px solid rgba(255,255,255,0.3)',
          transition: 'all 0.3s ease',
          animation: 'slideIn 0.6s ease-out 0.1s both'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: '1', minWidth: '250px' }}>
            <span style={{ fontSize: '32px' }}>📅</span>
            <div style={{ flex: '1' }}>
              <label style={{ 
                display: 'block',
                fontWeight: '700', 
                color: '#333',
                marginBottom: '10px',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Période d'analyse
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  fontSize: '16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.3s',
                  fontWeight: '500'
                }}
              />
            </div>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="hover-lift"
            style={{
              padding: '14px 40px',
              fontSize: '16px',
              fontWeight: '700',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
              minWidth: '180px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            {loading ? '⏳ Chargement...' : '🔍 Analyser'}
          </button>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="glass" style={{
            padding: '25px',
            marginBottom: '30px',
            border: '2px solid #ff6b6b',
            borderRadius: '20px',
            color: '#c92a2a',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)',
            animation: 'slideIn 0.6s ease-out 0.2s both'
          }}>
            <span style={{ fontSize: '32px' }}>⚠️</span>
            <span style={{ fontSize: '16px', fontWeight: '600' }}>{error}</span>
          </div>
        )}

        {/* KPIs Cards avec glassmorphism */}
        {displayData && (
          <>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {/* Card 1 */}
              <div className="hover-lift" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '30px',
                borderRadius: '20px',
                boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                animation: 'slideIn 0.6s ease-out 0.2s both'
              }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px', animation: 'pulse 3s ease-in-out infinite' }}>📚</div>
                  <div style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {totalFormations}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.95, fontWeight: '500' }}>Formations actives</div>
                </div>
                <div style={{
                  position: 'absolute',
                  right: '-30px',
                  bottom: '-30px',
                  fontSize: '140px',
                  opacity: 0.08
                }}>📚</div>
              </div>

              {/* Card 2 */}
              <div className="hover-lift" style={{
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                padding: '30px',
                borderRadius: '20px',
                boxShadow: '0 15px 35px rgba(17, 153, 142, 0.4)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                animation: 'slideIn 0.6s ease-out 0.3s both'
              }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px', animation: 'pulse 3s ease-in-out infinite 0.5s' }}>✅</div>
                  <div style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {totalParticipants}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.95, fontWeight: '500' }}>Présents</div>
                </div>
                <div style={{
                  position: 'absolute',
                  right: '-30px',
                  bottom: '-30px',
                  fontSize: '140px',
                  opacity: 0.08
                }}>✅</div>
              </div>

              {/* Card 3 */}
              <div className="hover-lift" style={{
                background: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
                padding: '30px',
                borderRadius: '20px',
                boxShadow: '0 15px 35px rgba(238, 9, 121, 0.4)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                animation: 'slideIn 0.6s ease-out 0.4s both'
              }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px', animation: 'pulse 3s ease-in-out infinite 1s' }}>❌</div>
                  <div style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {totalAbsents}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.95, fontWeight: '500' }}>Absents</div>
                </div>
                <div style={{
                  position: 'absolute',
                  right: '-30px',
                  bottom: '-30px',
                  fontSize: '140px',
                  opacity: 0.08
                }}>❌</div>
              </div>

              {/* Card 4 */}
              <div className="hover-lift" style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                padding: '30px',
                borderRadius: '20px',
                boxShadow: '0 15px 35px rgba(240, 147, 251, 0.4)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                animation: 'slideIn 0.6s ease-out 0.5s both'
              }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px', animation: 'pulse 3s ease-in-out infinite 1.5s' }}>❓</div>
                  <div style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {totalInconnus}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.95, fontWeight: '500' }}>Statut inconnu</div>
                </div>
                <div style={{
                  position: 'absolute',
                  right: '-30px',
                  bottom: '-30px',
                  fontSize: '140px',
                  opacity: 0.08
                }}>❓</div>
              </div>

              {/* Card 5 */}
              <div className="hover-lift" style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                padding: '30px',
                borderRadius: '20px',
                boxShadow: '0 15px 35px rgba(79, 172, 254, 0.4)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                animation: 'slideIn 0.6s ease-out 0.6s both'
              }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px', animation: 'pulse 3s ease-in-out infinite 2s' }}>📈</div>
                  <div style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {tauxGlobal}%
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.95, fontWeight: '500' }}>Taux de participation</div>
                </div>
                <div style={{
                  position: 'absolute',
                  right: '-30px',
                  bottom: '-30px',
                  fontSize: '140px',
                  opacity: 0.08
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
              <div className="glass hover-lift" style={{
                borderRadius: '20px',
                padding: '35px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                animation: 'slideIn 0.6s ease-out 0.7s both'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  marginBottom: '30px',
                  paddingBottom: '25px',
                  borderBottom: '3px solid #f0f0f0'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
                  }}>👥</div>
                  <h3 style={{ 
                    fontSize: '28px', 
                    fontWeight: '800',
                    color: '#333',
                    margin: 0,
                    letterSpacing: '-0.5px'
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
                          padding: '18px', 
                          textAlign: 'left',
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                          color: '#495057',
                          fontWeight: '700',
                          fontSize: '13px',
                          borderBottom: '3px solid #dee2e6',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>
                          CODE
                        </th>
                        <th style={{ 
                          padding: '18px', 
                          textAlign: 'left',
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                          color: '#495057',
                          fontWeight: '700',
                          fontSize: '13px',
                          borderBottom: '3px solid #dee2e6',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>
                          TITRE DE LA FORMATION
                        </th>
                        <th style={{ 
                          padding: '18px', 
                          textAlign: 'center',
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                          color: '#495057',
                          fontWeight: '700',
                          fontSize: '13px',
                          borderBottom: '3px solid #dee2e6',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>
                          PRÉSENTS
                        </th>
                        <th style={{ 
                          padding: '18px', 
                          textAlign: 'center',
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                          color: '#495057',
                          fontWeight: '700',
                          fontSize: '13px',
                          borderBottom: '3px solid #dee2e6',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>
                          ABSENTS
                        </th>
                        <th style={{ 
                          padding: '18px', 
                          textAlign: 'center',
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                          color: '#495057',
                          fontWeight: '700',
                          fontSize: '13px',
                          borderBottom: '3px solid #dee2e6',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>
                          INCONNUS
                        </th>
                        <th style={{ 
                          padding: '18px', 
                          textAlign: 'center',
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                          color: '#495057',
                          fontWeight: '700',
                          fontSize: '13px',
                          borderBottom: '3px solid #dee2e6',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>
                          TAUX
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayData.formation_presence.map((formation, index) => {
                        const stats = getFormationStats(formation.participants);
                        
                        return (
                          <tr 
                            key={index} 
                            onClick={() => openModal(formation)}
                            style={{ 
                              borderBottom: '1px solid #f0f0f0',
                              transition: 'all 0.3s',
                              cursor: 'pointer',
                              background: 'white'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'linear-gradient(135deg, #f8f9ff 0%, #fff5f8 100%)';
                              e.currentTarget.style.transform = 'scale(1.01)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'white';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            <td style={{ padding: '18px' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '8px 16px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: '700',
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                              }}>
                                {formation.code_formation}
                              </span>
                            </td>
                            <td style={{ 
                              padding: '18px',
                              color: '#333',
                              fontSize: '15px',
                              fontWeight: '600'
                            }}>
                              {formation.title}
                            </td>
                            <td style={{ 
                              padding: '18px', 
                              textAlign: 'center'
                            }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #d3f9d8 0%, #a8e6cf 100%)',
                                color: '#2b8a3e',
                                fontWeight: 'bold',
                                fontSize: '18px',
                                boxShadow: '0 4px 12px rgba(43, 138, 62, 0.2)'
                              }}>
                                {stats.presents}
                              </span>
                            </td>
                            <td style={{ 
                              padding: '18px', 
                              textAlign: 'center'
                            }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #ffe3e3 0%, #ffc9c9 100%)',
                                color: '#c92a2a',
                                fontWeight: 'bold',
                                fontSize: '18px',
                                boxShadow: '0 4px 12px rgba(201, 42, 42, 0.2)'
                              }}>
                                {stats.absents}
                              </span>
                            </td>
                            <td style={{ 
                              padding: '18px', 
                              textAlign: 'center'
                            }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #fff3bf 0%, #ffec99 100%)',
                                color: '#e67700',
                                fontWeight: 'bold',
                                fontSize: '18px',
                                boxShadow: '0 4px 12px rgba(230, 119, 0, 0.2)'
                              }}>
                                {stats.inconnus}
                              </span>
                            </td>
                            <td style={{ 
                              padding: '18px', 
                              textAlign: 'center'
                            }}>
                              <div style={{
                                display: 'inline-block',
                                padding: '10px 20px',
                                borderRadius: '25px',
                                background: stats.taux >= 80 
                                  ? 'linear-gradient(135deg, #d3f9d8 0%, #a8e6cf 100%)' 
                                  : stats.taux >= 50 
                                  ? 'linear-gradient(135deg, #fff3bf 0%, #ffec99 100%)' 
                                  : 'linear-gradient(135deg, #ffe3e3 0%, #ffc9c9 100%)',
                                color: stats.taux >= 80 ? '#2b8a3e' : stats.taux >= 50 ? '#e67700' : '#c92a2a',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                boxShadow: stats.taux >= 80 
                                  ? '0 4px 12px rgba(43, 138, 62, 0.3)' 
                                  : stats.taux >= 50 
                                  ? '0 4px 12px rgba(230, 119, 0, 0.3)' 
                                  : '0 4px 12px rgba(201, 42, 42, 0.3)'
                              }}>
                                {stats.taux}%
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
              <div className="glass hover-lift" style={{
                borderRadius: '20px',
                padding: '35px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                animation: 'slideIn 0.6s ease-out 0.8s both'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  marginBottom: '30px',
                  paddingBottom: '25px',
                  borderBottom: '3px solid #f0f0f0'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    boxShadow: '0 8px 20px rgba(240, 147, 251, 0.3)'
                  }}>🎯</div>
                  <h3 style={{ 
                    fontSize: '28px', 
                    fontWeight: '800',
                    color: '#333',
                    margin: 0,
                    letterSpacing: '-0.5px'
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
                          padding: '18px', 
                          textAlign: 'left',
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                          color: '#495057',
                          fontWeight: '700',
                          fontSize: '13px',
                          borderBottom: '3px solid #dee2e6',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>
                          TYPE
                        </th>
                        <th style={{ 
                          padding: '18px', 
                          textAlign: 'center',
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                          color: '#495057',
                          fontWeight: '700',
                          fontSize: '13px',
                          borderBottom: '3px solid #dee2e6',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>
                          NOMBRE
                        </th>
                        <th style={{ 
                          padding: '18px', 
                          textAlign: 'left',
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                          color: '#495057',
                          fontWeight: '700',
                          fontSize: '13px',
                          borderBottom: '3px solid #dee2e6',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>
                          OBJECTIF
                        </th>
                        <th style={{ 
                          padding: '18px', 
                          textAlign: 'left',
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                          color: '#495057',
                          fontWeight: '700',
                          fontSize: '13px',
                          borderBottom: '3px solid #dee2e6',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>
                          PROGRAMME
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayData.repartition_new_formation.map((formation, index) => (
                        <tr 
                          key={index} 
                          style={{ 
                            borderBottom: '1px solid #f0f0f0',
                            transition: 'all 0.3s',
                            background: 'white'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #f8f9ff 0%, #fff5f8 100%)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                          }}
                        >
                          <td style={{ padding: '18px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '10px 20px',
                              borderRadius: '10px',
                              background: formation.internal_external === 'interne' || formation.internal_external === 'Interne'
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                                : formation.internal_external === 'external' || formation.internal_external === 'Externe'
                                ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' 
                                : formation.internal_external === 'Formation'
                                ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                                : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                              color: 'white',
                              fontSize: '13px',
                              fontWeight: '700',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                              textTransform: 'capitalize'
                            }}>
                              {formation.internal_external || 'Non défini'}
                            </span>
                          </td>
                          <td style={{ 
                            padding: '18px', 
                            textAlign: 'center'
                          }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: '50px',
                              height: '50px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '20px',
                              boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)'
                            }}>
                              {formation.num}
                            </span>
                          </td>
                          <td style={{ 
                            padding: '18px',
                            color: '#333',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            fontWeight: '500'
                          }}>
                            {formation.ogf}
                          </td>
                          <td style={{ 
                            padding: '18px',
                            color: '#555',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>
                            <span style={{
                              padding: '6px 14px',
                              background: 'linear-gradient(135deg, #e7f5ff 0%, #d0ebff 100%)',
                              color: '#1971c2',
                              borderRadius: '8px',
                              fontSize: '13px'
                            }}>
                              {formation.program_type}
                            </span>
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

      {/* Modal détails participants */}
      {selectedFormation && (
        <div 
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
            `}
          </style>
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass"
            style={{
              maxWidth: '900px',
              width: '100%',
              maxHeight: '80vh',
              borderRadius: '25px',
              padding: '40px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.3)',
              animation: 'slideUp 0.4s ease-out',
              overflowY: 'auto'
            }}
          >
            {/* Header du modal */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '30px',
              paddingBottom: '25px',
              borderBottom: '3px solid #f0f0f0'
            }}>
              <div>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  color: '#333',
                  marginBottom: '10px',
                  letterSpacing: '-0.5px'
                }}>
                  {selectedFormation.title}
                </h2>
                <span style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}>
                  {selectedFormation.code_formation}
                </span>
              </div>
              <button
                onClick={closeModal}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee0979 100%)',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(238, 9, 121, 0.3)',
                  fontWeight: 'bold'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'rotate(90deg) scale(1.1)';
                  e.target.style.boxShadow = '0 6px 20px rgba(238, 9, 121, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'rotate(0) scale(1)';
                  e.target.style.boxShadow = '0 4px 12px rgba(238, 9, 121, 0.3)';
                }}
              >
                ×
              </button>
            </div>

            {/* Stats du modal */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px',
              marginBottom: '30px'
            }}>
              {(() => {
                const stats = getFormationStats(selectedFormation.participants);
                return (
                  <>
                    <div style={{
                      padding: '20px',
                      background: 'linear-gradient(135deg, #d3f9d8 0%, #a8e6cf 100%)',
                      borderRadius: '15px',
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(43, 138, 62, 0.2)'
                    }}>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2b8a3e' }}>
                        {stats.presents}
                      </div>
                      <div style={{ fontSize: '13px', color: '#2b8a3e', fontWeight: '600', marginTop: '5px' }}>
                        Présents
                      </div>
                    </div>
                    <div style={{
                      padding: '20px',
                      background: 'linear-gradient(135deg, #ffe3e3 0%, #ffc9c9 100%)',
                      borderRadius: '15px',
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(201, 42, 42, 0.2)'
                    }}>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#c92a2a' }}>
                        {stats.absents}
                      </div>
                      <div style={{ fontSize: '13px', color: '#c92a2a', fontWeight: '600', marginTop: '5px' }}>
                        Absents
                      </div>
                    </div>
                    <div style={{
                      padding: '20px',
                      background: 'linear-gradient(135deg, #fff3bf 0%, #ffec99 100%)',
                      borderRadius: '15px',
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(230, 119, 0, 0.2)'
                    }}>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e67700' }}>
                        {stats.inconnus}
                      </div>
                      <div style={{ fontSize: '13px', color: '#e67700', fontWeight: '600', marginTop: '5px' }}>
                        Statut inconnu
                      </div>
                    </div>
                    <div style={{
                      padding: '20px',
                      background: 'linear-gradient(135deg, #e7f5ff 0%, #d0ebff 100%)',
                      borderRadius: '15px',
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(25, 113, 194, 0.2)'
                    }}>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1971c2' }}>
                        {stats.taux}%
                      </div>
                      <div style={{ fontSize: '13px', color: '#1971c2', fontWeight: '600', marginTop: '5px' }}>
                        Taux
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Liste des participants */}
            {selectedFormation.participants.length > 0 ? (
              <div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#333',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span>📋</span> Liste des participants 
                  {searchTerm ? (
                    <span style={{ 
                      fontSize: '16px', 
                      fontWeight: '500',
                      color: '#667eea'
                    }}>
                      ({selectedFormation.participants.filter(p => {
                        const searchLower = searchTerm.toLowerCase();
                        const email = (p.email || '').toLowerCase();
                        const fonction = (p.fonction || '').toLowerCase();
                        const activite = (p.activite || '').toLowerCase();
                        return email.includes(searchLower) || fonction.includes(searchLower) || activite.includes(searchLower);
                      }).length} résultat{selectedFormation.participants.filter(p => {
                        const searchLower = searchTerm.toLowerCase();
                        const email = (p.email || '').toLowerCase();
                        const fonction = (p.fonction || '').toLowerCase();
                        const activite = (p.activite || '').toLowerCase();
                        return email.includes(searchLower) || fonction.includes(searchLower) || activite.includes(searchLower);
                      }).length > 1 ? 's' : ''} sur {selectedFormation.participants.length})
                    </span>
                  ) : (
                    <span style={{ fontSize: '16px', fontWeight: '500' }}>
                      ({selectedFormation.participants.length})
                    </span>
                  )}
                </h3>

                {/* Zone de recherche */}
                <div style={{
                  marginBottom: '20px',
                  position: 'relative'
                }}>
                  <input
                    type="text"
                    placeholder="🔍 Rechercher un participant (nom, email, fonction)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '15px 50px 15px 20px',
                      fontSize: '15px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '12px',
                      outline: 'none',
                      transition: 'all 0.3s',
                      fontWeight: '500',
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #fff 100%)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      style={{
                        position: 'absolute',
                        right: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        border: 'none',
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee0979 100%)',
                        color: 'white',
                        fontSize: '18px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(238, 9, 121, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-50%) scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(-50%) scale(1)';
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>

                <div style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  padding: '5px'
                }}>
                  {(() => {
                    // Filtrer les participants selon le terme de recherche
                    const filteredParticipants = selectedFormation.participants.filter(participant => {
                      const searchLower = searchTerm.toLowerCase();
                      const email = (participant.email || '').toLowerCase();
                      const fonction = (participant.fonction || '').toLowerCase();
                      const activite = (participant.activite || '').toLowerCase();
                      
                      return email.includes(searchLower) || 
                             fonction.includes(searchLower) || 
                             activite.includes(searchLower);
                    });

                    // Afficher un message si aucun résultat
                    if (filteredParticipants.length === 0) {
                      return (
                        <div style={{
                          padding: '40px',
                          textAlign: 'center',
                          color: '#999',
                          fontSize: '16px',
                          fontWeight: '500'
                        }}>
                          <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔍</div>
                          Aucun participant trouvé pour "{searchTerm}"
                        </div>
                      );
                    }

                    return filteredParticipants.map((participant, idx) => (
                    <div 
                      key={idx}
                      style={{
                        padding: '15px 20px',
                        marginBottom: '10px',
                        background: participant.effective_participate === 1 
                          ? 'linear-gradient(135deg, #f0fff4 0%, #d3f9d8 100%)'
                          : participant.effective_participate === null
                          ? 'linear-gradient(135deg, #fffbf0 0%, #fff3bf 100%)'
                          : 'linear-gradient(135deg, #fff5f5 0%, #ffe3e3 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        border: participant.effective_participate === 1
                          ? '2px solid #a8e6cf'
                          : participant.effective_participate === null
                          ? '2px solid #ffec99'
                          : '2px solid #ffc9c9',
                        transition: 'all 0.3s'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontWeight: '700',
                          fontSize: '15px',
                          color: '#333',
                          marginBottom: '5px'
                        }}>
                          {participant.email || `Participant ${idx + 1}`}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#666',
                          fontWeight: '500'
                        }}>
                          {participant.fonction || 'Fonction non spécifiée'}
                        </div>
                      </div>
                      <div style={{
                        padding: '8px 18px',
                        borderRadius: '20px',
                        background: participant.effective_participate === 1
                          ? '#2b8a3e'
                          : participant.effective_participate === null
                          ? '#e67700'
                          : '#c92a2a',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: '700',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                      }}>
                        {participant.effective_participate === 1 
                          ? '✅ Présent' 
                          : participant.effective_participate === null
                          ? '❓ Inconnu'
                          : '❌ Absent'}
                      </div>
                    </div>
                  ));
                  })()}
                </div>
              </div>
            ) : (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#999',
                fontSize: '16px',
                fontWeight: '500'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>📭</div>
                Aucun participant pour cette formation
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormationDashboard;
