/**
 * Module Loot - Système de récompenses avec raretés
 */
import { Storage } from './storage.js';

class LootSystem {
    constructor() {
        this.giftsData = null;
        this.init();
    }

    async init() {
        await this.loadGiftsData();
    }

    /**
     * Charge les données des cadeaux
     */
    async loadGiftsData() {
        try {
            const response = await fetch('data/gifts.json');
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des cadeaux');
            }
            this.giftsData = await response.json();
        } catch (error) {
            console.error('Erreur de chargement des cadeaux:', error);
            // Données par défaut en cas d'erreur
            this.giftsData = this.getDefaultGiftsData();
        }
    }

    /**
     * Données par défaut des cadeaux
     */
    getDefaultGiftsData() {
        return {
            rarities: {
                COMMON: { label: "Commun", color: "#B388FF" },
                RARE: { label: "Rare", color: "#7C4DFF" },
                EPIC: { label: "Épique", color: "#00BFA6" }
            },
            dropTables: [
                { minScore: 0, weights: { COMMON: 80, RARE: 18, EPIC: 2 } },
                { minScore: 60, weights: { COMMON: 60, RARE: 30, EPIC: 10 } },
                { minScore: 85, weights: { COMMON: 40, RARE: 40, EPIC: 20 } }
            ],
            items: [
                { name: "Bon pour un massage", rarity: "COMMON", description: "30 minutes de détente totale", icon: "💆‍♀️" },
                { name: "Soirée film & snacks", rarity: "COMMON", description: "Film de ton choix + tes snacks préférés", icon: "🍿" },
                { name: "Petit-déjeuner au lit", rarity: "COMMON", description: "Service complet avec tes plats préférés", icon: "🥐" },
                { name: "Séance photo romantique", rarity: "COMMON", description: "Photos de nous deux dans un lieu spécial", icon: "📸" },
                { name: "Dîner fait maison", rarity: "RARE", description: "Menu gastronomique préparé avec amour", icon: "🍽️" },
                { name: "Spa à domicile", rarity: "RARE", description: "Soins relaxants dans le confort de la maison", icon: "🛁" },
                { name: "Cours de danse privé", rarity: "RARE", description: "Apprendre à danser ensemble", icon: "💃" },
                { name: "Week-end surprise", rarity: "EPIC", description: "Destination secrète, tout est organisé !", icon: "✈️" },
                { name: "Bijou personnalisé", rarity: "EPIC", description: "Création unique rien que pour toi", icon: "💎" },
                { name: "Voyage romantique", rarity: "EPIC", description: "Échappée amoureuse dans un lieu magique", icon: "🌹" }
            ]
        };
    }

    /**
     * Détermine la table de drop selon le score
     */
    getDropTable(score) {
        if (!this.giftsData) return null;

        // Trouver la table appropriée selon le score
        const sortedTables = this.giftsData.dropTables.sort((a, b) => b.minScore - a.minScore);
        
        for (const table of sortedTables) {
            if (score >= table.minScore) {
                return table;
            }
        }

        // Retourner la première table par défaut
        return this.giftsData.dropTables[0];
    }

    /**
     * Tire une rareté selon les poids
     */
    drawRarity(score) {
        const dropTable = this.getDropTable(score);
        if (!dropTable) return 'COMMON';

        return window.Utils.randomWeighted(dropTable.weights);
    }

    /**
     * Sélectionne un item aléatoire d'une rareté donnée
     */
    selectItem(rarity) {
        if (!this.giftsData) return null;

        const itemsOfRarity = this.giftsData.items.filter(item => item.rarity === rarity);
        if (itemsOfRarity.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * itemsOfRarity.length);
        return itemsOfRarity[randomIndex];
    }

    /**
     * Génère un loot complet
     */
    generateLoot(score) {
        const rarity = this.drawRarity(score);
        const item = this.selectItem(rarity);
        
        if (!item) {
            console.warn('Aucun item trouvé pour la rareté:', rarity);
            return null;
        }

        return {
            item: item,
            rarity: rarity,
            rarityInfo: this.giftsData.rarities[rarity],
            score: score
        };
    }

    /**
     * Affiche le loot dans l'interface
     */
    displayLoot(loot) {
        if (!loot) return;

        const lootCard = document.getElementById('lootCard');
        const lootRarity = document.getElementById('lootRarity');
        const lootIcon = document.getElementById('lootIcon');
        const lootName = document.getElementById('lootName');
        const lootDescription = document.getElementById('lootDescription');

        if (!lootCard) return;

        // Mise à jour du contenu
        if (lootRarity) {
            lootRarity.textContent = loot.rarityInfo.label;
            lootRarity.className = `loot-card__rarity loot-card__rarity--${loot.rarity.toLowerCase()}`;
        }

        if (lootIcon) {
            lootIcon.textContent = loot.item.icon || '🎁';
        }

        if (lootName) {
            lootName.textContent = loot.item.name;
        }

        if (lootDescription) {
            lootDescription.textContent = loot.item.description || '';
        }

        // Animation d'apparition
        this.animateLootCard(lootCard, loot.rarity);
    }

    /**
     * Anime l'apparition de la carte de loot
     */
    animateLootCard(card, rarity) {
        // Reset de l'animation
        card.style.transform = 'scale(0.8) translateY(20px)';
        card.style.opacity = '0';

        // Animation d'apparition
        requestAnimationFrame(() => {
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transform = 'scale(1) translateY(0)';
            card.style.opacity = '1';
        });

        // Effet de brillance pour les items épiques
        if (rarity === 'EPIC') {
            this.addEpicEffect(card);
        }
    }

    /**
     * Ajoute un effet spécial pour les items épiques
     */
    addEpicEffect(card) {
        const sparkle = document.createElement('div');
        sparkle.className = 'epic-sparkle';
        sparkle.innerHTML = '✨';
        sparkle.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 20px;
            animation: sparkle 2s ease-in-out infinite;
            pointer-events: none;
        `;

        card.style.position = 'relative';
        card.appendChild(sparkle);

        // Supprimer l'effet après 3 secondes
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 3000);
    }

    /**
     * Sauvegarde le loot dans l'historique
     */
    saveLootToHistory(loot) {
        const quizData = Storage.getQuizData();
        
        if (!quizData.rewards) {
            quizData.rewards = [];
        }

        // Ajouter le nouveau loot
        quizData.rewards.push({
            item: loot.item.name,
            rarity: loot.rarity,
            score: loot.score,
            date: new Date().toISOString()
        });

        // Garder seulement les 10 derniers
        if (quizData.rewards.length > 10) {
            quizData.rewards = quizData.rewards.slice(-10);
        }

        Storage.saveQuizData(quizData);
    }

    /**
     * Récupère l'historique des récompenses
     */
    getRewardHistory() {
        const quizData = Storage.getQuizData();
        return quizData.rewards || [];
    }

    /**
     * Affiche l'historique des récompenses
     */
    displayRewardHistory() {
        const history = this.getRewardHistory();
        const scoreList = document.getElementById('scoreList');
        
        if (!scoreList || history.length === 0) return;

        scoreList.innerHTML = history.map(reward => `
            <div class="score-item">
                <div class="score-item__info">
                    <span class="score-item__item">${reward.item}</span>
                    <span class="score-item__rarity rarity-${reward.rarity.toLowerCase()}">${this.giftsData.rarities[reward.rarity].label}</span>
                </div>
                <div class="score-item__score">${reward.score}%</div>
            </div>
        `).join('');
    }

    /**
     * Obtient les statistiques de rareté
     */
    getRarityStats() {
        const history = this.getRewardHistory();
        const stats = { COMMON: 0, RARE: 0, EPIC: 0 };
        
        history.forEach(reward => {
            stats[reward.rarity]++;
        });

        return stats;
    }
}

// Styles CSS pour les animations
const lootStyles = `
    @keyframes sparkle {
        0%, 100% { 
            transform: scale(1) rotate(0deg); 
            opacity: 1; 
        }
        50% { 
            transform: scale(1.2) rotate(180deg); 
            opacity: 0.7; 
        }
    }
    
    .rarity-common { color: var(--color-common); }
    .rarity-rare { color: var(--color-rare); }
    .rarity-epic { color: var(--color-epic); }
    
    .score-item__info {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    
    .score-item__item {
        font-weight: 500;
        color: var(--color-text);
    }
    
    .score-item__rarity {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
`;

// Injection des styles
const styleSheet = document.createElement('style');
styleSheet.textContent = lootStyles;
document.head.appendChild(styleSheet);

// Export pour utilisation dans d'autres modules
export { LootSystem };
