export default class DialogueBox {
    constructor(scene, x, y, width, height, eventEmitter) {
        this.scene = scene;
        this.eventEmitter = eventEmitter;
        this.selectedOptionIndex = 0;

        this.colors = {
            boxBg: 0x3a2817, 
            boxBorder: 0x8b6f47, 
            textColor: '#f4e4bc', 
            optionDefault: '#94b8d8', 
            optionSelected: '#f4d03f', 
            buttonBg: 0x5c4033,  
            shadowColor: 0x1a1a1a    
        };

        this.createDialogueBox(x, y, width, height);
        this.hide();

        this.dialogueContext = null;
        this.currentDialogue = null;
        this.optionButtons = [];
        
        this.keyboardHandler = null;
        this.cursors = null;
        this.enterKey = null;
    }

    createDialogueBox(x, y, width, height) {
        this.container = this.scene.add.container(x, y);
        this.container.setDepth(10);

        this.shadow = this.scene.add.rectangle(4, 4, width, height, this.colors.shadowColor, 0.6);
        this.shadow.setOrigin(0);
        this.container.add(this.shadow);

        this.backgroundOuter = this.scene.add.rectangle(0, 0, width, height, this.colors.boxBorder);
        this.backgroundOuter.setOrigin(0);
        this.container.add(this.backgroundOuter);

        this.backgroundInner = this.scene.add.rectangle(4, 4, width - 8, height - 8, this.colors.boxBg);
        this.backgroundInner.setOrigin(0);
        this.container.add(this.backgroundInner);

        this.addPixelCorners(width, height);

        this.text = this.scene.add.text(16, 16, '', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: this.colors.textColor,
            wordWrap: { width: width - 32 },
            lineSpacing: 2
        });
        this.text.setOrigin(0);
        this.container.add(this.text);

        this.createNextButton(width, height);
    }

    addPixelCorners(width, height) {
        const cornerSize = 8;
        const cornerColor = this.colors.optionSelected;

        const topLeft = this.scene.add.rectangle(4, 4, cornerSize, cornerSize, cornerColor, 0.8);
        topLeft.setOrigin(0);
        this.container.add(topLeft);

        const topRight = this.scene.add.rectangle(width - 4 - cornerSize, 4, cornerSize, cornerSize, cornerColor, 0.8);
        topRight.setOrigin(0);
        this.container.add(topRight);

        const bottomLeft = this.scene.add.rectangle(4, height - 4 - cornerSize, cornerSize, cornerSize, cornerColor, 0.8);
        bottomLeft.setOrigin(0);
        this.container.add(bottomLeft);

        const bottomRight = this.scene.add.rectangle(width - 4 - cornerSize, height - 4 - cornerSize, cornerSize, cornerSize, cornerColor, 0.8);
        bottomRight.setOrigin(0);
        this.container.add(bottomRight);
    }

    createNextButton(width, height) {
        const buttonWidth = 80;
        const buttonHeight = 24;
        const buttonX = width - buttonWidth - 16;
        const buttonY = height - buttonHeight - 12;

        this.nextButtonGroup = this.scene.add.container(buttonX, buttonY);
        this.container.add(this.nextButtonGroup);

        this.nextButtonBg = this.scene.add.rectangle(0, 0, buttonWidth, buttonHeight, this.colors.buttonBg);
        this.nextButtonBg.setOrigin(0);
        this.nextButtonBg.setInteractive();

        this.nextButtonGroup.add(this.nextButtonBg);
        this.nextButtonBorder = this.scene.add.rectangle(-2, -2, buttonWidth + 4, buttonHeight + 4, this.colors.boxBorder);
        this.nextButtonBorder.setOrigin(0);
        this.nextButtonGroup.add(this.nextButtonBorder);
        this.nextButtonGroup.sendToBack(this.nextButtonBorder);

        this.nextButtonText = this.scene.add.text(buttonWidth / 2, buttonHeight / 2, '▶ Suivant', {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: this.colors.textColor,
            fontStyle: 'bold'
        });
        this.nextButtonText.setOrigin(0.5);

        this.nextButtonGroup.add(this.nextButtonText);

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
        this.selectedOptionIndex = 0;
        this.optionButtons.forEach(button => button.group.destroy());
        this.optionButtons = [];

        this.removeKeyboardControls();
    
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

        const optionGroup = this.scene.add.container(16, buttonY);
        this.container.add(optionGroup);

        const optionBg = this.scene.add.rectangle(0, 0, buttonWidth, buttonHeight, this.colors.buttonBg, 0.8);
        optionBg.setOrigin(0);
        optionGroup.add(optionBg);

        const optionBorder = this.scene.add.rectangle(-2, -2, buttonWidth + 4, buttonHeight + 4, this.colors.boxBorder, 0.6);
        optionBorder.setOrigin(0);
        optionGroup.add(optionBorder);
        optionGroup.sendToBack(optionBorder);

        const selectionIcon = this.scene.add.text(8, buttonHeight / 2, '►', {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: this.colors.optionSelected,
            fontStyle: 'bold'
        });
        selectionIcon.setOrigin(0, 0.5);
        selectionIcon.setVisible(index === this.selectedOptionIndex);
        optionGroup.add(selectionIcon);

        const optionText = this.scene.add.text(24, buttonHeight / 2, option.text, {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: index === this.selectedOptionIndex ? this.colors.optionSelected : this.colors.optionDefault,
            fontStyle: 'bold'
        });
        optionText.setOrigin(0, 0.5);
        optionGroup.add(optionText);

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
        this.removeKeyboardControls();

        this.keyboardHandler = (event) => {
            if (!this.container.visible || !this.optionButtons.length) {
                return;
            }

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

        this.scene.input.keyboard.on('keydown', this.keyboardHandler);
        
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
            
            button.text.setColor(isSelected ? this.colors.optionSelected : this.colors.optionDefault);
            button.icon.setVisible(isSelected);
            
            if (isSelected) {
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
                this.scene.tweens.killTweensOf(button.group);
                button.group.setScale(1);
            }
        });
    }

    selectOption(index) {
        const buttonData = this.optionButtons[index];
        const option = buttonData.option;
        
        if (!option) return;

        this.scene.tweens.add({
            targets: buttonData.group,
            scaleX: 0.95,
            scaleY: 0.95,
            duration: 100,
            yoyo: true,
            ease: 'Power2'
        });

        console.log(`Option sélectionnée : ${option.text}`);

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
        this.removeKeyboardControls();
        
        this.scene.tweens.add({
            targets: this.container,
            scale: 0.8,
            alpha: 0,
            duration: 150,
            ease: 'Power2',
            onComplete: () => {
                this.container.setVisible(false);
                
                if (this.optionButtons && this.optionButtons.length > 0) {
                    this.optionButtons.forEach(button => {
                        this.scene.tweens.killTweensOf(button.group);
                        button.group.destroy();
                    });
                    this.optionButtons = [];
                }
                
                this.selectedOptionIndex = 0;
            }
        });
    }

    destroy() {
        this.removeKeyboardControls();
        if (this.container) {
            this.container.destroy();
        }
    }
}