// Album interactif - Gestion des photos avec couleurs personnalisées
class PhotoAlbum {
    constructor() {
        this.photos = [];
        this.currentPhotoIndex = 0;
        this.lightbox = null;
        this.gallery = null;
        
        this.init();
    }

    async init() {
        try {
            await this.loadPhotos();
            this.setupElements();
            this.renderGallery();
            this.setupEventListeners();
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de l\'album:', error);
            this.showError();
        }
    }

    async loadPhotos() {
        try {
            const response = await fetch('data/photos.json');
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            this.photos = await response.json();
        } catch (error) {
            console.error('Erreur lors du chargement des photos:', error);
            throw error;
        }
    }

    setupElements() {
        this.gallery = document.getElementById('photoGallery');
        this.lightbox = document.getElementById('lightbox');
        
        if (!this.gallery || !this.lightbox) {
            throw new Error('Éléments DOM manquants');
        }
    }

    renderGallery() {
        if (!this.photos.length) {
            this.gallery.innerHTML = '<div class="gallery__loading">Aucune photo trouvée</div>';
            return;
        }

        this.gallery.innerHTML = this.photos.map(photo => this.createPhotoCard(photo)).join('');
    }

    createPhotoCard(photo) {
        return `
            <div class="photo-card" 
                 data-photo-id="${photo.id}"
                 data-photo-index="${this.photos.indexOf(photo)}">
                <img class="photo-card__image" 
                     src="${photo.src}" 
                     alt="${photo.title}"
                     loading="lazy">
                <div class="photo-card__content">
                    <h3 class="photo-card__title">${photo.title}</h3>
                    <p class="photo-card__description">${photo.description}</p>
                </div>
                <div class="photo-card__accent"></div>
            </div>
        `;
    }


    setupEventListeners() {
        // Clic sur les cartes photos pour afficher/masquer le texte
        this.gallery.addEventListener('click', (e) => {
            const photoCard = e.target.closest('.photo-card');
            if (photoCard) {
                // Toggle l'état actif de la carte
                photoCard.classList.toggle('photo-card--active');
                
                // Fermer les autres cartes actives
                const allCards = this.gallery.querySelectorAll('.photo-card--active');
                allCards.forEach(card => {
                    if (card !== photoCard) {
                        card.classList.remove('photo-card--active');
                    }
                });
            }
        });

        // Double clic pour ouvrir le lightbox (desktop)
        this.gallery.addEventListener('dblclick', (e) => {
            const photoCard = e.target.closest('.photo-card');
            if (photoCard) {
                const photoIndex = parseInt(photoCard.dataset.photoIndex);
                this.openLightbox(photoIndex);
            }
        });

        // Long press pour ouvrir le lightbox (mobile)
        this.setupLongPress();

        // Navigation clavier
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.getAttribute('aria-hidden') === 'false') {
                switch (e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.previousPhoto();
                        break;
                    case 'ArrowRight':
                        this.nextPhoto();
                        break;
                }
            }
        });

        // Boutons du lightbox
        const closeBtn = this.lightbox.querySelector('.lightbox__close');
        const prevBtn = this.lightbox.querySelector('.lightbox__prev');
        const nextBtn = this.lightbox.querySelector('.lightbox__next');
        const backdrop = this.lightbox.querySelector('.lightbox__backdrop');

        if (closeBtn) closeBtn.addEventListener('click', () => this.closeLightbox());
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousPhoto());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextPhoto());
        if (backdrop) backdrop.addEventListener('click', () => this.closeLightbox());

        // Swipe sur mobile
        this.setupSwipeGestures();
    }

    setupLongPress() {
        let pressTimer = null;
        let isLongPress = false;

        this.gallery.addEventListener('touchstart', (e) => {
            const photoCard = e.target.closest('.photo-card');
            if (photoCard) {
                isLongPress = false;
                pressTimer = setTimeout(() => {
                    isLongPress = true;
                    const photoIndex = parseInt(photoCard.dataset.photoIndex);
                    this.openLightbox(photoIndex);
                }, 800); // 800ms pour le long press
            }
        });

        this.gallery.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
        });

        this.gallery.addEventListener('touchmove', () => {
            clearTimeout(pressTimer);
        });
    }

    setupSwipeGestures() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        this.lightbox.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        this.lightbox.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Vérifier que c'est un swipe horizontal (pas vertical)
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.previousPhoto();
                } else {
                    this.nextPhoto();
                }
            }
        });
    }

    openLightbox(photoIndex) {
        if (photoIndex < 0 || photoIndex >= this.photos.length) return;
        
        this.currentPhotoIndex = photoIndex;
        const photo = this.photos[photoIndex];
        
        // Mettre à jour le contenu du lightbox
        const image = this.lightbox.querySelector('.lightbox__image');
        const title = this.lightbox.querySelector('.lightbox__title');
        const description = this.lightbox.querySelector('.lightbox__description');
        const date = this.lightbox.querySelector('.lightbox__date');
        
        if (image) {
            image.src = photo.src;
            image.alt = photo.title;
        }
        
        if (title) title.textContent = photo.title;
        if (description) description.textContent = photo.description;
        
        // Afficher le lightbox
        this.lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus pour l'accessibilité
        const closeBtn = this.lightbox.querySelector('.lightbox__close');
        if (closeBtn) closeBtn.focus();
    }

    closeLightbox() {
        this.lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    previousPhoto() {
        const newIndex = this.currentPhotoIndex > 0 
            ? this.currentPhotoIndex - 1 
            : this.photos.length - 1;
        this.openLightbox(newIndex);
    }

    nextPhoto() {
        const newIndex = this.currentPhotoIndex < this.photos.length - 1 
            ? this.currentPhotoIndex + 1 
            : 0;
        this.openLightbox(newIndex);
    }

    showError() {
        if (this.gallery) {
            this.gallery.innerHTML = `
                <div class="gallery__loading">
                    <p>😔 Désolé, impossible de charger nos photos</p>
                    <p>Vérifiez votre connexion internet et réessayez.</p>
                </div>
            `;
        }
    }
}

// Animation d'entrée pour les cartes photos
function animatePhotoCards() {
    const cards = document.querySelectorAll('.photo-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    new PhotoAlbum();
    
    // Attendre que les images soient chargées pour l'animation
    setTimeout(animatePhotoCards, 500);
});

// Gestion des erreurs d'images
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuKdpO+4jzwvdGV4dD48L3N2Zz4=';
        e.target.alt = 'Image non disponible';
    }
}, true);