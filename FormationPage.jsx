import React from 'react';
import Navbar from './Navbar';
import '../styles/portail.css';

/**
 * Page — Formation et Carrière
 * @param {string} imgElearning  image gauche (optionnel)
 * @param {string} imgAzure      image droite (optionnel)
 */
const FormationPage = ({ activeNav, onNavChange, imgElearning, imgAzure }) => (
  <div>
    <Navbar activeNav={activeNav} onNavChange={onNavChange} />
    <div className="page-full">
      <div className="page-full-header">
        <h1>Formation et Carrière</h1>
      </div>

      <div className="formation-grid">
        <div className="formation-tile">
          {imgElearning
            ? <img src={imgElearning} alt="E-learning" />
            : <div className="formation-tile-placeholder" />}
          <button className="formation-tile-btn">Accedez à votre espace E learning</button>
        </div>

        <div className="formation-tile">
          {imgAzure
            ? <img src={imgAzure} alt="Azure RH" />
            : <div className="formation-tile-placeholder" />}
          <button className="formation-tile-btn">Accedez à votre espace Azure RH</button>
        </div>
      </div>
    </div>
  </div>
);

export default FormationPage;
