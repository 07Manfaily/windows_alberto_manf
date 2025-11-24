import React, { useState } from 'react';

const FormationStats = () => {
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

  // Données mock pour la démo (à supprimer quand tu utiliseras l'API)
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

  // Utiliser mockData pour la démo, sinon utiliser data de l'API
  const displayData = data || mockData;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>Statistiques des Formations</h2>

      {/* Sélecteur de mois */}
      <div style={{ 
        marginBottom: '30px', 
        padding: '20px', 
        backgroundColor: '#fff', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <label style={{ fontWeight: '600', color: '#555' }}>
          Sélectionner le mois :
        </label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            padding: '10px 15px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
        />
        <button
          onClick={fetchData}
          disabled={loading}
          style={{
            padding: '10px 25px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: loading ? '#ccc' : '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? 'Chargement...' : 'Rechercher'}
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '6px',
          color: '#c33'
        }}>
          {error}
        </div>
      )}

      {/* Affichage des données */}
      {displayData && (
        <div>

      {/* Tableau Formation Présence */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '15px', color: '#555', fontSize: '18px' }}>
          Formation Présence
        </h3>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          border: '1px solid #ddd',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#4a90e2', color: 'white' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                Code Formation
              </th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                Titre
              </th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                Participants Effectifs
              </th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                Non Participants
              </th>
            </tr>
          </thead>
          <tbody>
            {displayData.formation_presence.map((formation, index) => (
              <tr key={index} style={{ 
                backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9',
                transition: 'background-color 0.2s'
              }}>
                <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: '600' }}>
                  {formation.code_formation}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {formation.title}
                </td>
                <td style={{ 
                  padding: '12px', 
                  border: '1px solid #ddd', 
                  textAlign: 'center',
                  color: formation.num_effective_participate > 0 ? '#27ae60' : '#666',
                  fontWeight: '600'
                }}>
                  {formation.num_effective_participate}
                </td>
                <td style={{ 
                  padding: '12px', 
                  border: '1px solid #ddd', 
                  textAlign: 'center',
                  color: formation.num_no_participate > 0 ? '#e74c3c' : '#666',
                  fontWeight: '600'
                }}>
                  {formation.num_no_participate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tableau Répartition Nouvelles Formations */}
      <div>
        <h3 style={{ marginBottom: '15px', color: '#555', fontSize: '18px' }}>
          Répartition Nouvelles Formations
        </h3>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          border: '1px solid #ddd',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#4a90e2', color: 'white' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                Mode de Diffusion
              </th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                Type
              </th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                Nombre
              </th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                Objectif
              </th>
            </tr>
          </thead>
          <tbody>
            {displayData.repartition_new_formation.map((formation, index) => (
              <tr key={index} style={{ 
                backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9',
                transition: 'background-color 0.2s'
              }}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: formation.diffusion_mode === 'Interne' ? '#e3f2fd' : 
                                   formation.diffusion_mode === 'Externe' ? '#fff3e0' : '#f3e5f5',
                    color: formation.diffusion_mode === 'Interne' ? '#1976d2' : 
                           formation.diffusion_mode === 'Externe' ? '#f57c00' : '#7b1fa2',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    {formation.diffusion_mode}
                  </span>
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {formation.internal_external}
                </td>
                <td style={{ 
                  padding: '12px', 
                  border: '1px solid #ddd', 
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#4a90e2'
                }}>
                  {formation.num}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd', fontSize: '14px' }}>
                  {formation.ogf}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Statistiques résumées */}
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap'
      }}>
        <div style={{ textAlign: 'center', margin: '10px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4a90e2' }}>
            {displayData.formation_presence.length}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Formations en présence</div>
        </div>
        <div style={{ textAlign: 'center', margin: '10px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#27ae60' }}>
            {displayData.formation_presence.reduce((sum, f) => sum + f.num_effective_participate, 0)}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Total participants</div>
        </div>
        <div style={{ textAlign: 'center', margin: '10px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e74c3c' }}>
            {displayData.formation_presence.reduce((sum, f) => sum + f.num_no_participate, 0)}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Non participants</div>
        </div>
        <div style={{ textAlign: 'center', margin: '10px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#9b59b6' }}>
            {displayData.repartition_new_formation.reduce((sum, f) => sum + f.num, 0)}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Nouvelles formations</div>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default FormationStats;
