from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()


class Participant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=True)
    date_creation = db.Column(db.DateTime, default=datetime.utcnow)
    score = db.Column(db.Integer, nullable=False)
    score_max = db.Column(db.Integer, nullable=False)
    pourcentage = db.Column(db.Float, nullable=False)
    reponses = db.Column(db.Text, nullable=False)  # JSON string des réponses
    temps_total = db.Column(db.Integer, nullable=True)  # en secondes

    # Nouveaux champs pour la surveillance
    penalites = db.Column(db.Integer, default=0)  # Nombre de violations
    penalite_pourcentage = db.Column(db.Float, default=0.0)  # Pourcentage de pénalité
    changements_onglet = db.Column(db.Integer, default=0)  # Nombre de changements d'onglet
    surveillance_active = db.Column(db.Boolean, default=True)  # Si surveillance était active

    def __repr__(self):
        return f'<Participant {self.nom}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nom': self.nom,
            'email': self.email,
            'date_creation': self.date_creation.isoformat(),
            'score': self.score,
            'score_max': self.score_max,
            'pourcentage': self.pourcentage,
            'reponses': json.loads(self.reponses),
            'temps_total': self.temps_total,
            'penalites': self.penalites,
            'penalite_pourcentage': self.penalite_pourcentage,
            'changements_onglet': self.changements_onglet,
            'surveillance_active': self.surveillance_active
        }


class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    texte = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(10), nullable=False)  # 'QCM' ou 'QCU'
    options = db.Column(db.Text, nullable=False)  # JSON string des options
    reponses_correctes = db.Column(db.Text, nullable=False)  # JSON string des bonnes réponses
    categorie = db.Column(db.String(50), nullable=True)
    difficulte = db.Column(db.String(20), default='moyen')
    active = db.Column(db.Boolean, default=True)

    def __repr__(self):
        return f'<Question {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'texte': self.texte,
            'type': self.type,
            'options': json.loads(self.options),
            'reponses_correctes': json.loads(self.reponses_correctes),
            'categorie': self.categorie,
            'difficulte': self.difficulte
        }