from database import app, db, Question, QuestionOption

def add_complete_questions():
    """Ajoute toutes les questions du quiz UX"""
    
    questions_data = [
        {
            'question_text': "Quelles méthodes font partie de la recherche utilisateur ?",
            'question_type': 'qcm',
            'explanation': "Les interviews, tests, personas et sondages sont des méthodes de recherche utilisateur.",
            'category': 'recherche',
            'difficulty_level': 'intermediate',
            'options': [
                {'text': "Interviews utilisateurs", 'is_correct': True},
                {'text': "Tests d'utilisabilité", 'is_correct': True},
                {'text': "Choix des couleurs", 'is_correct': False},
                {'text': "Personas", 'is_correct': True},
                {'text': "Sondages", 'is_correct': True}
            ]
        },
        {
            'question_text': "Qu'est-ce qu'un persona en UX ?",
            'question_type': 'qcu',
            'explanation': "Un persona est un archétype fictif représentant un groupe d'utilisateurs réels.",
            'category': 'recherche',
            'difficulty_level': 'beginner',
            'options': [
                {'text': "Un vrai utilisateur du produit", 'is_correct': False},
                {'text': "Un archétype d'utilisateur basé sur des recherches", 'is_correct': True},
                {'text': "Un designer de l'équipe", 'is_correct': False},
                {'text': "Un testeur QA", 'is_correct': False}
            ]
        },
        {
            'question_text': "Quels principes guident un bon design d'interface ?",
            'question_type': 'qcm',
            'explanation': "La consistance, le feedback, la hiérarchie et la prévention d'erreurs sont essentiels.",
            'category': 'design',
            'difficulty_level': 'intermediate',
            'options': [
                {'text': "Consistance", 'is_correct': True},
                {'text': "Feedback utilisateur", 'is_correct': True},
                {'text': "Complexité maximale", 'is_correct': False},
                {'text': "Hiérarchie visuelle", 'is_correct': True},
                {'text': "Prévention des erreurs", 'is_correct': True}
            ]
        },
        {
            'question_text': "Que teste un test A/B ?",
            'question_type': 'qcu',
            'explanation': "Un test A/B compare deux versions pour mesurer leur efficacité relative.",
            'category': 'methodes',
            'difficulty_level': 'intermediate',
            'options': [
                {'text': "La performance technique", 'is_correct': False},
                {'text': "Deux versions d'un élément pour voir laquelle performe mieux", 'is_correct': True},
                {'text': "La sécurité de l'application", 'is_correct': False},
                {'text': "La compatibilité navigateur", 'is_correct': False}
            ]
        },
        {
            'question_text': "Quels outils sont couramment utilisés en UX Design ?",
            'question_type': 'qcm',
            'explanation': "Figma, Sketch, Adobe XD et Miro sont des outils UX populaires.",
            'category': 'outils',
            'difficulty_level': 'beginner',
            'options': [
                {'text': "Figma", 'is_correct': True},
                {'text': "Sketch", 'is_correct': True},
                {'text': "Microsoft Word", 'is_correct': False},
                {'text': "Adobe XD", 'is_correct': True},
                {'text': "Miro", 'is_correct': True}
            ]
        },
        {
            'question_text': "Qu'est-ce que l'affordance en design ?",
            'question_type': 'qcu',
            'explanation': "L'affordance est la capacité d'un objet à suggérer intuitivement son usage.",
            'category': 'design',
            'difficulty_level': 'advanced',
            'options': [
                {'text': "Le prix d'un produit", 'is_correct': False},
                {'text': "La capacité d'un objet à suggérer sa propre utilisation", 'is_correct': True},
                {'text': "La rapidité d'exécution", 'is_correct': False},
                {'text': "La beauté esthétique", 'is_correct': False}
            ]
        },
        {
            'question_text': "Quelles phases composent le processus de Design Thinking ?",
            'question_type': 'qcm',
            'explanation': "Les phases sont : Empathie, Définition, Idéation, Prototype et Test.",
            'category': 'methodes',
            'difficulty_level': 'intermediate',
            'options': [
                {'text': "Empathie", 'is_correct': True},
                {'text': "Définition", 'is_correct': True},
                {'text': "Décoration", 'is_correct': False},
                {'text': "Idéation", 'is_correct': True},
                {'text': "Prototype et Test", 'is_correct': True}
            ]
        },
        {
            'question_text': "Qu'est-ce que l'accessibilité web ?",
            'question_type': 'qcu',
            'explanation': "L'accessibilité web consiste à rendre les sites utilisables par tous, y compris les personnes handicapées.",
            'category': 'accessibilite',
            'difficulty_level': 'intermediate',
            'options': [
                {'text': "La rapidité de chargement des pages", 'is_correct': False},
                {'text': "La capacité d'un site à être utilisé par tous, y compris les personnes handicapées", 'is_correct': True},
                {'text': "La compatibilité mobile", 'is_correct': False},
                {'text': "La sécurité des données", 'is_correct': False}
            ]
        },
        {
            'question_text': "Quels sont les principes WCAG pour l'accessibilité ?",
            'question_type': 'qcm',
            'explanation': "Les 4 principes WCAG sont : Perceptible, Utilisable, Compréhensible et Robuste.",
            'category': 'accessibilite',
            'difficulty_level': 'advanced',
            'options': [
                {'text': "Perceptible", 'is_correct': True},
                {'text': "Utilisable", 'is_correct': True},
                {'text': "Esthétique", 'is_correct': False},
                {'text': "Compréhensible", 'is_correct': True},
                {'text': "Robuste", 'is_correct': True}
            ]
        },
        {
            'question_text': "Que signifie MVP en développement produit ?",
            'question_type': 'qcu',
            'explanation': "MVP signifie Minimum Viable Product - la version minimale d'un produit avec les fonctionnalités essentielles.",
            'category': 'methodes',
            'difficulty_level': 'intermediate',
            'options': [
                {'text': "Most Valuable Player", 'is_correct': False},
                {'text': "Minimum Viable Product", 'is_correct': True},
                {'text': "Maximum Visual Prototype", 'is_correct': False},
                {'text': "Multi-Version Platform", 'is_correct': False}
            ]
        }
    ]
    
    with app.app_context():
        # Supprimer les anciennes questions si on veut recommencer
        # Question.query.delete()
        # QuestionOption.query.delete()
        
        for q_data in questions_data:
            # Vérifier si la question existe déjà
            existing = Question.query.filter_by(question_text=q_data['question_text']).first()
            if existing:
                print(f"Question déjà existante: {q_data['question_text'][:50]}...")
                continue
                
            question = Question(
                question_text=q_data['question_text'],
                question_type=q_data['question_type'],
                explanation=q_data['explanation'],
                category=q_data['category'],
                difficulty_level=q_data['difficulty_level']
            )
            db.session.add(question)
            db.session.flush()  # Pour obtenir l'ID
            
            # Ajouter les options
            for i, option_data in enumerate(q_data['options']):
                option = QuestionOption(
                    question_id=question.id,
                    option_text=option_data['text'],
                    is_correct=option_data['is_correct'],
                    option_order=i
                )
                db.session.add(option)
            
            print(f"✅ Ajoutée: {q_data['question_text'][:50]}...")
        
        db.session.commit()
        
        # Afficher les statistiques
        total_questions = Question.query.count()
        by_category = db.session.query(Question.category, db.func.count(Question.id)).group_by(Question.category).all()
        by_difficulty = db.session.query(Question.difficulty_level, db.func.count(Question.id)).group_by(Question.difficulty_level).all()
        
        print(f"\n📊 Statistiques de la base de données:")
        print(f"   Total questions: {total_questions}")
        print(f"   Par catégorie: {dict(by_category)}")
        print(f"   Par difficulté: {dict(by_difficulty)}")

if __name__ == '__main__':
    print("📝 Ajout des questions complètes au quiz UX...")
    add_complete_questions()
    print("🎉 Questions ajoutées avec succès!")
