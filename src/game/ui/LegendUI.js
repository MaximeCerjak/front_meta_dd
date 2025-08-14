// src/ui/LegendUI.js
export default class LegendUI {
  constructor(scene) {
    this.scene = scene;
    this.container = null;
    this.background = null;
    this.textContainer = null;
    this.closeHint = null;
    this.isVisible = false;
    
    this.createUI();
  }

  createUI() {
    // Conteneur principal
    this.container = this.scene.add.container(0, 0);
    this.container.setDepth(1000);
    this.container.setVisible(false);
    this.container.setScrollFactor(0);
    
    // Configuration du style
    this.config = {
      backgroundColor: 0x000000,
      backgroundAlpha: 0.8,
      borderColor: 0xffffff,
      borderWidth: 2,
      padding: 20,
      textStyle: {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#ffffff',
        align: 'left',
        wordWrap: { width: 360 }
      },
      hintStyle: {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#cccccc',
        align: 'center'
      }
    };
    
    // Fond
    this.background = this.scene.add.rectangle(0, 0, 400, 200, 
      this.config.backgroundColor, 
      this.config.backgroundAlpha
    );
    this.background.setStrokeStyle(this.config.borderWidth, this.config.borderColor);
    
    // Conteneur pour les textes (pour gérer le formatage)
    this.textContainer = this.scene.add.container(0, 0);
    
    // Hint de fermeture
    this.closeHint = this.scene.add.text(0, 80, '[Déplacez-vous pour fermer]', this.config.hintStyle);
    this.closeHint.setOrigin(0.5);
    
    // Assembler le conteneur
    this.container.add([this.background, this.textContainer, this.closeHint]);
  }

