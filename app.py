from flask import Flask, jsonify, request
from database import app, db, Question, QuestionOption, QuizSession, QuizResponse
import json
from datetime import datetime

# ===== ROUTES API =====

@app.route('/api/health', methods=['GET'])
def health_check():
    """Point de contrôle pour vérifier que l'API fonctionne"""
    return jsonify({
        "status": "OK", 
        "message": "Quiz API is running",
        "database": "Connected" if db.engine.execute("SELECT 1").fetchone() else "Disconnected"
    })

@app.route('/api/quiz/start', methods=['POST'])
def start_quiz():
    """Démarre une nouvelle session de quiz"""
    try:
        data = request.get_json() or {}
        candidate_name = data.get('candidate_name', 'Anonyme')
        candidate_email = data.get('candidate_email', '')
        
        # Créer une nouvelle session
        session = QuizSession(
            candidate_name=candidate_name,
            candidate_email=candidate_email
        )
        db.session.add(session)
        db.session.commit()
        
        # Récupérer les questions actives
        questions = Question.query.filter_by(is_active=True).all()
        
        if not questions:
            return jsonify({
                "success": False,
                "error": "Aucune question disponible"
            }), 404
        
        # Préparer les questions pour le frontend (sans les réponses correctes)
        questions_data = []
        for question in questions:
            options = QuestionOption.query.filter_by(question_id=question.id).order_by(QuestionOption.option_order).all()
            
            question_data = {
                "id": question.id,
                "question": question.question_text,
                "type": question.question_type,
                "category": question.category,
                "difficulty": question.difficulty_level,
                "options": [{"id": opt.id, "text": opt.option_text} for opt in options]
            }
            questions_data.append(question_data)
        
        return jsonify({
            "success": True,
            "session_id": session.id,
            "questions": questions_data,
            "total_questions": len(questions_data),
            "candidate_name": candidate_name
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Erreur lors du démarrage du quiz: {str(e)}"
        }), 500

@app.route('/api/quiz/submit', methods=['POST'])
def submit_quiz():
    """Soumet les réponses et calcule le score"""
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        answers = data.get('answers', {})
        
        if not session_id:
            return jsonify({
                "success": False,
                "error": "ID de session manquant"
            }), 400
        
        # Récupérer la session
        session = QuizSession.query.get(session_id)
        if not session:
            return jsonify({
                "success": False,
                "error": "Session introuvable"
            }), 404
        
        if session.is_completed:
            return jsonify({
                "success": False,
                "error": "Ce quiz a déjà été complété"
            }), 400
        
        # Calculer le score
        total_score = 0
        detailed_results = []
        questions = Question.query.filter_by(is_active=True).all()
        
        for question in questions:
            question_id = str(question.id)
            user_answer = answers.get(question_id)
            
            # Récupérer les bonnes réponses
            correct_options = QuestionOption.query.filter_by(
                question_id=question.id, 
                is_correct=True
            ).all()
            
            # Vérifier la réponse
            is_correct = False
            
            if question.question_type == 'qcu':
                # Question à choix unique
                if user_answer is not None:
                    correct_option_ids = [opt.id for opt in correct_options]
                    is_correct = user_answer in correct_option_ids
            
            elif question.question_type == 'qcm':
                # Question à choix multiples
                if user_answer is not None and isinstance(user_answer, list):
                    correct_option_ids = set(opt.id for opt in correct_options)
                    user_option_ids = set(user_answer)
                    is_correct = user_option_ids == correct_option_ids
            
            if is_correct:
                total_score += 1
            
            # Enregistrer la réponse dans la base
            response = QuizResponse(
                session_id=session.id,
                question_id=question.id,
                selected_options=json.dumps(user_answer) if user_answer else None,
                is_correct=is_correct
            )
            db.session.add(response)
            
            # Préparer les détails pour la réponse
            all_options = QuestionOption.query.filter_by(question_id=question.id).order_by(QuestionOption.option_order).all()
            detailed_results.append({
                "question_id": question.id,
                "question": question.question_text,
                "user_answer": user_answer,
                "correct_answer": [opt.id for opt in correct_options],
                "all_options": [{"id": opt.id, "text": opt.option_text, "is_correct": opt.is_correct} for opt in all_options],
                "is_correct": is_correct,
                "explanation": question.explanation,
                "type": question.question_type,
                "category": question.category
            })
        
        # Calculer le pourcentage et le niveau
        total_questions = len(questions)
        percentage = round((total_score / total_questions) * 100, 1) if total_questions > 0 else 0
        
        # Déterminer le niveau
        if percentage >= 80:
            level = "Excellent"
            message = "Félicitations ! Vous maîtrisez très bien les concepts UX."
        elif percentage >= 60:
            level = "Bon"
            message = "Bon travail ! Vous avez une bonne compréhension de l'UX."
        elif percentage >= 40:
            level = "Moyen"
            message = "Pas mal ! Il y a encore quelques concepts à approfondir."
        else:
            level = "À améliorer"
            message = "Il serait bénéfique de revoir les fondamentaux de l'UX Design."
        
        # Mettre à jour la session
        session.completed_at = datetime.utcnow()
        session.total_score = total_score
        session.percentage_score = percentage
        session.level_achieved = level
        session.is_completed = True
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "session_id": session.id,
            "score": total_score,
            "total_questions": total_questions,
            "percentage": percentage,
            "level": level,
            "message": message,
            "detailed_results": detailed_results,
            "completed_at": session.completed_at.isoformat()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": f"Erreur lors de la soumission: {str(e)}"
        }), 500

