/**
 * Module Quiz - Gestion du quiz interactif
 */
import { Storage } from './storage.js';
import { LootSystem } from './loot.js';

class QuizManager {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.lootSystem = new LootSystem();
        
        this.quizIntro = document.getElementById('quizIntro');
        this.quizContainer = document.getElementById('quizContainer');
        this.quizResults = document.getElementById('quizResults');
        
        this.init();
    }

    async init() {
        await this.loadQuestions();
        this.setupEventListeners();
    }

    /**
     * Charge les questions depuis le fichier JSON
     */
    async loadQuestions() {
        try {
            const response = await fetch('data/quiz.json');
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des questions');
            }
            this.questions = await response.json();
        } catch (error) {
            console.error('Erreur de chargement des questions:', error);
            this.questions = this.getDefaultQuestions();
        }
    }

    /**
     * Questions par défaut en cas d'erreur
     */
    getDefaultQuestions() {
        return [
            {
                id: "q1",
                question: "Quelle est notre date d'anniversaire ?",
                choices: ["12 avril 2023", "2 juin 2023", "14 février 2024", "1 janvier 2023"],
                answerIndex: 0
            },
            {
                id: "q2",
                question: "Quel est le parfum préféré de Laura ?",
                choices: ["Vanille", "Rose", "Agrumes", "Boisé"],
                answerIndex: 1
            },
            {
                id: "q3",
                question: "Où avons-nous eu notre premier rendez-vous ?",
                choices: ["Au café", "Au parc", "Au restaurant", "Au cinéma"],
                answerIndex: 0
            },
            {
                id: "q4",
                question: "Quelle est la couleur préférée de Laura ?",
                choices: ["Bleu", "Violet", "Rose", "Vert"],
                answerIndex: 1
            },
            {
                id: "q5",
                question: "Quel est le plat préféré de Laura ?",
                choices: ["Pâtes", "Pizza", "Sushi", "Salade"],
                answerIndex: 2
            }
        ];
    }

    /**
     * Configure les événements
     */
    setupEventListeners() {
        const startBtn = document.getElementById('startQuiz');
        const nextBtn = document.getElementById('nextQuestion');
        const playAgainBtn = document.getElementById('playAgain');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.startQuiz());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }

        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => this.restartQuiz());
        }
    }

    /**
     * Démarre le quiz
     */
    startQuiz() {
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;

        // Masquer l'intro et afficher le quiz
        this.quizIntro.style.display = 'none';
        this.quizContainer.style.display = 'block';
        this.quizResults.style.display = 'none';

        this.displayCurrentQuestion();
    }

    /**
     * Affiche la question actuelle
     */
    displayCurrentQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.finishQuiz();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        const questionTitle = document.getElementById('questionTitle');
        const questionChoices = document.getElementById('questionChoices');
        const nextBtn = document.getElementById('nextQuestion');
        const currentQuestionSpan = document.getElementById('currentQuestion');
        const totalQuestionsSpan = document.getElementById('totalQuestions');
        const progressFill = document.getElementById('progressFill');

        // Mise à jour des éléments
        if (questionTitle) questionTitle.textContent = question.question;
        if (currentQuestionSpan) currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
        if (totalQuestionsSpan) totalQuestionsSpan.textContent = this.questions.length;
        if (progressFill) {
            const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
            progressFill.style.width = `${progress}%`;
        }

        // Génération des choix
        if (questionChoices) {
            questionChoices.innerHTML = question.choices.map((choice, index) => `
                <button class="choice-btn" data-index="${index}">
                    ${choice}
                </button>
            `).join('');

            // Ajout des événements
            questionChoices.querySelectorAll('.choice-btn').forEach(btn => {
                // Événement de clic
                btn.addEventListener('click', (e) => this.selectAnswer(e.target.dataset.index));
                
                // Événement tactile pour mobile
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.selectAnswer(e.target.dataset.index);
                }, { passive: false });
            });
        }

        // Désactiver le bouton suivant
        if (nextBtn) {
            nextBtn.disabled = true;
        }
    }

    /**
     * Sélectionne une réponse
     */
    selectAnswer(answerIndex) {
        const choiceButtons = document.querySelectorAll('.choice-btn');
        const nextBtn = document.getElementById('nextQuestion');

        // Désélectionner tous les boutons
        choiceButtons.forEach(btn => {
            btn.classList.remove('choice-btn--selected');
        });

        // Sélectionner le bouton cliqué
        const selectedBtn = document.querySelector(`[data-index="${answerIndex}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('choice-btn--selected');
        }

        // Activer le bouton suivant
        if (nextBtn) {
            nextBtn.disabled = false;
        }

        // Stocker la réponse
        this.userAnswers[this.currentQuestionIndex] = parseInt(answerIndex);
    }

    /**
     * Passe à la question suivante
     */
    nextQuestion() {
        if (this.userAnswers[this.currentQuestionIndex] === undefined) {
            alert('Veuillez sélectionner une réponse !');
            return;
        }

        this.currentQuestionIndex++;
        this.displayCurrentQuestion();
    }

    /**
     * Termine le quiz et affiche les résultats
     */
    finishQuiz() {
        this.calculateScore();
        this.displayResults();
        this.saveResults();
    }

    /**
     * Calcule le score
     */
    calculateScore() {
        let correctAnswers = 0;

        this.questions.forEach((question, index) => {
            if (this.userAnswers[index] === question.answerIndex) {
                correctAnswers++;
            }
        });

        this.score = Math.round((correctAnswers / this.questions.length) * 100);
    }

    /**
     * Affiche les résultats
     */
    displayResults() {
        // Masquer le quiz et afficher les résultats
        this.quizContainer.style.display = 'none';
        this.quizResults.style.display = 'block';

        // Mise à jour du score
        const finalScore = document.getElementById('finalScore');
        const resultsIcon = document.getElementById('resultsIcon');

        if (finalScore) {
            finalScore.textContent = this.score;
        }

        if (resultsIcon) {
            // Changer l'icône selon le score
            if (this.score >= 85) {
                resultsIcon.textContent = '🏆';
            } else if (this.score >= 60) {
                resultsIcon.textContent = '🎉';
            } else {
                resultsIcon.textContent = '😊';
            }
        }

        // Génération et affichage du loot
        this.generateAndDisplayLoot();

        // Affichage de l'historique
        this.lootSystem.displayRewardHistory();
    }

    /**
     * Génère et affiche le loot
     */
    generateAndDisplayLoot() {
        const loot = this.lootSystem.generateLoot(this.score);
        if (loot) {
            this.lootSystem.displayLoot(loot);
            this.lootSystem.saveLootToHistory(loot);
        }
    }

    /**
     * Sauvegarde les résultats
     */
    saveResults() {
        const quizData = Storage.getQuizData();
        
        // Mise à jour du meilleur score
        if (this.score > quizData.bestScore) {
            quizData.bestScore = this.score;
        }

        // Incrémenter le nombre de tentatives
        quizData.attempts = (quizData.attempts || 0) + 1;

        // Ajouter à l'historique des scores
        if (!quizData.scoreHistory) {
            quizData.scoreHistory = [];
        }

        quizData.scoreHistory.push({
            score: this.score,
            date: new Date().toISOString(),
            answers: [...this.userAnswers]
        });

        // Garder seulement les 20 derniers scores
        if (quizData.scoreHistory.length > 20) {
            quizData.scoreHistory = quizData.scoreHistory.slice(-20);
        }

        Storage.saveQuizData(quizData);
    }

    /**
     * Redémarre le quiz
     */
    restartQuiz() {
        this.quizIntro.style.display = 'block';
        this.quizContainer.style.display = 'none';
        this.quizResults.style.display = 'none';
    }

    /**
     * Affiche les statistiques du quiz
     */
    displayStats() {
        const quizData = Storage.getQuizData();
        const stats = {
            bestScore: quizData.bestScore || 0,
            attempts: quizData.attempts || 0,
            averageScore: 0
        };

        if (quizData.scoreHistory && quizData.scoreHistory.length > 0) {
            const totalScore = quizData.scoreHistory.reduce((sum, attempt) => sum + attempt.score, 0);
            stats.averageScore = Math.round(totalScore / quizData.scoreHistory.length);
        }

        return stats;
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new QuizManager();
});
