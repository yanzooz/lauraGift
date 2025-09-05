/**
 * Gestionnaire de stockage localStorage avec support JSON
 */
export class Storage {
    /**
     * Récupère une valeur du localStorage
     * @param {string} key - Clé de stockage
     * @param {*} defaultValue - Valeur par défaut si la clé n'existe pas
     * @returns {*} Valeur stockée ou valeur par défaut
     */
    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            if (item === null) return defaultValue;
            return JSON.parse(item);
        } catch (error) {
            console.warn(`Erreur lors de la lecture de ${key}:`, error);
            return defaultValue;
        }
    }

    /**
     * Stocke une valeur dans le localStorage
     * @param {string} key - Clé de stockage
     * @param {*} value - Valeur à stocker
     */
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn(`Erreur lors de l'écriture de ${key}:`, error);
        }
    }

    /**
     * Supprime une clé du localStorage
     * @param {string} key - Clé à supprimer
     */
    static remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn(`Erreur lors de la suppression de ${key}:`, error);
        }
    }

    /**
     * Vérifie si une clé existe dans le localStorage
     * @param {string} key - Clé à vérifier
     * @returns {boolean} True si la clé existe
     */
    static has(key) {
        return localStorage.getItem(key) !== null;
    }

    /**
     * Exécute une fonction une seule fois par clé
     * @param {string} key - Clé unique pour l'action
     * @param {Function} fn - Fonction à exécuter
     */
    static once(key, fn) {
        const executedKey = `executed_${key}`;
        if (!this.has(executedKey)) {
            fn();
            this.set(executedKey, true);
        }
    }

    /**
     * Récupère toutes les clés du localStorage
     * @returns {string[]} Liste des clés
     */
    static keys() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            keys.push(localStorage.key(i));
        }
        return keys;
    }

    /**
     * Vide tout le localStorage
     */
    static clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.warn('Erreur lors du vidage du localStorage:', error);
        }
    }

    /**
     * Récupère les données de quiz
     * @returns {Object} Données de quiz
     */
    static getQuizData() {
        return this.get('quizData', {
            bestScore: 0,
            attempts: 0,
            rewards: []
        });
    }

    /**
     * Sauvegarde les données de quiz
     * @param {Object} data - Données à sauvegarder
     */
    static saveQuizData(data) {
        this.set('quizData', data);
    }

    /**
     * Récupère l'état de déverrouillage de la lettre
     * @returns {boolean} True si la lettre est déverrouillée
     */
    static isLetterUnlocked() {
        return this.get('letterUnlocked', false);
    }

    /**
     * Marque la lettre comme déverrouillée
     */
    static unlockLetter() {
        this.set('letterUnlocked', true);
    }

    /**
     * Récupère les préférences utilisateur
     * @returns {Object} Préférences
     */
    static getPreferences() {
        return this.get('preferences', {
            musicEnabled: false,
            theme: 'light',
            recipientName: 'Laura'
        });
    }

    /**
     * Sauvegarde les préférences utilisateur
     * @param {Object} preferences - Préférences à sauvegarder
     */
    static savePreferences(preferences) {
        this.set('preferences', preferences);
    }
}
