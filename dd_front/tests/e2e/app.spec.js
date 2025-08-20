import { test, expect } from '@playwright/test';

test.describe('DigitalDrifter Frontend', () => {
  test.beforeEach(async ({ page }) => {
    // Aller à la page d'accueil
    await page.goto('/');
  });

  test('should load the application', async ({ page }) => {
    // Vérifier que le titre de la page est correct
    await expect(page).toHaveTitle(/DigitalDrifter|Phaser/);
    
    // Vérifier que l'élément principal existe
    const appContainer = page.locator('#app, #root');
    await expect(appContainer).toBeVisible();
  });

  test('should load Phaser game canvas', async ({ page }) => {
    // Attendre que le canvas Phaser soit chargé
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });
    
    // Vérifier que le canvas a des dimensions valides
    const boundingBox = await canvas.boundingBox();
    expect(boundingBox?.width).toBeGreaterThan(0);
    expect(boundingBox?.height).toBeGreaterThan(0);
  });

  test('should be responsive', async ({ page }) => {
    // Test sur desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('#app, #root')).toBeVisible();
    
    // Test sur mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('#app, #root')).toBeVisible();
  });

  test('should handle game initialization', async ({ page }) => {
    // Attendre que Phaser soit initialisé
    await page.waitForFunction(
      () => window.game && window.game.scene,
      { timeout: 15000 }
    );
    
    // Vérifier que le jeu est bien initialisé
    const gameExists = await page.evaluate(() => {
      return typeof window.game !== 'undefined';
    });
    
    expect(gameExists).toBe(true);
  });

  test('should not have console errors', async ({ page }) => {
    const errors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForTimeout(5000); // Attendre le chargement complet
    
    // Filtrer les erreurs connues/acceptables
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('DevTools') &&
      !error.includes('Extension')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});