@app.route('/api/admin/questions', methods=['GET'])
def get_all_questions():
    """Récupère toutes les questions (pour l'administration)"""
    try:
        questions = Question.query.all()
        questions_data = []
        
        for question in questions:
            options = QuestionOption.query.filter_by(question_id=question.id).order_by(QuestionOption.option_order).all()
            
            question_data = {
                "id": question.id,
                "question": question.question_text,
                "type": question.question_type,
                "category": question.category,
                "difficulty": question.difficulty_level,
                "explanation": question.explanation,
                "is_active": question.is_active,
                "created_at": question.created_at.isoformat(),
                "options": [{
                    "id": opt.id,
                    "text": opt.option_text,
                    "is_correct": opt.is_correct,
                    "order": opt.option_order
                } for opt in options]
            }
            questions_data.append(question_data)
        
        return jsonify({
            "success": True,
            "questions": questions_data,
            "total": len(questions_data)
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Erreur lors de la récupération: {str(e)}"
        }), 500

@app.route('/api/admin/sessions', methods=['GET'])
def get_quiz_sessions():
    """Récupère les statistiques des sessions"""
    try:
        sessions = QuizSession.query.order_by(QuizSession.started_at.desc()).all()
        
        sessions_data = []
        for session in sessions:
            sessions_data.append({
                "id": session.id,
                "candidate_name": session.candidate_name,
                "candidate_email": session.candidate_email,
                "started_at": session.started_at.isoformat(),
                "completed_at": session.completed_at.isoformat() if session.completed_at else None,
                "score": session.total_score,
                "percentage": session.percentage_score,
                "level": session.level_achieved,
                "is_completed": session.is_completed
            })
        
        # Statistiques générales
        total_sessions = len(sessions)
        completed_sessions = len([s for s in sessions if s.is_completed])
        average_score = sum(s.percentage_score for s in sessions if s.is_completed) / completed_sessions if completed_sessions > 0 else 0
        
        return jsonify({
            "success": True,
            "sessions": sessions_data,
            "statistics": {
                "total_sessions": total_sessions,
                "completed_sessions": completed_sessions,
                "completion_rate": (completed_sessions / total_sessions * 100) if total_sessions > 0 else 0,
                "average_score": round(average_score, 1)
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Erreur lors de la récupération: {str(e)}"
        }), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("🚀 Serveur Flask démarré sur http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
