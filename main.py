from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db, Participant, Question
import json
from datetime import datetime
import os

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///quiz_ux.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'votre-cle-secrete-ici'

# Extensions
db.init_app(app)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})  # Configuration CORS plus spécifique


# Routes API

@app.route('/api/questions', methods=['GET'])
def get_questions():
    """Récupère 20 questions aléatoirement sélectionnées pour le quiz"""
    import random

    # Récupérer toutes les questions actives
    all_questions = Question.query.filter_by(active=True).all()

    # Si moins de 20 questions disponibles, retourner toutes
    if len(all_questions) <= 20:
        selected_questions = all_questions
    else:
        # Sélectionner aléatoirement 20 questions parmi toutes
        selected_questions = random.sample(all_questions, 20)

    # Mélanger l'ordre des questions sélectionnées
    random.shuffle(selected_questions)

    print(f"📝 Quiz généré: {len(selected_questions)} questions sélectionnées aléatoirement")
    print(f"📊 Categories: {[q.categorie for q in selected_questions]}")

    return jsonify([q.to_dict() for q in selected_questions])


@app.route('/api/submit', methods=['POST'])
def submit_quiz():
    """Soumet les réponses du quiz et calcule le score avec gestion des pénalités"""
    data = request.get_json()

    if not data or 'nom' not in data or 'reponses' not in data:
        return jsonify({'error': 'Données manquantes'}), 400

    nom = data['nom']
    email = data.get('email', '')
    reponses = data['reponses']
    temps_total = data.get('temps_total', 0)
    penalites = data.get('penalites', 0)
    penalite_pourcentage = data.get('penalite_pourcentage', 0)
    changements_onglet = data.get('changements_onglet', 0)

    # Récupérer toutes les questions actives
    all_questions = Question.query.filter_by(active=True).all()
    questions_dict = {str(q.id): q for q in all_questions}

    # Séparer les questions normales, bonus et pièges
    questions_normales = []
    questions_bonus = []
    questions_pieges = []

    for question_id, reponse_utilisateur in reponses.items():
        if question_id in questions_dict:
            question = questions_dict[question_id]

            # Vérifier le type de question
            if hasattr(question, 'categorie') and question.categorie == 'Bonus Data':
                questions_bonus.append((question, reponse_utilisateur))
            elif hasattr(question, 'piege') and getattr(question, 'piege', False):
                questions_pieges.append((question, reponse_utilisateur))
            else:
                questions_normales.append((question, reponse_utilisateur))

    # Calculer le score sur les questions normales uniquement
    score = 0
    score_max = len(questions_normales)

    for question, reponse_utilisateur in questions_normales:
        reponses_correctes = json.loads(question.reponses_correctes)

        # Vérifier si la réponse est correcte
        if isinstance(reponse_utilisateur, list):
            # QCM - comparer les listes
            if sorted(reponse_utilisateur) == sorted(reponses_correctes):
                score += 1
        else:
            # QCU - comparer la valeur unique
            if reponse_utilisateur in reponses_correctes:
                score += 1

    pourcentage_base = (score / score_max) * 100 if score_max > 0 else 0

    # Analyser les questions bonus (pour évaluation qualitative)
    bonus_correct = 0
    for question, reponse_utilisateur in questions_bonus:
        reponses_correctes = json.loads(question.reponses_correctes)
        if isinstance(reponse_utilisateur, list):
            if sorted(reponse_utilisateur) == sorted(reponses_correctes):
                bonus_correct += 1
        else:
            if reponse_utilisateur in reponses_correctes:
                bonus_correct += 1

    # Analyser les questions pièges (détection de sur-confiance)
    pieges_evites = 0
    for question, reponse_utilisateur in questions_pieges:
        # Si aucune réponse donnée ou réponse vide, c'est bien (piège évité)
        if not reponse_utilisateur or reponse_utilisateur == [] or reponse_utilisateur == "":
            pieges_evites += 1

    # Appliquer les pénalités de surveillance
    pourcentage_final = max(0, pourcentage_base - penalite_pourcentage)

    # Sauvegarder dans la base de données avec informations de surveillance
    participant = Participant(
        nom=nom,
        email=email,
        score=score,
        score_max=score_max,
        pourcentage=pourcentage_final,  # Score final avec pénalités
        reponses=json.dumps(reponses),
        temps_total=temps_total,
        penalites=penalites,
        penalite_pourcentage=penalite_pourcentage,
        changements_onglet=changements_onglet,
        surveillance_active=True
    )

    try:
        db.session.add(participant)
        db.session.commit()

        return jsonify({
            'success': True,
            'score': score,
            'score_max': score_max,
            'pourcentage_base': round(pourcentage_base, 2),
            'penalites_surveillance': penalites,
            'penalite_pourcentage': penalite_pourcentage,
            'pourcentage': round(pourcentage_final, 2),
            'participant_id': participant.id,
            # Informations bonus pour évaluation qualitative
            'bonus_info': {
                'questions_bonus': len(questions_bonus),
                'bonus_correct': bonus_correct,
                'questions_pieges': len(questions_pieges),
                'pieges_evites': pieges_evites
            },
            'surveillance_info': {
                'changements_onglet': changements_onglet,
                'violations_totales': penalites
            }
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Erreur lors de la sauvegarde'}), 500


@app.route('/api/admin/participants', methods=['GET'])
def get_participants():
    """Interface admin - récupère tous les participants"""
    participants = Participant.query.order_by(Participant.date_creation.desc()).all()
    return jsonify([p.to_dict() for p in participants])


@app.route('/api/admin/participant/<int:participant_id>', methods=['GET'])
def get_participant_detail(participant_id):
    """Interface admin - détails d'un participant"""
    participant = Participant.query.get_or_404(participant_id)
    return jsonify(participant.to_dict())


@app.route('/api/admin/stats', methods=['GET'])
def get_stats():
    """Interface admin - statistiques générales"""
    total_participants = Participant.query.count()

    if total_participants == 0:
        return jsonify({
            'total_participants': 0,
            'score_moyen': 0,
            'meilleur_score': 0,
            'taux_reussite': 0
        })

    participants = Participant.query.all()
    scores = [p.pourcentage for p in participants]

    score_moyen = sum(scores) / len(scores)
    meilleur_score = max(scores)
    taux_reussite = len([s for s in scores if s >= 70]) / len(scores) * 100

    return jsonify({
        'total_participants': total_participants,
        'score_moyen': round(score_moyen, 2),
        'meilleur_score': round(meilleur_score, 2),
        'taux_reussite': round(taux_reussite, 2)
    })


def init_db():
    """Initialise la base de données avec un pool de questions modérées pour UX Designer intermédiaire"""
    db.create_all()

    # Vérifier si des questions existent déjà
    if Question.query.count() > 0:
        return

    # POOL DE 40 QUESTIONS MODÉRÉES pour UX Designer Intermédiaire
    # 20 questions seront sélectionnées aléatoirement par participant
    # + Questions pièges (sans bonne réponse) + 1 Question bonus Data
    questions_pool = [
        # OUTILS UX/UI (Questions 1-10)
        {
            'texte': 'Quels sont les outils les plus utilisés pour le design d\'interface en 2024 ?',
            'type': 'QCM',
            'options': [
                'Figma',
                'Sketch',
                'Adobe XD',
                'Photoshop',
                'PowerPoint',
                'Canva'
            ],
            'reponses_correctes': [0, 1, 2],
            'categorie': 'Outils Design',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Quelle est la différence principale entre Figma et Sketch ?',
            'type': 'QCU',
            'options': [
                'Figma est gratuit, Sketch est payant',
                'Figma fonctionne dans le navigateur, Sketch est une app Mac',
                'Figma est pour mobile, Sketch pour desktop',
                'Il n\'y a pas de différence'
            ],
            'reponses_correctes': [1],
            'categorie': 'Outils Design',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Dans Figma, à quoi servent les "Components" ?',
            'type': 'QCU',
            'options': [
                'À créer des éléments réutilisables',
                'À exporter des images',
                'À partager des fichiers',
                'À faire des animations'
            ],
            'reponses_correctes': [0],
            'categorie': 'Outils Design',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Quels outils permettent de créer des prototypes interactifs ?',
            'type': 'QCM',
            'options': [
                'Figma',
                'Adobe XD',
                'InVision',
                'Marvel',
                'Word',
                'Excel'
            ],
            'reponses_correctes': [0, 1, 2, 3],
            'categorie': 'Prototypage',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Que signifie "Auto Layout" dans Figma ?',
            'type': 'QCU',
            'options': [
                'Placement automatique des éléments qui s\'adaptent au contenu',
                'Création automatique de pages',
                'Export automatique des assets',
                'Sauvegarde automatique du fichier'
            ],
            'reponses_correctes': [0],
            'categorie': 'Outils Design',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Quels formats d\'export sont essentiels pour un UX Designer ?',
            'type': 'QCM',
            'options': [
                'PNG (pour les images)',
                'SVG (pour les icônes)',
                'PDF (pour la documentation)',
                'JPG (pour les photos)',
                'GIF (pour les animations)',
                'DOC (pour les textes)'
            ],
            'reponses_correctes': [0, 1, 2, 3, 4],
            'categorie': 'Outils Design',
            'difficulte': 'moyen'
        },
        {
            'texte': 'À quoi sert Zeplin dans un workflow UX/UI ?',
            'type': 'QCU',
            'options': [
                'Créer des designs',
                'Faciliter la collaboration design-développement',
                'Faire des tests utilisateur',
                'Gérer les versions'
            ],
            'reponses_correctes': [1],
            'categorie': 'Workflow',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Quels sont les avantages des outils cloud comme Figma ?',
            'type': 'QCM',
            'options': [
                'Collaboration en temps réel',
                'Accès depuis n\'importe quel appareil',
                'Versioning automatique',
                'Commentaires intégrés',
                'Installation sur tous les OS',
                'Plus cher que les alternatives'
            ],
            'reponses_correctes': [0, 1, 2, 3, 4],
            'categorie': 'Outils Design',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Que permet de faire le plugin "Content Reel" dans Figma ?',
            'type': 'QCU',
            'options': [
                'Ajouter du contenu réaliste (textes, images)',
                'Créer des animations',
                'Exporter du code',
                'Faire des mesures'
            ],
            'reponses_correctes': [0],
            'categorie': 'Outils Design',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Quels outils utilisez-vous pour créer un moodboard ?',
            'type': 'QCM',
            'options': [
                'Pinterest',
                'Milanote',
                'Figma',
                'Adobe Creative Suite',
                'Excel',
                'Miro'
            ],
            'reponses_correctes': [0, 1, 2, 3, 5],
            'categorie': 'Recherche Design',
            'difficulte': 'moyen'
        },

        # WIREFRAMES & PROTOTYPES (Questions 11-15)
        {
            'texte': 'Quelle est la différence entre wireframe et mockup ?',
            'type': 'QCU',
            'options': [
                'Wireframe = structure, Mockup = design visuel',
                'Wireframe = mobile, Mockup = desktop',
                'Wireframe = gratuit, Mockup = payant',
                'Il n\'y a pas de différence'
            ],
            'reponses_correctes': [0],
            'categorie': 'Wireframing',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Quand créer des wireframes low-fidelity vs high-fidelity ?',
            'type': 'QCU',
            'options': [
                'Low-fi en début de projet, High-fi avant développement',
                'Low-fi pour mobile, High-fi pour desktop',
                'Low-fi pour clients, High-fi pour développeurs',
                'Toujours utiliser High-fi'
            ],
            'reponses_correctes': [0],
            'categorie': 'Wireframing',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Que doit contenir un wireframe efficace ?',
            'type': 'QCM',
            'options': [
                'Structure et hiérarchie du contenu',
                'Navigation principale',
                'Zones de contenu principales',
                'Couleurs définitives',
                'Typographies exactes',
                'Interactions de base'
            ],
            'reponses_correctes': [0, 1, 2, 5],
            'categorie': 'Wireframing',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Quel est l\'objectif principal d\'un prototype ?',
            'type': 'QCU',
            'options': [
                'Tester les interactions et le flow utilisateur',
                'Montrer les couleurs finales',
                'Remplacer la documentation',
                'Impressionner le client'
            ],
            'reponses_correctes': [0],
            'categorie': 'Prototypage',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Quels types de prototypes existe-t-il ?',
            'type': 'QCM',
            'options': [
                'Prototype papier',
                'Prototype interactif',
                'Prototype codé',
                'Prototype vidéo',
                'Prototype audio',
                'Prototype 3D'
            ],
            'reponses_correctes': [0, 1, 2, 3],
            'categorie': 'Prototypage',
            'difficulte': 'moyen'
        },

        # PROCESSUS UX (Questions 16-25)
        {
            'texte': 'Quelles sont les étapes principales du processus UX ?',
            'type': 'QCM',
            'options': [
                'Recherche utilisateur',
                'Définition du problème',
                'Idéation',
                'Prototypage',
                'Tests utilisateur',
                'Développement backend'
            ],
            'reponses_correctes': [0, 1, 2, 3, 4],
            'categorie': 'Processus UX',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Qu\'est-ce qu\'un persona en UX Design ?',
            'type': 'QCU',
            'options': [
                'Un profil fictif représentant un groupe d\'utilisateurs cibles',
                'Un membre de l\'équipe de développement',
                'Un concurrent sur le marché',
                'Un outil de design'
            ],
            'reponses_correctes': [0],
            'categorie': 'Recherche UX',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Comment créer des personas efficaces ?',
            'type': 'QCM',
            'options': [
                'Basé sur des données utilisateur réelles',
                'Inclure objectifs et frustrations',
                'Donner un nom et une photo',
                'Rester simple et mémorable',
                'Créer 20-30 personas différents',
                'Copier ceux des concurrents'
            ],
            'reponses_correctes': [0, 1, 2, 3],
            'categorie': 'Recherche UX',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Qu\'est-ce qu\'un user journey map ?',
            'type': 'QCU',
            'options': [
                'Une carte géographique des utilisateurs',
                'Le parcours utilisateur avec ses émotions et points de contact',
                'Un planning de projet',
                'Une carte mentale des fonctionnalités'
            ],
            'reponses_correctes': [1],
            'categorie': 'UX Strategy',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Quand utiliser la méthode "Crazy 8" ?',
            'type': 'QCU',
            'options': [
                'Pour générer rapidement 8 idées en 8 minutes',
                'Pour tester 8 utilisateurs',
                'Pour créer 8 personas',
                'Pour analyser 8 concurrents'
            ],
            'reponses_correctes': [0],
            'categorie': 'Idéation',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Qu\'est-ce que l\'architecture de l\'information ?',
            'type': 'QCU',
            'options': [
                'L\'organisation et la structure du contenu',
                'Le code de l\'application',
                'Le design visuel',
                'La stratégie marketing'
            ],
            'reponses_correctes': [0],
            'categorie': 'Architecture Info',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Quelles méthodes pour organiser l\'information ?',
            'type': 'QCM',
            'options': [
                'Card sorting',
                'Tree testing',
                'Site map',
                'User flow',
                'Color palette',
                'Typography scale'
            ],
            'reponses_correctes': [0, 1, 2, 3],
            'categorie': 'Architecture Info',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Qu\'est-ce qu\'un MVP (Minimum Viable Product) ?',
            'type': 'QCU',
            'options': [
                'La version minimale d\'un produit pour tester une hypothèse',
                'Le produit le moins cher possible',
                'Un prototype non-fonctionnel',
                'La version finale simplifiée'
            ],
            'reponses_correctes': [0],
            'categorie': 'Product Strategy',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Comment prioriser les fonctionnalités d\'un produit ?',
            'type': 'QCM',
            'options': [
                'Matrice Impact/Effort',
                'MoSCoW (Must/Should/Could/Won\'t)',
                'User story mapping',
                'Kano model',
                'Choix du CEO uniquement',
                'Vote de l\'équipe'
            ],
            'reponses_correctes': [0, 1, 2, 3],
            'categorie': 'Product Strategy',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Qu\'est-ce qu\'un "Design Sprint" ?',
            'type': 'QCU',
            'options': [
                'Un processus de 5 jours pour résoudre un problème design',
                'Une course de vitesse entre designers',
                'Un marathon de 24h de design',
                'Un outil de gestion de projet'
            ],
            'reponses_correctes': [0],
            'categorie': 'Méthodologie',
            'difficulte': 'moyen'
        },

        # TESTS UTILISATEUR (Questions 26-30)
        {
            'texte': 'Combien d\'utilisateurs pour un test d\'utilisabilité qualitatif ?',
            'type': 'QCU',
            'options': [
                '3-5 utilisateurs',
                '5-8 utilisateurs',
                '10-15 utilisateurs',
                '50+ utilisateurs'
            ],
            'reponses_correctes': [1],
            'categorie': 'Tests UX',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Quels types de tests utilisateur existe-t-il ?',
            'type': 'QCM',
            'options': [
                'Tests modérés (avec facilitateur)',
                'Tests non-modérés (automatiques)',
                'Tests en présentiel',
                'Tests à distance',
                'Tests gratuits',
                'Tests A/B'
            ],
            'reponses_correctes': [0, 1, 2, 3, 5],
            'categorie': 'Tests UX',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Que mesure un test d\'utilisabilité ?',
            'type': 'QCM',
            'options': [
                'Taux de réussite des tâches',
                'Temps pour accomplir une tâche',
                'Satisfaction utilisateur',
                'Nombre d\'erreurs',
                'Couleurs préférées',
                'Salaire des utilisateurs'
            ],
            'reponses_correctes': [0, 1, 2, 3],
            'categorie': 'Tests UX',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Qu\'est-ce qu\'un test A/B ?',
            'type': 'QCU',
            'options': [
                'Comparer deux versions pour voir laquelle performe mieux',
                'Tester sur Android vs iOS',
                'Tester le matin vs le soir',
                'Tester avec 2 utilisateurs'
            ],
            'reponses_correctes': [0],
            'categorie': 'Tests UX',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Quels outils pour les tests utilisateur à distance ?',
            'type': 'QCM',
            'options': [
                'Zoom',
                'UserTesting.com',
                'Hotjar',
                'Maze',
                'Photoshop',
                'Lookback'
            ],
            'reponses_correctes': [0, 1, 2, 3, 5],
            'categorie': 'Tests UX',
            'difficulte': 'moyen'
        },

        # UI DESIGN (Questions 31-35)
        {
            'texte': 'Quels sont les principes de base du design visuel ?',
            'type': 'QCM',
            'options': [
                'Hiérarchie visuelle',
                'Contraste',
                'Alignement',
                'Répétition',
                'Proximité',
                'Couleur unique'
            ],
            'reponses_correctes': [0, 1, 2, 3, 4],
            'categorie': 'UI Design',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Comment créer une bonne hiérarchie typographique ?',
            'type': 'QCM',
            'options': [
                'Utiliser différentes tailles de police',
                'Jouer sur les graisses (bold, regular)',
                'Varier les couleurs',
                'Utiliser l\'espacement',
                'Utiliser 10 polices différentes',
                'Tout écrire en majuscules'
            ],
            'reponses_correctes': [0, 1, 2, 3],
            'categorie': 'UI Design',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Qu\'est-ce qu\'une grille de mise en page (Grid System) ?',
            'type': 'QCU',
            'options': [
                'Un système pour aligner et organiser les éléments',
                'Un tableur Excel',
                'Un type de graphique',
                'Une méthode de test'
            ],
            'reponses_correctes': [0],
            'categorie': 'UI Design',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Quelles sont les règles d\'accessibilité pour les couleurs ?',
            'type': 'QCM',
            'options': [
                'Contraste minimum 4.5:1 pour le texte normal',
                'Contraste minimum 3:1 pour le texte large',
                'Ne pas utiliser uniquement la couleur pour l\'information',
                'Tester avec des simulateurs de daltonisme',
                'Utiliser uniquement des couleurs vives',
                'Éviter le noir et blanc'
            ],
            'reponses_correctes': [0, 1, 2, 3],
            'categorie': 'Accessibilité',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Qu\'est-ce qu\'un "Design System" ?',
            'type': 'QCU',
            'options': [
                'Un ensemble d\'éléments réutilisables et de règles de design',
                'Un logiciel de design',
                'Une méthode de travail',
                'Un type de prototype'
            ],
            'reponses_correctes': [0],
            'categorie': 'Design System',
            'difficulte': 'moyen'
        },

        # ANALYTICS & MÉTRIQUES (Questions 36-40)
        {
            'texte': 'Quelles métriques UX surveiller pour un site web ?',
            'type': 'QCM',
            'options': [
                'Taux de rebond',
                'Temps passé sur la page',
                'Taux de conversion',
                'Parcours utilisateur',
                'Nombre de pages vues',
                'Couleur favorite'
            ],
            'reponses_correctes': [0, 1, 2, 3, 4],
            'categorie': 'Analytics UX',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Qu\'est-ce que Google Analytics peut vous apprendre sur vos utilisateurs ?',
            'type': 'QCM',
            'options': [
                'Pages les plus visitées',
                'Temps passé sur le site',
                'Provenance du trafic',
                'Appareils utilisés',
                'Mots de passe des utilisateurs',
                'Parcours de navigation'
            ],
            'reponses_correctes': [0, 1, 2, 3, 5],
            'categorie': 'Analytics',
            'difficulte': 'moyen'
        },
        {
            'texte': 'À quoi sert une heatmap (carte de chaleur) ?',
            'type': 'QCU',
            'options': [
                'Voir où les utilisateurs cliquent et scrollent',
                'Mesurer la température des ordinateurs',
                'Analyser les couleurs du site',
                'Tester la vitesse de connexion'
            ],
            'reponses_correctes': [0],
            'categorie': 'Analytics UX',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Comment mesurer la satisfaction utilisateur ?',
            'type': 'QCM',
            'options': [
                'Net Promoter Score (NPS)',
                'Customer Satisfaction Score (CSAT)',
                'System Usability Scale (SUS)',
                'Enquêtes post-utilisation',
                'Nombre de likes sur les réseaux',
                'Entretiens utilisateur'
            ],
            'reponses_correctes': [0, 1, 2, 3, 5],
            'categorie': 'Métriques UX',
            'difficulte': 'moyen'
        },
        {
            'texte': 'Qu\'est-ce qu\'un funnel de conversion ?',
            'type': 'QCU',
            'options': [
                'Le parcours utilisateur de la découverte à l\'achat',
                'Un outil de design',
                'Une technique de test',
                'Un type de graphique'
            ],
            'reponses_correctes': [0],
            'categorie': 'Conversion',
            'difficulte': 'moyen'
        },

        # QUESTIONS PIÈGES (sans bonne réponse) - Questions 41-45
        {
            'texte': 'Quel est le meilleur outil de design pour tous les projets ?',
            'type': 'QCU',
            'options': [
                'Figma est toujours le meilleur choix',
                'Sketch surpasse tous les autres outils',
                'Adobe XD est supérieur dans tous les cas',
                'Photoshop suffit pour tout type de design'
            ],
            'reponses_correctes': [],  # Aucune bonne réponse - piège
            'categorie': 'Outils Design',
            'difficulte': 'moyen',
            'piege': True
        },
        {
            'texte': 'Combien de temps faut-il EXACTEMENT pour terminer un projet UX ?',
            'type': 'QCU',
            'options': [
                'Toujours 2 semaines',
                'Exactement 1 mois',
                'Précisément 6 semaines',
                'Invariablement 3 mois'
            ],
            'reponses_correctes': [],  # Aucune bonne réponse - dépend du projet
            'categorie': 'Processus UX',
            'difficulte': 'moyen',
            'piege': True
        },
        {
            'texte': 'Quelle couleur garantit toujours le meilleur taux de conversion ?',
            'type': 'QCU',
            'options': [
                'Le rouge augmente toujours les conversions',
                'Le bleu est universellement performant',
                'Le vert garantit le succès commercial',
                'L\'orange optimise automatiquement les ventes'
            ],
            'reponses_correctes': [],  # Aucune bonne réponse - dépend du contexte
            'categorie': 'UI Design',
            'difficulte': 'moyen',
            'piege': True
        },
        {
            'texte': 'Quel pourcentage d\'utilisateurs permet d\'avoir des résultats parfaits en test UX ?',
            'type': 'QCU',
            'options': [
                'Exactement 47% d\'utilisateurs',
                'Précisément 73% d\'utilisateurs',
                'Toujours 89% d\'utilisateurs',
                'Invariablement 92% d\'utilisateurs'
            ],
            'reponses_correctes': [],  # Aucune bonne réponse - pourcentages inventés
            'categorie': 'Tests UX',
            'difficulte': 'moyen',
            'piege': True
        },
        {
            'texte': 'Quelle police de caractère doit être utilisée dans TOUS les projets web ?',
            'type': 'QCU',
            'options': [
                'Arial est obligatoire pour tous les sites',
                'Comic Sans MS optimise toujours l\'expérience',
                'Times New Roman est universellement efficace',
                'Helvetica garantit le succès de tout projet'
            ],
            'reponses_correctes': [],  # Aucune bonne réponse - dépend du projet
            'categorie': 'UI Design',
            'difficulte': 'moyen',
            'piege': True
        },

        # QUESTION BONUS DATA (Question 46) - Non comptée dans le score
        {
            'texte': 'Dans une analyse de cohorte avancée, comment interpréter une "retention curve" qui montre une chute de 73% la première semaine, suivie d\'une stabilisation à 12% après 6 mois, avec un coefficient de variation de 0.34 sur les segments premium ?',
            'type': 'QCU',
            'options': [
                'Problème d\'onboarding critique avec segment premium résilient nécessitant optimisation UX',
                'Pattern normal avec opportunité de ré-engagement ciblé sur la première semaine',
                'Courbe d\'adoption standard pour produits freemium avec stabilisation acceptable',
                'Défaillance du product-market fit nécessitant une refonte complète de l\'expérience'
            ],
            'reponses_correctes': [0],
            'categorie': 'Bonus Data',
            'difficulte': 'difficile',
            'bonus': True
        },

        # QUESTION SÉLECTIVE DATA (Question 47) - Évaluation qualitative
        {
            'texte': 'Vous analysez des données d\'un dashboard e-commerce : CTR emails 2.3%, taux conversion 1.8%, LTV $250, CAC $45. Le funnel montre 65% d\'abandon au checkout. Quelle action prioriser pour maximiser le ROI ?',
            'type': 'QCU',
            'options': [
                'Optimiser le processus de checkout pour réduire l\'abandon',
                'Augmenter le budget marketing pour améliorer le CTR',
                'Développer un programme de fidélisation pour augmenter la LTV',
                'Implémenter un système de recommandations personnalisées'
            ],
            'reponses_correctes': [0],
            'categorie': 'Selective Data',
            'difficulte': 'difficile',
            'selective': True
        }
    ]

    for q_data in questions_pool:
        question = Question(
            texte=q_data['texte'],
            type=q_data['type'],
            options=json.dumps(q_data['options']),
            reponses_correctes=json.dumps(q_data['reponses_correctes']),
            categorie=q_data['categorie'],
            difficulte=q_data['difficulte']
        )
        db.session.add(question)

    db.session.commit()
    print("Base de données initialisée avec 40 questions modérées UX/UI pour niveau intermédiaire")


if __name__ == '__main__':
    with app.app_context():
        init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)