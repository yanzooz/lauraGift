/**
 * Module Lettre - Gestion du code secret et affichage de la lettre
 */
import { Storage } from './storage.js';

class LetterManager {
    constructor() {
        // Code secret obfusqué (XOR + base64)
        // Pour changer le code, modifier la valeur ci-dessous et régénérer le hash
        this.obfuscatedCode = 'MDAwMDAwMDAw'; // "04112000" obfusqué avec la clé "love"
        this.obfuscationKey = 'love';
        
        // Hash SHA-256 du code correct (généré avec hashSHA256('04112000'))
        this.expectedHash = 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3';
        
        this.codeGate = document.getElementById('codeGate');
        this.letterContainer = document.getElementById('letterContainer');
        this.codeForm = document.getElementById('codeForm');
        this.codeInput = document.getElementById('secretCode');
        this.codeError = document.getElementById('codeError');
        
        this.init();
    }

    init() {
        this.setupForm();
        this.checkUnlockStatus();
        this.setupPrintDownload();
    }

    /**
     * Vérifie si la lettre est déjà déverrouillée
     */
    checkUnlockStatus() {
        if (Storage.isLetterUnlocked()) {
            this.unlockLetter();
        }
    }

    /**
     * Configure le formulaire de code
     */
    setupForm() {
        if (!this.codeForm) return;

        this.codeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleCodeSubmission();
        });

        // Validation en temps réel
        this.codeInput.addEventListener('input', () => {
            this.clearError();
        });

        // Focus automatique
        this.codeInput.focus();
    }

    /**
     * Gère la soumission du code
     */
    async handleCodeSubmission() {
        const enteredCode = this.codeInput.value.trim().toLowerCase();
        
        if (!enteredCode) {
            this.showError('Veuillez entrer un code');
            return;
        }

        // Vérification du code
        const isValid = await this.validateCode(enteredCode);
        
        if (isValid) {
            this.unlockLetter();
            Storage.unlockLetter();
        } else {
            this.showError('Code incorrect. Essaie encore ! 💜');
            this.codeInput.value = '';
            this.codeInput.focus();
        }
    }

    /**
     * Valide le code entré
     */
    async validateCode(enteredCode) {
        try {
            // Code secret : 04112000
            if (enteredCode === '04112000') {
                return true;
            }

            // Méthode 1: Vérification par hash SHA-256
            const enteredHash = await window.Utils.hashSHA256(enteredCode);
            if (enteredHash === this.expectedHash) {
                return true;
            }

            // Méthode 2: Vérification par déchiffrement XOR
            const decryptedCode = window.Utils.decodeXorBase64(this.obfuscatedCode, this.obfuscationKey);
            if (enteredCode === decryptedCode.toLowerCase()) {
                return true;
            }

            return false;
        } catch (error) {
            console.warn('Erreur de validation du code:', error);
            return false;
        }
    }

    /**
     * Déverrouille la lettre
     */
    unlockLetter() {
        // Masquer le formulaire de code
        this.codeGate.style.display = 'none';
        
        // Afficher la lettre
        this.letterContainer.style.display = 'block';
        
        // Charger le contenu de la lettre
        this.loadLetterContent();
        
        // Animation d'apparition
        requestAnimationFrame(() => {
            this.letterContainer.style.opacity = '0';
            this.letterContainer.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                this.letterContainer.style.transition = 'all 0.5s ease-out';
                this.letterContainer.style.opacity = '1';
                this.letterContainer.style.transform = 'translateY(0)';
            });
        });
    }

    /**
     * Charge le contenu de la lettre
     */
    async loadLetterContent() {
        const letterContent = document.getElementById('letterContent');
        const letterDate = document.getElementById('letterDate');
        
        if (!letterContent || !letterDate) return;

        try {
            // Date actuelle
            letterDate.textContent = this.formatDate(new Date());
            
            // Contenu de la lettre
            const letterText = await this.getLetterText();
            letterContent.innerHTML = this.formatLetterContent(letterText);
            
        } catch (error) {
            console.error('Erreur lors du chargement de la lettre:', error);
            letterContent.innerHTML = '<p>Erreur lors du chargement de la lettre.</p>';
        }
    }

    /**
     * Récupère le texte de la lettre
     */
    async getLetterText() {
        // Votre magnifique texte d'amour
        return `
            Bon anniversaire mon amour, l'amour de ma vie que j'aime.

            Je te souhaite de passer un merveilleux anniversaire entourée de toute ta famille et de toutes les personnes que tu aimes. Tu es ma raison de vivre et d'avancer, mon deuxième poumon sans lequel je ne pourrais avancer. Je remercie mon Dieu de m'avoir permis de croiser ton chemin.

            Déjà 1 an que nous sommes ensemble, et le temps passe comme une fusée. Je suis tellement reconnaissant de ce que nous avons accompli ensemble jusqu'à présent, d'avoir appris à nous connaître et de ne jamais avoir cessé de nous aimer. J'ai tellement hâte de découvrir ce que l'avenir nous réserve. J'espère que nous réaliserons nos rêves.

            Nous avons encore tant de choses à découvrir l'un et l'autre. Le temps nous demande d'abord de nous chercher professionnellement, mais je sais que notre moment viendra et que nous ferons tout ce dont nous avons toujours rêvé : voyager, découvrir, nous épanouir, nous marier, avoir des enfants… Je le sais au plus profond de moi, et c'est pour cela que nous devons nous serrer les coudes pour vivre notre rêve.

            Je t'aime mon amour, et j'espère que tu seras la dernière personne que j'aimerai sur cette Terre.
        `;
    }

    /**
     * Formate le contenu de la lettre en HTML
     */
    formatLetterContent(text) {
        return text
            .split('\n')
            .map(paragraph => {
                const trimmed = paragraph.trim();
                if (!trimmed) return '';
                return `<p>${trimmed}</p>`;
            })
            .join('');
    }

    /**
     * Configure les boutons d'impression et de téléchargement
     */
    setupPrintDownload() {
        const printBtn = document.getElementById('printLetter');
        const downloadBtn = document.getElementById('downloadLetter');

        if (printBtn) {
            printBtn.addEventListener('click', () => this.printLetter());
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadLetter());
        }
    }

    /**
     * Imprime la lettre
     */
    printLetter() {
        const letter = document.querySelector('.letter');
        if (!letter) return;

        // Créer une fenêtre d'impression
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Lettre d'amour - Laura</title>
                <style>
                    body { 
                        font-family: 'Caveat', cursive; 
                        line-height: 1.8; 
                        max-width: 800px; 
                        margin: 0 auto; 
                        padding: 20px;
                        color: #1F1B2D;
                    }
                    .letter { 
                        background: white; 
                        padding: 40px; 
                        border-radius: 10px; 
                        box-shadow: 0 4px 12px rgba(124, 77, 255, 0.1);
                    }
                    .letter__header { 
                        text-align: center; 
                        margin-bottom: 30px; 
                        padding-bottom: 20px; 
                        border-bottom: 1px solid #B388FF; 
                    }
                    .letter__date { 
                        color: #5A4A6A; 
                        font-size: 18px; 
                    }
                    .letter__content p { 
                        margin-bottom: 20px; 
                        font-size: 18px; 
                    }
                    .letter__signature { 
                        text-align: right; 
                        margin-top: 40px; 
                        padding-top: 20px; 
                        border-top: 1px solid #B388FF; 
                    }
                    .letter__signature-text { 
                        color: #5A4A6A; 
                        margin-bottom: 10px; 
                    }
                    .letter__signature-name { 
                        color: #7C4DFF; 
                        font-weight: 600; 
                        font-size: 20px; 
                    }
                    @media print {
                        body { margin: 0; padding: 0; }
                        .letter { box-shadow: none; }
                    }
                </style>
            </head>
            <body>
                ${letter.outerHTML}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    /**
     * Télécharge la lettre en format texte
     */
    downloadLetter() {
        const letterContent = document.getElementById('letterContent');
        const letterDate = document.getElementById('letterDate');
        
        if (!letterContent || !letterDate) return;

        // Extraire le texte de la lettre
        const textContent = letterContent.innerText;
        const date = letterDate.textContent;
        
        // Créer le contenu du fichier
        const fileContent = `Lettre d'amour - ${date}\n\n${textContent}\n\nFait avec 💜`;
        
        // Créer et télécharger le fichier
        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `lettre-amour-${date.replace(/\s+/g, '-').toLowerCase()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }

    /**
     * Affiche un message d'erreur
     */
    showError(message) {
        if (this.codeError) {
            this.codeError.textContent = message;
            this.codeError.style.display = 'block';
        }
    }

    /**
     * Efface le message d'erreur
     */
    clearError() {
        if (this.codeError) {
            this.codeError.textContent = '';
            this.codeError.style.display = 'none';
        }
    }

    /**
     * Formate une date
     */
    formatDate(date) {
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Fonction utilitaire pour générer un nouveau hash (à utiliser dans la console)
window.generateNewHash = async function(code) {
    const hash = await window.Utils.hashSHA256(code);
    console.log(`Hash pour "${code}": ${hash}`);
    return hash;
};

// Fonction utilitaire pour obfusquer un code (à utiliser dans la console)
window.obfuscateCode = function(code, key = 'love') {
    const obfuscated = window.Utils.xorBase64(code, key);
    console.log(`Code "${code}" obfusqué avec la clé "${key}": ${obfuscated}`);
    return obfuscated;
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new LetterManager();
});
