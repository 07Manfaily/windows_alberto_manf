#!/usr/bin/env python3
"""
Script de gestion de la base de données Quiz UX
Permet de visualiser, nettoyer et gérer les données
"""

from database import app, db, Question, QuestionOption, QuizSession, QuizResponse
import sys
from datetime import datetime

def show_database_stats():
    """Affiche les statistiques de la base de données"""
    with app.app_context():
        questions_count = Question.query.count()
        active_questions = Question.query.filter_by(is_active=True).count()
        sessions_count = QuizSession.query.count()
        completed_sessions = QuizSession.query.filter_by(is_completed=True).count()
        responses_count = QuizResponse.query.count()
        
        print("📊 Statistiques de la Base de Données")
        print("=" * 40)
        print(f"Questions totales: {questions_count}")
        print(f"Questions actives: {active_questions}")
        print(f"Sessions totales: {sessions_count}")
        print(f"Sessions complétées: {completed_sessions}")
        print(f"Réponses enregistrées: {responses_count}")
        
        if completed_sessions > 0:
            avg_score = db.session.query(db.func.avg(QuizSession.percentage_score)).filter_by(is_completed=True).scalar()
            print(f"Score moyen: {avg_score:.1f}%")
        
        # Statistiques par catégorie
        print("\n📚 Questions par catégorie:")
        categories = db.session.query(
            Question.category, 
            db.func.count(Question.id)
        ).group_by(Question.category).all()
        
        for category, count in categories:
            print(f"  - {category}: {count}")
        
        # Statistiques par difficulté
        print("\n⭐ Questions par difficulté:")
        difficulties = db.session.query(
            Question.difficulty_level, 
            db.func.count(Question.id)
        ).group_by(Question.difficulty_level).all()
        
        for difficulty, count in difficulties:
            print(f"  - {difficulty}: {count}")

def show_questions():
    """Affiche toutes les questions"""
    with app.app_context():
        questions = Question.query.all()
        
        print("📝 Liste des Questions")
        print("=" * 50)
        
        for i, question in enumerate(questions, 1):
            status = "✅" if question.is_active else "❌"
            print(f"\n{i}. {status} [ID: {question.id}] [{question.category.upper()}] [{question.difficulty_level}]")
            print(f"   {question.question_text}")
            print(f"   Type: {question.question_type.upper()}")
            
            options = QuestionOption.query.filter_by(question_id=question.id).order_by(QuestionOption.option_order).all()
            for j, option in enumerate(options):
                marker = "🟢" if option.is_correct else "⚪"
                print(f"   {chr(97+j)}) {marker} {option.option_text}")
            
            if question.explanation:
                print(f"   💡 {question.explanation}")

def show_recent_sessions(limit=10):
    """Affiche les sessions récentes"""
    with app.app_context():
        sessions = QuizSession.query.order_by(QuizSession.started_at.desc()).limit(limit).all()
        
        print(f"🏆 {limit} Sessions Récentes")
        print("=" * 60)
        
        for session in sessions:
            status = "✅ Complété" if session.is_completed else "⏳ En cours"
            name = session.candidate_name or "Anonyme"
            
            print(f"\n[ID: {session.id}] {name}")
            print(f"  Démarré: {session.started_at.strftime('%Y-%m-%d %H:%M')}")
            
            if session.is_completed:
                print(f"  Terminé: {session.completed_at.strftime('%Y-%m-%d %H:%M')}")
                print(f"  Score: {session.total_score} ({session.percentage_score}%) - {session.level_achieved}")
            else:
                print(f"  Statut: {status}")
            
            if session.candidate_email:
                print(f"  Email: {session.candidate_email}")

