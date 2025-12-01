import React, { useState, useEffect } from 'react';

const QuantumLogout = ({ onLogoutComplete }) => {
  const [isActivated, setIsActivated] = useState(false);
  const [waveProgress, setWaveProgress] = useState(0);
  const [portalParticles, setPortalParticles] = useState([]);
  const [energyRings, setEnergyRings] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isActivated) {
      const particles = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        angle: (i / 100) * Math.PI * 2,
        radius: 50 + Math.random() * 100,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 2 + 1,
        delay: Math.random() * 0.3
      }));
      setPortalParticles(particles);

      const rings = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        delay: i * 0.2
      }));
      setEnergyRings(rings);

      let progress = 0;
      const interval = setInterval(() => {
        progress += 1.5;
        setWaveProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            console.log('🌌 Portail fermé - Au revoir!');
            if (onLogoutComplete) {
              onLogoutComplete();
            }
            setTimeout(() => {
              setIsActivated(false);
              setWaveProgress(0);
              setPortalParticles([]);
              setEnergyRings([]);
              setShowModal(false);
            }, 800);
          }, 500);
        }
      }, 25);

      return () => clearInterval(interval);
    }
  }, [isActivated, onLogoutComplete]);

  const handleActivate = () => {
    setIsActivated(true);
  };

  return (
    <>
      {/* Bouton dans le header */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          border: '2px solid rgba(0, 240, 255, 0.3)',
          borderRadius: '12px',
          padding: '12px 24px',
          color: 'white',
          fontSize: '14px',
          fontWeight: '700',
          letterSpacing: '1px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 0 20px rgba(102, 126, 234, 0.4)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 0 30px rgba(102, 126, 234, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.4)';
        }}
      >
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        LOGOUT
      </button>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease'
        }}>
          {/* Portail dimensionnel */}
          {isActivated && (
            <div style={{
              position: 'absolute',
              width: '800px',
              height: '800px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(138, 43, 226, 0.4) 0%, rgba(0, 240, 255, 0.2) 40%, transparent 70%)',
              animation: 'portalExpand 2s ease-out forwards',
              pointerEvents: 'none'
            }}>
              {energyRings.map((ring) => (
                <div
                  key={`ring-${ring.id}`}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100%',
                    height: '100%',
                    border: '3px solid rgba(0, 240, 255, 0.6)',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    animation: 'ringPulse 1.5s ease-out forwards',
                    animationDelay: `${ring.delay}s`
                  }}
                />
              ))}

              {portalParticles.map((particle) => (
                <div
                  key={`particle-${particle.id}`}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    background: `hsl(${180 + Math.random() * 80}, 100%, 60%)`,
                    borderRadius: '50%',
                    boxShadow: `0 0 ${particle.size * 3}px currentColor`,
                    animation: `spiralOut ${particle.speed}s ease-in forwards`,
                    animationDelay: `${particle.delay}s`,
                    transform: `translate(-50%, -50%) rotate(${particle.angle}rad) translateX(${particle.radius}px)`
                  }}
                />
              ))}
            </div>
          )}

          <div style={{
            position: 'relative',
            zIndex: 10
          }}>
            {/* Titre */}
            {!isActivated && (
              <div style={{
                textAlign: 'center',
                marginBottom: '50px',
                animation: 'fadeInDown 0.8s ease'
              }}>
                <h1 style={{
                  fontSize: '48px',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #00f0ff, #ff00ff, #00f0ff)',
                  backgroundSize: '200% 200%',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  animation: 'gradientShift 3s ease infinite',
                  textTransform: 'uppercase',
                  letterSpacing: '8px',
                  textShadow: '0 0 40px rgba(0, 240, 255, 0.5)',
                  marginBottom: '10px'
                }}>
                  Quantum
                </h1>
                <p style={{
                  color: 'rgba(0, 240, 255, 0.7)',
                  fontSize: '14px',
                  letterSpacing: '4px',
                  fontWeight: '600'
                }}>
                  LOGOUT PROTOCOL
                </p>
              </div>
            )}

            {/* Bouton circulaire */}
            <div
              onClick={!isActivated ? handleActivate : undefined}
              style={{
                position: 'relative',
                width: '320px',
                height: '320px',
                cursor: isActivated ? 'default' : 'pointer',
                transition: 'transform 0.3s ease',
                transform: isActivated ? 'scale(0.9)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                if (!isActivated) e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                if (!isActivated) e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {/* Cercle extérieur rotatif */}
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, transparent, rgba(0, 240, 255, 0.4), transparent, rgba(255, 0, 255, 0.4), transparent)',
                animation: isActivated ? 'spinFast 1s linear infinite' : 'spinSlow 8s linear infinite',
                filter: 'blur(2px)'
              }} />

              {/* Cercle du milieu */}
              <div style={{
                position: 'absolute',
                inset: '15px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(15, 52, 96, 0.9))',
                border: '2px solid rgba(0, 240, 255, 0.3)',
                boxShadow: 'inset 0 0 60px rgba(0, 240, 255, 0.2), 0 0 80px rgba(0, 240, 255, 0.3)'
              }} />

              {/* Cercle intérieur */}
              <div style={{
                position: 'absolute',
                inset: '40px',
                borderRadius: '50%',
                background: isActivated 
                  ? 'radial-gradient(circle, rgba(255, 0, 255, 0.3), rgba(0, 240, 255, 0.3))'
                  : 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '15px',
                boxShadow: '0 0 40px rgba(102, 126, 234, 0.6), inset 0 0 40px rgba(255, 255, 255, 0.1)',
                border: '3px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.5s ease',
                opacity: isActivated ? 0.5 : 1
              }}>
                <svg 
                  width="80" 
                  height="80" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))',
                    animation: isActivated ? 'iconShake 0.5s ease infinite' : 'none'
                  }}
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>

                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '800',
                    letterSpacing: '3px',
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                    marginBottom: '5px'
                  }}>
                    {isActivated ? 'ACTIVÉ' : 'LOGOUT'}
                  </div>
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '11px',
                    letterSpacing: '2px',
                    fontWeight: '600'
                  }}>
                    {isActivated ? `${Math.round(waveProgress)}%` : 'TAP TO EXIT'}
                  </div>
                </div>
              </div>

              {/* Progression circulaire */}
              {isActivated && (
                <svg 
                  style={{
                    position: 'absolute',
                    inset: '5px',
                    width: 'calc(100% - 10px)',
                    height: 'calc(100% - 10px)',
                    transform: 'rotate(-90deg)'
                  }}
                >
                  <circle
                    cx="50%"
                    cy="50%"
                    r="48%"
                    stroke="rgba(0, 240, 255, 0.2)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="48%"
                    stroke="url(#gradientCircle)"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray="942"
                    strokeDashoffset={942 - (942 * waveProgress) / 100}
                    strokeLinecap="round"
                    style={{
                      transition: 'stroke-dashoffset 0.3s linear',
                      filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.8))'
                    }}
                  />
                  <defs>
                    <linearGradient id="gradientCircle" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00f0ff" />
                      <stop offset="50%" stopColor="#ff00ff" />
                      <stop offset="100%" stopColor="#00f0ff" />
                    </linearGradient>
                  </defs>
                </svg>
              )}

              {/* Particules orbitales */}
              {!isActivated && [...Array(12)].map((_, i) => (
                <div
                  key={`orbit-${i}`}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '6px',
                    height: '6px',
                    background: i % 2 === 0 ? '#00f0ff' : '#ff00ff',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px currentColor',
                    transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateX(140px)`,
                    animation: `orbit ${8 + i * 0.5}s linear infinite`,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>

            {/* Messages de statut */}
            {isActivated && (
              <div style={{
                marginTop: '40px',
                textAlign: 'center',
                animation: 'fadeIn 0.5s ease'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(0, 240, 255, 0.1)',
                  border: '2px solid rgba(0, 240, 255, 0.3)',
                  borderRadius: '50px',
                  padding: '15px 30px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#00f0ff',
                    boxShadow: '0 0 20px #00f0ff',
                    animation: 'pulseDot 1s ease infinite'
                  }} />
                  <span style={{
                    color: '#00f0ff',
                    fontSize: '14px',
                    fontWeight: '700',
                    letterSpacing: '2px'
                  }}>
                    {waveProgress < 25 && '🔐 INITIALISATION...'}
                    {waveProgress >= 25 && waveProgress < 50 && '🌀 OUVERTURE DU PORTAIL...'}
                    {waveProgress >= 50 && waveProgress < 75 && '⚡ TRANSFERT DIMENSIONNEL...'}
                    {waveProgress >= 75 && waveProgress < 100 && '🚀 FERMETURE...'}
                    {waveProgress >= 100 && '✨ DÉCONNEXION RÉUSSIE !'}
                  </span>
                </div>
              </div>
            )}

            {/* Bouton Annuler */}
            {!isActivated && (
              <div style={{
                textAlign: 'center',
                marginTop: '30px'
              }}>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    background: 'transparent',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    padding: '12px 30px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                    fontWeight: '600',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  }}
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes portalExpand {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes ringPulse {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }

        @keyframes spiralOut {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(0px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(720deg) translateX(400px) scale(0);
            opacity: 0;
          }
        }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spinFast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes iconShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-5deg); }
          75% { transform: translateX(5px) rotate(5deg); }
        }

        @keyframes orbit {
          from { transform: translate(-50%, -50%) rotate(0deg) translateX(140px); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateX(140px); }
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes pulseDot {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.5);
          }
        }
      `}</style>
    </>
  );
};

export default QuantumLogout;
