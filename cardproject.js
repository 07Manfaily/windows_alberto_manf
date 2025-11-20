import React from 'react';

const ProjectsTable = () => {
  const projects = [
    {
      id: 1,
      icon: '🎯',
      name: 'Plateforme E-commerce',
      description: 'Application web complète avec paiement sécurisé',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      status: 'completed',
      statusLabel: 'Terminé'
    },
    {
      id: 2,
      icon: '📱',
      name: 'Application Mobile',
      description: 'Gestion de tâches en temps réel',
      technologies: ['React Native', 'Firebase', 'Redux'],
      status: 'progress',
      statusLabel: 'En cours'
    },
    {
      id: 3,
      icon: '🎨',
      name: 'Portfolio Designer',
      description: 'Site portfolio moderne et interactif',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
      status: 'completed',
      statusLabel: 'Terminé'
    },
    {
      id: 4,
      icon: '🤖',
      name: 'Chatbot IA',
      description: 'Assistant virtuel intelligent 24/7',
      technologies: ['Python', 'TensorFlow', 'NLP', 'FastAPI'],
      status: 'planned',
      statusLabel: 'Planifié'
    },
    {
      id: 5,
      icon: '📊',
      name: 'Dashboard Analytics',
      description: 'Tableau de bord analytique en temps réel',
      technologies: ['React', 'D3.js', 'PostgreSQL'],
      status: 'completed',
      statusLabel: 'Terminé'
    },
    {
      id: 6,
      icon: '🎮',
      name: 'Mini-jeu Web',
      description: 'Jeu interactif avec système de scores',
      technologies: ['TypeScript', 'Canvas', 'WebGL'],
      status: 'progress',
      statusLabel: 'En cours'
    }
  ];

  const stats = {
    total: 6,
    completed: 3,
    inProgress: 2,
    planned: 1
  };

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      minHeight: '100vh',
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '30px',
        padding: '50px',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3)',
        maxWidth: '1200px',
        width: '100%',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📊</div>
          <h1 style={{
            fontSize: '2.5rem',
            color: 'white',
            fontWeight: '700',
            marginBottom: '10px',
            textShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
          }}>
            Tableau de Projets
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1.1rem',
            fontWeight: '300'
          }}>
            Vue d'ensemble de mon portfolio
          </p>
        </div>

        {/* Table */}
        <div style={{
          overflowX: 'auto',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
              <tr>
                <th style={{
                  color: 'white',
                  padding: '20px 15px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  borderTopLeftRadius: '20px'
                }}>
                  Projet
                </th>
                <th style={{
                  color: 'white',
                  padding: '20px 15px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase'
                }}>
                  Technologies
                </th>
                <th style={{
                  color: 'white',
                  padding: '20px 15px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase'
                }}>
                  Statut
                </th>
                <th style={{
                  color: 'white',
                  padding: '20px 15px',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  borderTopRightRadius: '20px'
                }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} style={{
                  transition: 'all 0.3s ease',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
                }}>
                  <td style={{ padding: '18px 15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ fontSize: '2rem', minWidth: '40px' }}>
                        {project.icon}
                      </div>
                      <div>
                        <div style={{
                          fontWeight: '600',
                          color: '#2d3748',
                          fontSize: '1.05rem'
                        }}>
                          {project.name}
                        </div>
                        <div style={{
                          fontSize: '0.85rem',
                          color: '#718096',
                          lineHeight: '1.4'
                        }}>
                          {project.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '18px 15px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} style={{
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                          color: '#667eea',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          border: '1px solid rgba(102, 126, 234, 0.2)'
                        }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '18px 15px' }}>
                    <span style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)',
                      display: 'inline-block',
                      background: project.status === 'completed' 
                        ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                        : project.status === 'progress'
                        ? 'linear-gradient(135deg, #FF9800 0%, #f57c00 100%)'
                        : 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)',
                      color: 'white'
                    }}>
                      {project.statusLabel}
                    </span>
                  </td>
                  <td style={{ padding: '18px 15px', textAlign: 'center' }}>
                    <a href="#" style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '8px 20px',
                      borderRadius: '20px',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      display: 'inline-block'
                    }}>
                      Voir
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Stats */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          paddingTop: '30px',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px'
            }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                textShadow: '0 3px 10px rgba(0, 0, 0, 0.3)'
              }}>
                {stats.total}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Projets</div>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px'
            }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                textShadow: '0 3px 10px rgba(0, 0, 0, 0.3)'
              }}>
                {stats.completed}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Terminés</div>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px'
            }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                textShadow: '0 3px 10px rgba(0, 0, 0, 0.3)'
              }}>
                {stats.inProgress}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>En cours</div>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px'
            }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                textShadow: '0 3px 10px rgba(0, 0, 0, 0.3)'
              }}>
                {stats.planned}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Planifié</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsTable;