  show(text, options = {}) {
    console.log(text);
    // Options de positionnement
    const position = options.position || 'top';
    const offset = options.offset || { x: 0, y: 0 };
    
    // Nettoyer le conteneur de texte précédent
    this.textContainer.removeAll(true);
    
    // Créer le texte formaté
    this.createFormattedText(text);
    
    // Ajuster la taille du fond
    this.adjustBackgroundSize();
    
    // Positionner selon l'option
    this.positionContainer(position, offset);
    
    // Animation d'apparition
    this.container.setAlpha(0);
    this.container.setVisible(true);
    this.isVisible = true;
    
    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      duration: options.fadeInDuration || 200,
      ease: 'Power2',
      onComplete: () => {
        if (options.onShown) options.onShown();
      }
    });
  }

  createFormattedText(text) {
    const lines = text.split('\n');
    let yOffset = 0;
    const lineHeight = 24;
    const maxWidth = 360;
    
    lines.forEach(line => {
      // Parser chaque ligne pour détecter l'italique
      const parts = this.parseLineWithFormatting(line);
      let xOffset = 0;
      let currentLine = [];
      let currentLineWidth = 0;
      
      parts.forEach(part => {
        const style = {
          ...this.config.textStyle,
          fontStyle: part.italic ? 'italic' : 'normal',
          fontWeight: part.bold ? 'bold' : 'normal'
        };
        
        // Créer un objet texte temporaire pour mesurer
        const tempText = this.scene.add.text(0, 0, part.text, style);
        const partWidth = tempText.width;
        
        // Vérifier si on dépasse la largeur max
        if (currentLineWidth + partWidth > maxWidth && currentLine.length > 0) {
          // Afficher la ligne actuelle
          this.renderTextLine(currentLine, yOffset);
          yOffset += lineHeight;
          currentLine = [];
          currentLineWidth = 0;
          xOffset = 0;
        }
        
        currentLine.push({
          text: part.text,
          style,
          x: xOffset,
          width: partWidth
        });
        
        currentLineWidth += partWidth;
        xOffset += partWidth;
        
        // Supprimer le texte temporaire
        tempText.destroy();
      });
      
      // Afficher la dernière ligne
      if (currentLine.length > 0) {
        this.renderTextLine(currentLine, yOffset);
        yOffset += lineHeight;
      }
    });
    
    // Centrer verticalement le conteneur de texte
    const bounds = this.textContainer.getBounds();
    this.textContainer.setY(-bounds.height / 2);
  }

  parseLineWithFormatting(line) {
    const parts = [];
    let lastIndex = 0;

    // Supporte ***gras italic***, **gras**, *italic*
    const regex = /(\*\*\*([^*]+?)\*\*\*|\*\*([^*]+?)\*\*|\*([^*]+?)\*)/g;
    let match;

    while ((match = regex.exec(line)) !== null) {
        // Texte normal avant le match
        if (match.index > lastIndex) {
        parts.push({
            text: line.substring(lastIndex, match.index),
            italic: false,
            bold: false
        });
        }

        if (match[2]) {
            // ***gras italique***
            parts.push({ text: match[2], italic: true, bold: true });
        } else if (match[3]) {
            // **gras**
            parts.push({ text: match[3], italic: false, bold: true });
        } else if (match[4]) {
            // *italique*
            parts.push({ text: match[4], italic: true, bold: false });
        } else if (match[5]) {
            // Texte souligné
            parts.push({ text: match[5], underline: true, italic: false, bold: false });
        }

        lastIndex = match.index + match[0].length;
    }

    // Texte restant
    if (lastIndex < line.length) {
        parts.push({
        text: line.substring(lastIndex),
        italic: false,
        bold: false
        });
    }

    return parts;
    }

  renderTextLine(lineParts, yOffset) {
    const totalWidth = lineParts.reduce((sum, part) => sum + part.width, 0);
    const startX = -totalWidth / 2;
    
    lineParts.forEach(part => {
      const textObj = this.scene.add.text(startX + part.x, yOffset, part.text, part.style);
      textObj.setOrigin(0, 0.5);
      this.textContainer.add(textObj);
    });
  }

  hide(options = {}) {
    if (!this.isVisible) return;
    
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      duration: options.fadeOutDuration || 200,
      ease: 'Power2',
      onComplete: () => {
        this.container.setVisible(false);
        this.isVisible = false;
        if (options.onHidden) options.onHidden();
      }
    });
  }

  adjustBackgroundSize() {
    let bounds = { width: 400, height: 100 };
    
    if (this.textContainer && this.textContainer.list.length > 0) {
      bounds = this.textContainer.getBounds();
    }
    
    const padding = this.config.padding * 2;
    const hintHeight = 50;
    
    const width = Math.max(400, bounds.width + padding);
    const height = Math.max(150, bounds.height + padding + hintHeight);
    
    this.background.setSize(width, height);
    
    // Repositionner le hint en bas
    this.closeHint.setY((height / 2) - 25);
  }

  positionContainer(position, offset) {
    const camera = this.scene.cameras.main;
    const gameWidth = camera.width;
    const gameHeight = camera.height;
    
    const x = gameWidth / 2 + offset.x;
    let y = gameHeight / 2 + offset.y;
    
    switch(position) {
      case 'top':
        y = gameHeight * 0.25;
        break;
      case 'center':
        // Déjà centré
        break;
      case 'bottom':
        y = gameHeight * 0.75;
        break;
    }
    
    // Sauvegarder la position pour les mises à jour
    this.lastPosition = { position, offset };
    this.container.setPosition(x, y);
  }

  updatePosition() {
    if (this.isVisible && this.lastPosition) {
      this.positionContainer(this.lastPosition.position, this.lastPosition.offset);
    }
  }

  // Personnalisation du style
  setStyle(styleConfig) {
    Object.assign(this.config, styleConfig);
    
    if (styleConfig.backgroundColor !== undefined || styleConfig.backgroundAlpha !== undefined) {
      this.background.setFillStyle(
        styleConfig.backgroundColor || this.config.backgroundColor,
        styleConfig.backgroundAlpha || this.config.backgroundAlpha
      );
    }
    
    if (styleConfig.borderColor !== undefined || styleConfig.borderWidth !== undefined) {
      this.background.setStrokeStyle(
        styleConfig.borderWidth || this.config.borderWidth,
        styleConfig.borderColor || this.config.borderColor
      );
    }
    
    if (styleConfig.textStyle) {
      Object.assign(this.config.textStyle, styleConfig.textStyle);
    }
  }

  // Changer le texte du hint
  setHintText(text) {
    this.closeHint.setText(text);
  }

  destroy() {
    if (this.container) {
      this.container.destroy();
    }
  }
}