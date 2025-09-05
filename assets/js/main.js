/**
 * Module principal - Navigation, thème, utilitaires
 */
import { Storage } from './storage.js';

class MainApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMusic();
        this.setupPersonalization();
        this.setupAccessibility();
    }

    /**
     * Configuration de la navigation
     */
    setupNavigation() {
        // Mise à jour du nom du destinataire
        const recipientName = Storage.getPreferences().recipientName;
        const nameElement = document.getElementById('recipientName');
        if (nameElement) {
            nameElement.textContent = recipientName;
        }

        // Navigation active
        this.updateActiveNavigation();
    }

    /**
     * Met à jour la navigation active
     */
    updateActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('a[href]');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Configuration de la musique
     */
    setupMusic() {
        const musicToggle = document.getElementById('musicToggle');
        const backgroundMusic = document.getElementById('backgroundMusic');
        
        if (!musicToggle || !backgroundMusic) return;

        const preferences = Storage.getPreferences();
        backgroundMusic.muted = !preferences.musicEnabled;

        musicToggle.addEventListener('click', () => {
            const isMuted = backgroundMusic.muted;
            backgroundMusic.muted = !isMuted;
            
            if (!isMuted) {
                backgroundMusic.pause();
                musicToggle.innerHTML = '<span class="btn__icon">🎵</span><span class="btn__text">Activer la musique</span>';
            } else {
                backgroundMusic.play().catch(console.warn);
                musicToggle.innerHTML = '<span class="btn__icon">🔇</span><span class="btn__text">Désactiver la musique</span>';
            }

            // Sauvegarder la préférence
            preferences.musicEnabled = !isMuted;
            Storage.savePreferences(preferences);
        });

        // Mise à jour du bouton selon l'état
        if (preferences.musicEnabled) {
            musicToggle.innerHTML = '<span class="btn__icon">🔇</span><span class="btn__text">Désactiver la musique</span>';
        }
    }

    /**
     * Configuration de la personnalisation
     */
    setupPersonalization() {
        const preferences = Storage.getPreferences();
        
        // Personnalisation du titre
        document.title = document.title.replace('Laura', preferences.recipientName);
        
        // Mise à jour des éléments avec le nom
        const nameElements = document.querySelectorAll('[data-recipient-name]');
        nameElements.forEach(element => {
            element.textContent = preferences.recipientName;
        });
    }

    /**
     * Configuration de l'accessibilité
     */
    setupAccessibility() {
        // Gestion du focus visible
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Gestion des animations réduites
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-fast', '0ms');
            document.documentElement.style.setProperty('--transition-normal', '0ms');
            document.documentElement.style.setProperty('--transition-slow', '0ms');
        }
    }
}

// Utilitaires globaux
window.Utils = {
    /**
     * Génère un hash SHA-256 d'une chaîne
     * @param {string} str - Chaîne à hasher
     * @returns {Promise<string>} Hash SHA-256
     */
    async hashSHA256(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    /**
     * Chiffre/déchiffre une chaîne avec XOR et base64
     * @param {string} str - Chaîne à traiter
     * @param {string} key - Clé de chiffrement
     * @returns {string} Chaîne chiffrée/déchiffrée
     */
    xorBase64(str, key) {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return btoa(result);
    },

    /**
     * Déchiffre une chaîne XOR+base64
     * @param {string} encoded - Chaîne encodée
     * @param {string} key - Clé de déchiffrement
     * @returns {string} Chaîne déchiffrée
     */
    decodeXorBase64(encoded, key) {
        try {
            const decoded = atob(encoded);
            let result = '';
            for (let i = 0; i < decoded.length; i++) {
                result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }
            return result;
        } catch (error) {
            console.warn('Erreur de déchiffrement:', error);
            return '';
        }
    },

    /**
     * Sélection aléatoire pondérée
     * @param {Object} weights - Objet avec les poids {key: weight}
     * @returns {string} Clé sélectionnée
     */
    randomWeighted(weights) {
        const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * total;
        
        for (const [key, weight] of Object.entries(weights)) {
            random -= weight;
            if (random <= 0) return key;
        }
        
        return Object.keys(weights)[0];
    },

    /**
     * Délai asynchrone
     * @param {number} ms - Millisecondes à attendre
     * @returns {Promise} Promise qui se résout après le délai
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Formate une date
     * @param {string|Date} date - Date à formater
     * @param {string} locale - Locale (défaut: 'fr-FR')
     * @returns {string} Date formatée
     */
    formatDate(date, locale = 'fr-FR') {
        const d = new Date(date);
        return d.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    /**
     * Débounce une fonction
     * @param {Function} func - Fonction à débouncer
     * @param {number} wait - Délai en ms
     * @returns {Function} Fonction débouncée
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Vérifie si un élément est visible dans le viewport
     * @param {Element} element - Élément à vérifier
     * @returns {boolean} True si visible
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    new MainApp();
});

// Export pour utilisation dans d'autres modules
export { MainApp };
