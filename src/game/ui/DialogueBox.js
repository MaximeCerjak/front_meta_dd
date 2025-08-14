export default class DialogueBox {
    constructor(scene, x, y, width, height, eventEmitter) {
        this.scene = scene;
        this.eventEmitter = eventEmitter;
        this.selectedOptionIndex = 0;

        // Couleurs pixel art
        this.colors = {
            boxBg: 0x3a2817,            // Background principal
            boxBorder: 0x8b6f47,        // Bordures
            textColor: '#f4e4bc',      // Texte principal
            optionDefault: '#94b8d8',   // Options
            optionSelected: '#f4d03f',  // Sélection
            buttonBg: 0x5c4033,       // Boutons
            shadowColor: 0x1a1a1a     // Ombre
        };

        this.createDialogueBox(x, y, width, height);
        this.hide();

        // Variables pour suivre l'état du dialogue
        this.dialogueContext = null;
        this.currentDialogue = null;
        this.optionButtons = [];
        
        // Variables pour la gestion des événements clavier
        this.keyboardHandler = null;
        this.cursors = null;
        this.enterKey = null;
    }

    createDialogueBox(x, y, width, height) {
        // Créer un groupe pour tous les éléments de la boîte
        this.container = this.scene.add.container(x, y);
        this.container.setDepth(10);

        // Ombre de la boîte (effet de profondeur pixel)
        this.shadow = this.scene.add.rectangle(4, 4, width, height, this.colors.shadowColor, 0.6);
        this.shadow.setOrigin(0);
        this.container.add(this.shadow);

        // Fond principal avec effet de bordure pixel
        this.backgroundOuter = this.scene.add.rectangle(0, 0, width, height, this.colors.boxBorder);
        this.backgroundOuter.setOrigin(0);
        this.container.add(this.backgroundOuter);

        // Fond intérieur (simule une bordure épaisse)
        this.backgroundInner = this.scene.add.rectangle(4, 4, width - 8, height - 8, this.colors.boxBg);
        this.backgroundInner.setOrigin(0);
        this.container.add(this.backgroundInner);

        // Ajout de détails décoratifs (coins pixels)
        this.addPixelCorners(width, height);

        // Texte principal avec police pixel
        this.text = this.scene.add.text(16, 16, '', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: this.colors.textColor,
            wordWrap: { width: width - 32 },
            lineSpacing: 2
        });
        this.text.setOrigin(0);
        this.container.add(this.text);

        // Bouton "Suivant" avec style pixel
        this.createNextButton(width, height);
    }

    addPixelCorners(width, height) {
        // Ajouter des détails décoratifs dans les coins
        const cornerSize = 8;
        const cornerColor = this.colors.optionSelected;

        // Coin supérieur gauche
        const topLeft = this.scene.add.rectangle(4, 4, cornerSize, cornerSize, cornerColor, 0.8);
        topLeft.setOrigin(0);
        this.container.add(topLeft);

        // Coin supérieur droit
        const topRight = this.scene.add.rectangle(width - 4 - cornerSize, 4, cornerSize, cornerSize, cornerColor, 0.8);
        topRight.setOrigin(0);
        this.container.add(topRight);

        // Coin inférieur gauche
        const bottomLeft = this.scene.add.rectangle(4, height - 4 - cornerSize, cornerSize, cornerSize, cornerColor, 0.8);
        bottomLeft.setOrigin(0);
        this.container.add(bottomLeft);

        // Coin inférieur droit
        const bottomRight = this.scene.add.rectangle(width - 4 - cornerSize, height - 4 - cornerSize, cornerSize, cornerSize, cornerColor, 0.8);
        bottomRight.setOrigin(0);
        this.container.add(bottomRight);
    }

    createNextButton(width, height) {
        const buttonWidth = 80;
        const buttonHeight = 24;
        const buttonX = width - buttonWidth - 16;
        const buttonY = height - buttonHeight - 12;

        // Groupe pour le bouton
        this.nextButtonGroup = this.scene.add.container(buttonX, buttonY);
        this.container.add(this.nextButtonGroup);

        // Fond du bouton avec bordure pixel
        this.nextButtonBg = this.scene.add.rectangle(0, 0, buttonWidth, buttonHeight, this.colors.buttonBg);
        this.nextButtonBg.setOrigin(0);
        this.nextButtonBg.setInteractive();
        this.nextButtonGroup.add(this.nextButtonBg);

        // Bordure du bouton
        this.nextButtonBorder = this.scene.add.rectangle(-2, -2, buttonWidth + 4, buttonHeight + 4, this.colors.boxBorder);
        this.nextButtonBorder.setOrigin(0);
        this.nextButtonGroup.add(this.nextButtonBorder);
        this.nextButtonGroup.sendToBack(this.nextButtonBorder);

        // Texte du bouton
        this.nextButtonText = this.scene.add.text(buttonWidth / 2, buttonHeight / 2, '▶ Suivant', {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: this.colors.textColor,
            fontStyle: 'bold'
        });
        this.nextButtonText.setOrigin(0.5);
        this.nextButtonGroup.add(this.nextButtonText);

        // Effet hover
        this.nextButtonBg.on('pointerover', () => {
            this.nextButtonBg.setFillStyle(this.colors.boxBorder);
            this.nextButtonText.setColor(this.colors.optionSelected);
        });

        this.nextButtonBg.on('pointerout', () => {
            this.nextButtonBg.setFillStyle(this.colors.buttonBg);
            this.nextButtonText.setColor(this.colors.textColor);
        });

        this.nextButtonBg.on('pointerdown', () => {
            this.nextDialogue();
        });
    }

    show(dialogueContext, startKey) {
        this.dialogueContext = dialogueContext;
        this.currentDialogue = this.dialogueContext[startKey];

        this.container.setVisible(true);
        this.nextButtonGroup.setVisible(!this.currentDialogue.options || this.currentDialogue.options.length === 0);

        // Animation d'apparition
        this.container.setScale(0.8);
        this.container.setAlpha(0);
        this.scene.tweens.add({
            targets: this.container,
            scale: 1,
            alpha: 1,
            duration: 200,
            ease: 'Power2'
        });

        this.updateText(this.currentDialogue);
    }

    nextDialogue() {
        if (this.currentDialogue.next) {
            this.currentDialogue = this.dialogueContext[this.currentDialogue.next];
            this.updateText(this.currentDialogue);
        } else {
            this.hide();
            console.log('Émission de l\'événement : dialogue-end');
            this.eventEmitter.emit('dialogue-end');
        }
    }

    updateText(dialogue) {
        this.text.setText(dialogue.text);
        
        // Réinitialiser l'index de sélection
        this.selectedOptionIndex = 0;
    
        // Supprimer les anciennes options
        this.optionButtons.forEach(button => button.group.destroy());
        this.optionButtons = [];
        
        // Nettoyer les anciens écouteurs d'événements
        this.removeKeyboardControls();
    
        // Ajouter de nouvelles options avec style pixel
        if (dialogue.options && dialogue.options.length > 0) {
            dialogue.options.forEach((option, index) => {
                this.createOptionButton(option, index);
            });
    
            this.nextButtonGroup.setVisible(false);
            this.setupKeyboardControls();
        } else if (dialogue.next) {
            this.nextButtonGroup.setVisible(true);
        } else {
            this.hide();
        }
    }

    createOptionButton(option, index) {
        const buttonY = 60 + index * 32;
        const buttonWidth = this.container.width - 32;
        const buttonHeight = 28;

        // Groupe pour chaque option
        const optionGroup = this.scene.add.container(16, buttonY);
        this.container.add(optionGroup);

        // Fond de l'option
        const optionBg = this.scene.add.rectangle(0, 0, buttonWidth, buttonHeight, this.colors.buttonBg, 0.8);
        optionBg.setOrigin(0);
        optionGroup.add(optionBg);

        // Bordure de l'option
        const optionBorder = this.scene.add.rectangle(-2, -2, buttonWidth + 4, buttonHeight + 4, this.colors.boxBorder, 0.6);
        optionBorder.setOrigin(0);
        optionGroup.add(optionBorder);
        optionGroup.sendToBack(optionBorder);

        // Icône de sélection
        const selectionIcon = this.scene.add.text(8, buttonHeight / 2, '►', {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: this.colors.optionSelected,
            fontStyle: 'bold'
        });
        selectionIcon.setOrigin(0, 0.5);
        selectionIcon.setVisible(index === this.selectedOptionIndex);
        optionGroup.add(selectionIcon);

        // Texte de l'option
        const optionText = this.scene.add.text(24, buttonHeight / 2, option.text, {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: index === this.selectedOptionIndex ? this.colors.optionSelected : this.colors.optionDefault,
            fontStyle: 'bold'
        });
        optionText.setOrigin(0, 0.5);
        optionGroup.add(optionText);

        // Rendre interactif
        optionBg.setInteractive();
        optionBg.on('pointerover', () => {
            this.selectedOptionIndex = index;
            this.highlightOption();
        });

        optionBg.on('pointerdown', () => {
            this.selectOption(index);
        });

        this.optionButtons.push({
            group: optionGroup,
            bg: optionBg,
            border: optionBorder,
            icon: selectionIcon,
            text: optionText,
            option
        });

        console.log(`Bouton créé pour l'option : ${option.text}`);
    }

    setupKeyboardControls() {
        // Supprimer les anciens écouteurs s'ils existent
        this.removeKeyboardControls();

        // Créer le gestionnaire d'événements clavier
        this.keyboardHandler = (event) => {
            // Vérifier si le dialogue est actif et s'il y a des options
            if (!this.container.visible || !this.optionButtons.length) {
                return;
            }

            // Empêcher la propagation pour éviter les conflits
            event.stopPropagation();

            if (event.code === 'ArrowUp') {
                event.preventDefault();
                this.selectedOptionIndex = (this.selectedOptionIndex - 1 + this.optionButtons.length) % this.optionButtons.length;
                this.highlightOption();
            } else if (event.code === 'ArrowDown') {
                event.preventDefault();
                this.selectedOptionIndex = (this.selectedOptionIndex + 1) % this.optionButtons.length;
                this.highlightOption();
            } else if (event.code === 'Enter' || event.code === 'Space') {
                event.preventDefault();
                this.selectOption(this.selectedOptionIndex);
            }
        };

        // Ajouter l'écouteur d'événements
        this.scene.input.keyboard.on('keydown', this.keyboardHandler);
        
        // Mettre en évidence l'option par défaut
        this.highlightOption();
    }

    removeKeyboardControls() {
        if (this.keyboardHandler) {
            this.scene.input.keyboard.off('keydown', this.keyboardHandler);
            this.keyboardHandler = null;
        }
    }

    highlightOption() {
        this.optionButtons.forEach((button, index) => {
            const isSelected = index === this.selectedOptionIndex;
            
            // Mettre à jour les couleurs
            button.text.setColor(isSelected ? this.colors.optionSelected : this.colors.optionDefault);
            button.icon.setVisible(isSelected);
            
            // Effet de pulsation sur l'option sélectionnée
            if (isSelected) {
                // Arrêter les animations précédentes
                this.scene.tweens.killTweensOf(button.group);
                
                this.scene.tweens.add({
                    targets: button.group,
                    scaleX: 1.02,
                    scaleY: 1.02,
                    duration: 150,
                    yoyo: true,
                    ease: 'Power2'
                });
            } else {
                // Arrêter les animations et remettre à l'échelle normale
                this.scene.tweens.killTweensOf(button.group);
                button.group.setScale(1);
            }
        });
    }

    selectOption(index) {
        const buttonData = this.optionButtons[index];
        const option = buttonData.option;
        
        if (!option) return;

        // Effet visuel de sélection
        this.scene.tweens.add({
            targets: buttonData.group,
            scaleX: 0.95,
            scaleY: 0.95,
            duration: 100,
            yoyo: true,
            ease: 'Power2'
        });

        console.log(`Option sélectionnée : ${option.text}`);

        // Délai pour l'effet visuel
        this.scene.time.delayedCall(150, () => {
            if (option.next) {
                this.currentDialogue = this.dialogueContext[option.next];
                this.updateText(this.currentDialogue);
            }

            if (option.action) {
                console.log(`Émission de l'événement : ${option.action}`);
                this.eventEmitter.emit(option.action);
            }

            if (!option.next) {
                this.hide();
            }
        });
    }

    hide() {
        // Supprimer les contrôles clavier
        this.removeKeyboardControls();
        
        // Animation de disparition
        this.scene.tweens.add({
            targets: this.container,
            scale: 0.8,
            alpha: 0,
            duration: 150,
            ease: 'Power2',
            onComplete: () => {
                this.container.setVisible(false);
                
                // Nettoyer les options
                if (this.optionButtons && this.optionButtons.length > 0) {
                    this.optionButtons.forEach(button => {
                        // Arrêter toutes les animations en cours
                        this.scene.tweens.killTweensOf(button.group);
                        button.group.destroy();
                    });
                    this.optionButtons = [];
                }
                
                // Réinitialiser l'index de sélection
                this.selectedOptionIndex = 0;
            }
        });
    }

    // Méthode pour nettoyer complètement le dialogue (utile lors de la destruction de la scène)
    destroy() {
        this.removeKeyboardControls();
        if (this.container) {
            this.container.destroy();
        }
    }
}