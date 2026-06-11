import React from 'react';
import '../styles/portail.css';

const Navbar = ({ activeNav, onNavChange }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* Logo SG stylisé */}
        <div className="navbar-logo">
          <div style={{
            width: 28,
            height: 28,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: 18,
              height: 18,
              background: '#cc0000',
              clipPath: 'polygon(0 0, 55% 0, 100% 50%, 55% 100%, 0 100%, 45% 50%)',
            }} />
          </div>
        </div>
        <span className="navbar-title">Portail RH</span>
      </div>

      <div className="navbar-nav">
        {['Accueil', 'Dashboard', 'Formation et Carrière', 'Contactez les RH'].map(item => (
          <button
            key={item}
            className={`navbar-link ${activeNav === item ? 'active' : ''}`}
            onClick={() => onNavChange && onNavChange(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="navbar-icons">
        {/* Cloche notif */}
        <button className="navbar-icon-btn">
          🔔
          <span className="notif-badge">6</span>
        </button>
        {/* Paramètres */}
        <button className="navbar-icon-btn">⚙️</button>
        {/* Aide */}
        <button className="navbar-icon-btn">❓</button>
        {/* Apps */}
        <button className="navbar-icon-btn">⊞</button>
      </div>

      <div className="navbar-user">
        <div className="navbar-user-avatar">👤</div>
        <div className="navbar-user-info">
          <span className="navbar-user-name">Lambertin Isidorin</span>
          <button className="navbar-user-logout">Déconnexion</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
