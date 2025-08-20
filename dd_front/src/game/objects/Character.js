export default class Character {
    constructor(scene, x, y, textureKey, frame = 0, speed = 100) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.speed = speed;

        // Taille de base 64²
        this.width = 64;
        this.height = 64;

        // Créer un sprite à partir de la texture passée
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, textureKey, frame);

        // Activer les physiques pour le sprite
        this.scene.physics.add.existing(this.sprite);

        // Ajuster le body physique
        this.sprite.body.setSize(this.width/2, this.height/2);
        this.sprite.body.setOffset(16, 30);
    }

    move(direction) {
        const body = this.sprite.body;

        // Réinitialiser les vitesses
        body.setVelocity(0);

        switch (direction) {
            case 'up':
                body.setVelocityY(-this.speed);
                break;
            case 'down':
                body.setVelocityY(this.speed);
                break;
            case 'left':
                body.setVelocityX(-this.speed);
                break;
            case 'right':
                body.setVelocityX(this.speed);
                break;
        }

        // Normaliser la vitesse pour garantir une cohérence
        body.velocity.normalize().scale(this.speed);
    }

    stop() {
        this.sprite.body.setVelocity(0);
    }
}
