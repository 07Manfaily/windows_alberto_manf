import React, { useState } from 'react';

const AlertsCard = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'success',
      icon: '✅',
      title: 'Opération réussie !',
      message: 'Votre projet a été enregistré avec succès dans la base de données.'
    },
    {
      id: 2,
      type: 'error',
      icon: '❌',
      title: 'Erreur détectée',
      message: 'Impossible de se connecter au serveur. Veuillez réessayer ultérieurement.'
    },
    {
      id: 3,
      type: 'warning',
      icon: '⚠️',
      title: 'Attention requise',
      message: 'Votre session expirera dans 5 minutes. Enregistrez votre travail.'
    },
    {
      id: 4,
      type: 'info',
      icon: 'ℹ️',
      title: 'Information',
      message: 'Une nouvelle mise à jour est disponible. Cliquez ici pour l\'installer.'
    }
  ]);

  const closeAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getAlertStyles = (type) => {
    const styles = {
      success: {
        background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
        color: '#155724',
        borderColor: '#28a745'
      },
      error: {
        background: 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
        color: '#721c24',
        borderColor: '#dc3545'
      },
      warning: {
        background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
        color: '#856404',
        borderColor: '#ffc107'
      },
      info: {
        background: 'linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%)',
        color: '#0c5460',
        borderColor: '#17a2b8'
      }
    };
    return styles[type] || styles.info;
  };

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '25px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        maxWidth: '600px',
        width: '100%',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '15px'
          }}>
            🔔
          </div>
          <h1 style={{
            fontSize: '2rem',
            color: '#2d3748',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            Notifications
          </h1>
          <p style={{
            color: '#718096',
            fontSize: '1rem'
          }}>
            Alertes système
          </p>
        </div>

        {/* Alerts Container */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          {alerts.map((alert, index) => {
            const alertStyle = getAlertStyles(alert.type);
            return (
              <div
                key={alert.id}
                style={{
                  ...alertStyle,
                  padding: '16px 20px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  borderLeft: `4px solid ${alertStyle.borderColor}`,
                  animation: `slideIn 0.5s ease forwards ${(index + 1) * 0.1}s`,
                  opacity: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(5px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* Alert Icon */}
                <div style={{
                  fontSize: '1.8rem',
                  flexShrink: 0
                }}>
                  {alert.icon}
                </div>

                {/* Alert Content */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600',
                    fontSize: '1rem',
                    marginBottom: '5px'
                  }}>
                    {alert.title}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    opacity: 0.9
                  }}>
                    {alert.message}
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => closeAlert(alert.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    opacity: 0.6,
                    transition: 'opacity 0.3s ease',
                    padding: '5px',
                    lineHeight: 1,
                    color: alertStyle.color
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = 0.6}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        {/* Message si aucune alerte */}
        {alerts.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#718096',
            fontSize: '1rem'
          }}>
            Aucune alerte pour le moment 😊
          </div>
        )}
      </div>

      {/* Styles globaux pour l'animation */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AlertsCard;
