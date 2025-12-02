import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, Download, Trash2, AlertCircle, Info, AlertTriangle, CheckCircle } from 'lucide-react';

const LogViewer = () => {
  const [logs, setLogs] = useState([
    { id: 1, timestamp: new Date().toISOString(), level: 'info', message: 'Application démarrée avec succès', source: 'System' },
    { id: 2, timestamp: new Date().toISOString(), level: 'success', message: 'Connexion à la base de données établie', source: 'Database' },
    { id: 3, timestamp: new Date().toISOString(), level: 'warning', message: 'Mémoire utilisée à 75%', source: 'System' },
    { id: 4, timestamp: new Date().toISOString(), level: 'error', message: 'Échec de chargement du module externe', source: 'Module' },
    { id: 5, timestamp: new Date().toISOString(), level: 'info', message: 'Requête API traitée en 234ms', source: 'API' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef(null);

  const logLevels = [
    { value: 'all', label: 'Tous', color: '#6366f1' },
    { value: 'info', label: 'Info', color: '#3b82f6' },
    { value: 'success', label: 'Succès', color: '#10b981' },
    { value: 'warning', label: 'Avertissement', color: '#f59e0b' },
    { value: 'error', label: 'Erreur', color: '#ef4444' },
  ];

  const getLogIcon = (level) => {
    switch (level) {
      case 'info':
        return <Info size={18} />;
      case 'success':
        return <CheckCircle size={18} />;
      case 'warning':
        return <AlertTriangle size={18} />;
      case 'error':
        return <AlertCircle size={18} />;
      default:
        return <Info size={18} />;
    }
  };

  const getLogColor = (level) => {
    const levelObj = logLevels.find(l => l.value === level);
    return levelObj ? levelObj.color : '#64748b';
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  useEffect(() => {
    if (autoScroll) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const addLog = (level, message, source) => {
    const newLog = {
      id: logs.length + 1,
      timestamp: new Date().toISOString(),
      level,
      message,
      source
    };
    setLogs([...logs, newLog]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `logs_${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '24px',
          padding: '30px',
          marginBottom: '30px',
          border: 'none',
          boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
        }}>
          <h1 style={{
            margin: '0 0 10px 0',
            fontSize: '32px',
            fontWeight: '700',
            color: '#ffffff',
            letterSpacing: '-0.5px'
          }}>
            📋 Visualisateur de Logs
          </h1>
          <p style={{
            margin: 0,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '16px'
          }}>
            {filteredLogs.length} log(s) affiché(s) sur {logs.length} au total
          </p>
        </div>

        {/* Controls Bar */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '20px',
          marginBottom: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          alignItems: 'center'
        }}>
          {/* Search */}
          <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
            <Search size={20} style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#667eea'
            }} />
            <input
              type="text"
              placeholder="Rechercher dans les logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 15px 12px 45px',
                background: '#f8f9ff',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                color: '#1f2937',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            {searchTerm && (
              <X
                size={18}
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  cursor: 'pointer'
                }}
              />
            )}
          </div>

          {/* Filter by Level */}
          <div style={{ position: 'relative' }}>
            <Filter size={20} style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#667eea',
              pointerEvents: 'none'
            }} />
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{
                padding: '12px 15px 12px 45px',
                background: '#f8f9ff',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                color: '#1f2937',
                fontSize: '14px',
                fontWeight: '500',
                outline: 'none',
                cursor: 'pointer',
                minWidth: '180px'
              }}
            >
              {logLevels.map(level => (
                <option key={level.value} value={level.value} style={{ background: '#ffffff', color: '#1f2937' }}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Auto Scroll Toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            style={{
              padding: '12px 20px',
              background: autoScroll ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#f3f4f6',
              border: 'none',
              borderRadius: '12px',
              color: autoScroll ? '#ffffff' : '#6b7280',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: autoScroll ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (autoScroll) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
              } else {
                e.currentTarget.style.background = '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              if (autoScroll) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              } else {
                e.currentTarget.style.background = '#f3f4f6';
              }
            }}
          >
            Auto-scroll {autoScroll ? '✓' : '✗'}
          </button>

          {/* Export Button */}
          <button
            onClick={exportLogs}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }}
          >
            <Download size={18} />
            Exporter
          </button>

          {/* Clear Button */}
          <button
            onClick={clearLogs}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
            }}
          >
            <Trash2 size={18} />
            Effacer
          </button>
        </div>

        {/* Logs Container */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          height: '600px',
          overflowY: 'auto'
        }}>
          {filteredLogs.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#9ca3af',
              fontSize: '18px'
            }}>
              <Info size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
              <p>Aucun log à afficher</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '18px',
                    borderLeft: `5px solid ${getLogColor(log.level)}`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fafbff';
                    e.currentTarget.style.transform = 'translateX(8px) translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 12px 32px ${getLogColor(log.level)}20, 0 4px 8px rgba(0, 0, 0, 0.1)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.transform = 'translateX(0) translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '15px'
                  }}>
                    <div style={{
                      color: getLogColor(log.level),
                      marginTop: '2px'
                    }}>
                      {getLogIcon(log.level)}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          color: '#6b7280',
                          fontSize: '13px',
                          fontFamily: 'monospace',
                          fontWeight: '500'
                        }}>
                          {formatTimestamp(log.timestamp)}
                        </span>
                        
                        <span style={{
                          background: `${getLogColor(log.level)}15`,
                          color: getLogColor(log.level),
                          padding: '4px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {log.level}
                        </span>
                        
                        <span style={{
                          background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                          color: '#374151',
                          padding: '4px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {log.source}
                        </span>
                      </div>
                      
                      <p style={{
                        margin: 0,
                        color: '#1f2937',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        fontWeight: '400'
                      }}>
                        {log.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>

        {/* Demo Buttons */}
        <div style={{
          marginTop: '20px',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => addLog('info', 'Nouvelle opération effectuée', 'System')}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }}
          >
            + Ajouter Info
          </button>
          <button
            onClick={() => addLog('success', 'Transaction terminée avec succès', 'API')}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
            }}
          >
            + Ajouter Succès
          </button>
          <button
            onClick={() => addLog('warning', 'Niveau de batterie faible', 'Hardware')}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
            }}
          >
            + Ajouter Warning
          </button>
          <button
            onClick={() => addLog('error', 'Échec de connexion au serveur', 'Network')}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
            }}
          >
            + Ajouter Erreur
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogViewer;
