describe('Text Helpers', () => {
  // Simulation des fonctions internes du controller
  const countWords = (text) => {
    return text.trim().split(/\s+/).length;
  };

  const isResponseComplete = (text) => {
    const lastChar = text.trim().slice(-1);
    const validEndings = ['.', '!', '?', '…', '»', '"'];
    return validEndings.includes(lastChar);
  };

  const smartTruncate = (text, maxWords = 120) => {
    const words = text.trim().split(/\s+/);
    
    if (words.length <= maxWords) {
      return text;
    }
    
    let truncateIndex = maxWords;
    for (let i = Math.min(maxWords, words.length - 1); i > maxWords * 0.7; i--) {
      const word = words[i];
      if (word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) {
        truncateIndex = i + 1;
        break;
      }
    }
    
    const truncated = words.slice(0, truncateIndex).join(' ');
    
    if (truncateIndex < words.length && !truncated.endsWith('...')) {
      return truncated + '…';
    }
    
    return truncated;
  };

  describe('countWords', () => {
    test('devrait compter les mots correctement', () => {
      expect(countWords("Bonjour le monde")).toBe(3);
      expect(countWords("  Un   seul  mot  ")).toBe(3);
      expect(countWords("")).toBe(1); // split retourne [""]
    });
  });

  describe('isResponseComplete', () => {
    test('devrait détecter les réponses complètes', () => {
      expect(isResponseComplete("Bonjour le monde.")).toBe(true);
      expect(isResponseComplete("Une question ?")).toBe(true);
      expect(isResponseComplete("Quelle surprise !")).toBe(true);
      expect(isResponseComplete("En cours")).toBe(false);
    });
  });

  describe('smartTruncate', () => {
    test('devrait tronquer intelligemment les textes longs', () => {
      const longText = "Ceci est un texte très long qui dépasse la limite de mots autorisés. Il contient plusieurs phrases et devrait être tronqué de manière intelligente. La troncature devrait préserver le sens.";
      const truncated = smartTruncate(longText, 10);
      
      expect(countWords(truncated)).toBeLessThanOrEqual(11); // +1 pour "…"
      expect(truncated).toMatch(/…$/);
    });

    test('ne devrait pas tronquer les textes courts', () => {
      const shortText = "Texte court.";
      const result = smartTruncate(shortText, 10);
      
      expect(result).toBe(shortText);
    });
  });
});