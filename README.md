# 💜 Site Cadeau Anniversaire Laura

Un site web romantique et interactif créé spécialement pour l'anniversaire de Laura. Inclut un album photo interactif, une lettre d'amour secrète et un quiz avec système de récompenses.

## 🚀 Déploiement GitHub Pages

1. **Publier sur GitHub** :
   - Créer un nouveau repository sur GitHub
   - Uploader tous les fichiers du projet
   - Aller dans Settings > Pages
   - Sélectionner "Deploy from a branch" > "main" > "/ (root)"
   - Le site sera accessible à `https://votre-username.github.io/nom-du-repo`

2. **Vérification** :
   - Attendre 5-10 minutes pour le déploiement
   - Tester toutes les pages et fonctionnalités

## 🎨 Personnalisation

### Changer le nom du destinataire
Dans `assets/js/main.js`, ligne 25 :
```javascript
recipientName: 'Laura' // Remplacer par le nom souhaité
```

### Modifier les couleurs
Dans `assets/css/base.css`, section `:root` :
```css
--color-primary: #FF6B35;    /* Orange principal */
--color-secondary: #F7931E;  /* Orange secondaire */
--color-accent: #FFD23F;     /* Jaune accent */
--color-bg: #FFF8E7;         /* Fond crème */
```

### Changer le code secret de la lettre
Dans `assets/js/lettre.js` :

1. **Générer un nouveau hash** (console du navigateur) :
```javascript
generateNewHash('votre-nouveau-code')
```

2. **Obfusquer le code** :
```javascript
obfuscateCode('votre-nouveau-code', 'votre-cle')
```

3. **Mettre à jour le fichier** :
```javascript
// Ligne 8 : Hash SHA-256
this.expectedHash = 'nouveau-hash-ici';

// Ligne 5 : Code obfusqué
this.obfuscatedCode = 'code-obfusque-ici';
this.obfuscationKey = 'votre-cle';
```

## 📸 Ajouter des photos

1. **Préparer les images** :
   - Format : JPG, 800x600px minimum
   - Taille optimale : 1200x800px
   - Compression : 80-90%

2. **Placer les fichiers** :
   - Remplacer `assets/img/photos/01.jpg` à `10.jpg`
   - Garder les noms de fichiers identiques

3. **Mettre à jour les données** :
   - Modifier `data/photos.json` pour les légendes
   - Ajuster `data/places.json` pour les lieux

## 🗺️ Modifier les lieux

Dans `data/places.json` :
```json
{
  "id": "nouveau_lieu",
  "name": "Nom du lieu",
  "lat": 45.7640,
  "lng": 4.8357,
  "note": "Description du lieu"
}
```

## ❓ Personnaliser le quiz

Dans `data/quiz.json` :
```json
{
  "id": "q1",
  "question": "Votre question ?",
  "choices": ["Choix 1", "Choix 2", "Choix 3", "Choix 4"],
  "answerIndex": 0
}
```

## 🎁 Modifier les cadeaux

Dans `data/gifts.json` :

### Ajouter un nouveau cadeau :
```json
{
  "name": "Nom du cadeau",
  "rarity": "COMMON|RARE|EPIC",
  "description": "Description du cadeau",
  "icon": "🎁"
}
```

### Ajuster les probabilités :
```json
"dropTables": [
  {
    "minScore": 0,
    "weights": {
      "COMMON": 80,  // 80% de chance
      "RARE": 18,    // 18% de chance
      "EPIC": 2      // 2% de chance
    }
  }
]
```

## 💌 Personnaliser la lettre

Dans `assets/js/lettre.js`, fonction `getLetterText()` :
```javascript
return `
    Ma chérie [Nom],

    Votre message personnalisé ici...

    Avec tout mon amour,
    [Votre nom] 💜
`;
```

## 🎵 Ajouter de la musique

1. **Préparer les fichiers audio** :
   - `assets/audio/ambient.mp3` (format principal)
   - `assets/audio/ambient.ogg` (format alternatif)
   - Durée : 2-5 minutes en boucle
   - Taille : < 5MB par fichier

2. **Sources libres de droits** :
   - Freesound.org
   - YouTube Audio Library
   - Incompetech.com

## 🔧 Structure du projet

```
/
├── index.html              # Page d'accueil
├── album.html              # Album photo + carte
├── lettre.html             # Lettre d'amour
├── quiz.html               # Quiz interactif
├── assets/
│   ├── css/               # Styles CSS
│   ├── js/                # Modules JavaScript
│   ├── img/               # Images et photos
│   └── audio/             # Fichiers audio
├── data/                  # Données JSON
└── README.md              # Ce fichier
```

## 🐛 Résolution de problèmes

### Les photos ne s'affichent pas
- Vérifier que les fichiers existent dans `assets/img/photos/`
- Vérifier les noms de fichiers dans `data/photos.json`

### Le code de la lettre ne fonctionne pas
- Vérifier le hash dans `assets/js/lettre.js`
- Utiliser la console pour générer un nouveau hash

### La carte ne s'affiche pas
- Vérifier la connexion internet (Leaflet CDN)
- Vérifier les coordonnées dans `data/places.json`

### Le quiz ne fonctionne pas
- Vérifier la structure de `data/quiz.json`
- S'assurer que `answerIndex` est correct (0-3)

## 📱 Compatibilité

- ✅ Chrome, Firefox, Safari, Edge
- ✅ Mobile (iOS/Android)
- ✅ Tablette
- ✅ Desktop

## 🎯 Fonctionnalités

- 📸 Album photo interactif avec lightbox
- 🗺️ Carte Leaflet avec marqueurs personnalisés
- 🔐 Lettre d'amour avec code secret
- 🎮 Quiz avec système de récompenses
- 🎁 Système de loot avec raretés
- 📱 Design responsive
- ♿ Accessibilité de base
- 💾 Stockage local des préférences

## 💜 Créé avec amour

Ce site a été créé avec beaucoup d'amour pour Laura. N'hésitez pas à le personnaliser selon vos besoins !

---

**Note** : Pour toute question ou problème, consultez la console du navigateur (F12) pour les erreurs JavaScript.