def clean_incomplete_sessions():
    """Nettoie les sessions incomplètes anciennes"""
    with app.app_context():
        # Sessions de plus de 24h non complétées
        cutoff_time = datetime.utcnow() - timedelta(hours=24)
        old_sessions = QuizSession.query.filter(
            QuizSession.is_completed == False,
            QuizSession.started_at < cutoff_time
        ).all()
        
        if not old_sessions:
            print("✅ Aucune session ancienne à nettoyer")
            return
        
        print(f"🧹 Suppression de {len(old_sessions)} sessions incomplètes anciennes...")
        
        for session in old_sessions:
            # Supprimer les réponses associées
            QuizResponse.query.filter_by(session_id=session.id).delete()
            # Supprimer la session
            db.session.delete(session)
        
        db.session.commit()
        print("✅ Nettoyage terminé")

def reset_database():
    """Remet à zéro la base de données (ATTENTION: supprime tout!)"""
    response = input("⚠️  ATTENTION: Cela va supprimer TOUTES les données! Tapez 'CONFIRMER' pour continuer: ")
    
    if response != "CONFIRMER":
        print("❌ Opération annulée")
        return
    
    with app.app_context():
        db.drop_all()
        db.create_all()
        print("✅ Base de données remise à zéro")

def backup_database():
    """Crée une sauvegarde des données importantes"""
    import json
    from datetime import datetime
    
    with app.app_context():
        # Exporter les questions
        questions = Question.query.all()
        questions_data = []
        
        for question in questions:
            options = QuestionOption.query.filter_by(question_id=question.id).order_by(QuestionOption.option_order).all()
            
            question_data = {
                "question_text": question.question_text,
                "question_type": question.question_type,
                "explanation": question.explanation,
                "category": question.category,
                "difficulty_level": question.difficulty_level,
                "is_active": question.is_active,
                "options": [{
                    "text": opt.option_text,
                    "is_correct": opt.is_correct,
                    "order": opt.option_order
                } for opt in options]
            }
            questions_data.append(question_data)
        
        # Exporter les statistiques des sessions
        sessions = QuizSession.query.filter_by(is_completed=True).all()
        sessions_data = []
        
        for session in sessions:
            sessions_data.append({
                "candidate_name": session.candidate_name,
                "started_at": session.started_at.isoformat(),
                "completed_at": session.completed_at.isoformat() if session.completed_at else None,
                "total_score": session.total_score,
                "percentage_score": session.percentage_score,
                "level_achieved": session.level_achieved
            })
        
        backup_data = {
            "backup_date": datetime.utcnow().isoformat(),
            "questions": questions_data,
            "completed_sessions": sessions_data
        }
        
        filename = f"backup_quiz_ux_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(backup_data, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Sauvegarde créée: {filename}")

def main():
    """Menu principal"""
    while True:
        print("\n🎯 Gestionnaire de Base de Données Quiz UX")
        print("=" * 45)
        print("1. Afficher les statistiques")
        print("2. Lister toutes les questions")
        print("3. Afficher les sessions récentes")
        print("4. Nettoyer les sessions incomplètes")
        print("5. Créer une sauvegarde")
        print("6. Remettre à zéro la DB (DANGER!)")
        print("0. Quitter")
        
        choice = input("\nChoix: ").strip()
        
        if choice == "1":
            show_database_stats()
        elif choice == "2":
            show_questions()
        elif choice == "3":
            limit = input("Nombre de sessions à afficher (défaut: 10): ").strip()
            limit = int(limit) if limit.isdigit() else 10
            show_recent_sessions(limit)
        elif choice == "4":
            clean_incomplete_sessions()
        elif choice == "5":
            backup_database()
        elif choice == "6":
            reset_database()
        elif choice == "0":
            print("👋 Au revoir!")
            break
        else:
            print("❌ Choix invalide")

if __name__ == '__main__':
    # Permettre d'exécuter des commandes directement
    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == "stats":
            show_database_stats()
        elif command == "questions":
            show_questions()
        elif command == "sessions":
            show_recent_sessions()
        elif command == "backup":
            backup_database()
        else:
            print(f"Commande inconnue: {command}")
    else:
        main()
