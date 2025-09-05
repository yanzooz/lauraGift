// Tirage au sort de cadeaux
class GiftDraw {
    constructor() {
        this.gifts = [
            {
                id: 1,
                icon: '👟',
                title: 'Paire de chaussures Adidas',
                description: 'Une magnifique paire de chaussures Adidas pour toi !',
                image: 'assets/img/lot-img/paireAddidas.avif',
                dropRate: 0.25, // 1/4 = 25%
                rarity: 'common'
            },
            {
                id: 2,
                icon: '🌸',
                title: 'Parfum Chance Eau Tendre',
                description: 'Un parfum délicat et romantique qui te va si bien !',
                image: 'assets/img/lot-img/chance-eau-tendre-eau-de-toilette-vaporisateur.webp',
                dropRate: 0.25, // 1/4 = 25%
                rarity: 'common'
            },
            {
                id: 3,
                icon: '💋',
                title: 'Un bisous',
                description: 'Le plus précieux des cadeaux : un bisous de ton amoureux !',
                image: 'assets/img/lot-img/bisous_001.jpg',
                dropRate: 0.001, // 1/1000 = 0.1%
                rarity: 'legendary'
            },
            {
                id: 4,
                icon: '📱',
                title: 'iPad',
                description: 'Une tablette iPad pour tes créations et tes loisirs !',
                image: 'assets/img/lot-img/IPAD.webp',
                dropRate: 0.01, // 1/100 = 1%
                rarity: 'rare'
            },
            {
                id: 5,
                icon: '🚗',
                title: 'Voiture Audi A1',
                description: 'Une magnifique voiture Audi A1 pour tes déplacements !',
                image: 'assets/img/lot-img/2019-audi-a1-sportback-revealed-40-tfsi-boasts-20-liter-engine-with-200-ps_3.jpg',
                dropRate: 0.000001, // 1/1000000 = 0.0001%
                rarity: 'mythic'
            }
        ];
        
        this.currentGift = null;
        this.isDrawing = false;
        this.hasDrawn = false;
        
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
    }

    setupElements() {
        this.drawButton = document.getElementById('drawButton');
        this.giftResult = document.getElementById('giftResult');
        this.giftIcon = document.getElementById('giftIcon');
        this.giftTitle = document.getElementById('giftTitle');
        this.giftDescription = document.getElementById('giftDescription');
        this.claimButton = document.getElementById('claimButton');
    }

    setupEventListeners() {
        this.drawButton.addEventListener('click', () => this.drawGift());
        this.claimButton.addEventListener('click', () => this.claimGift());
    }

    async drawGift() {
        if (this.isDrawing || this.hasDrawn) return;
        
        this.isDrawing = true;
        this.drawButton.disabled = true;
        this.drawButton.innerHTML = '<span class="gift-btn__icon">⏳</span><span class="gift-btn__text">Tirage en cours...</span>';
        
        // Animation de tirage
        await this.animateDraw();
        
        // Calculer le cadeau gagné selon les taux de drop
        this.currentGift = this.calculateGift();
        
        // Afficher le résultat
        this.showResult();
        
        this.isDrawing = false;
        this.hasDrawn = true;
        this.drawButton.innerHTML = '<span class="gift-btn__icon">✅</span><span class="gift-btn__text">Tirage terminé</span>';
    }

    calculateGift() {
        const random = Math.random();
        let cumulativeRate = 0;
        
        for (const gift of this.gifts) {
            cumulativeRate += gift.dropRate;
            if (random <= cumulativeRate) {
                return gift;
            }
        }
        
        // Fallback au cas où (ne devrait jamais arriver)
        return this.gifts[0];
    }

    async animateDraw() {
        const icons = ['🎁', '🎲', '✨', '🎊', '🎉', '💫'];
        const duration = 2000; // 2 secondes
        const interval = 100; // Change d'icône toutes les 100ms
        
        let elapsed = 0;
        const animation = setInterval(() => {
            const randomIcon = icons[Math.floor(Math.random() * icons.length)];
            this.giftIcon.textContent = randomIcon;
            this.giftTitle.textContent = 'Tirage en cours...';
            this.giftDescription.textContent = 'Patiente un peu mon amour...';
            
            elapsed += interval;
            if (elapsed >= duration) {
                clearInterval(animation);
            }
        }, interval);
        
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    showResult() {
        // Afficher l'image du cadeau
        const giftImage = document.createElement('img');
        giftImage.src = this.currentGift.image;
        giftImage.alt = this.currentGift.title;
        giftImage.className = 'gift-result__image';
        
        // Remplacer l'icône par l'image
        this.giftIcon.innerHTML = '';
        this.giftIcon.appendChild(giftImage);
        
        this.giftTitle.textContent = this.currentGift.title;
        this.giftDescription.textContent = this.currentGift.description;
        
        // Ajouter la rareté
        const rarityElement = document.createElement('div');
        rarityElement.className = `gift-result__rarity gift-result__rarity--${this.currentGift.rarity}`;
        rarityElement.textContent = this.getRarityText(this.currentGift.rarity);
        this.giftResult.querySelector('.gift-result__content').insertBefore(rarityElement, this.giftTitle);
        
        this.giftResult.style.display = 'block';
        this.giftResult.scrollIntoView({ behavior: 'smooth' });
        
        // Animation d'apparition
        setTimeout(() => {
            this.giftResult.classList.add('gift-result--show');
        }, 100);
    }

    getRarityText(rarity) {
        const rarityTexts = {
            'common': '⭐ Commun',
            'rare': '⭐⭐ Rare',
            'legendary': '⭐⭐⭐ Légendaire',
            'mythic': '⭐⭐⭐⭐ Mythique'
        };
        return rarityTexts[rarity] || '⭐ Commun';
    }

    claimGift() {
        if (!this.currentGift) return;
        
        // Afficher un message de confirmation
        this.claimButton.innerHTML = '✓ Cadeau récupéré !';
        this.claimButton.disabled = true;
        
        // Afficher un message de félicitations
        setTimeout(() => {
            const message = document.createElement('div');
            message.className = 'gift-claimed';
            message.innerHTML = `
                <h3>🎉 Félicitations ! 🎉</h3>
                <p>Tu as gagné : <strong>${this.currentGift.title}</strong></p>
                <p>Profite bien de ton cadeau mon amour ! 💕</p>
            `;
            
            this.giftResult.appendChild(message);
        }, 1000);
    }
}

// Initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    new GiftDraw();
});
