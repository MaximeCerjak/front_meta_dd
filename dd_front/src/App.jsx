import React, { useRef, useState } from 'react';

import { EventBus } from './game/EventBus';
import { PhaserGame } from './game/PhaserGame';

function App() {
    // Références pour PhaserGame
    const phaserRef = useRef();

    // État de la scène active et autres indicateurs
    const [currentSceneKey, setCurrentSceneKey] = useState('Boot');
    const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });

    // Suivre la position du joueur (via EventBus)
    EventBus.on('player-position-updated', (position) => {
        setPlayerPosition(position);
    });

    // Gérer la scène courante (via EventBus ou phaserRef)
    const handleSceneChange = (scene) => {
        setCurrentSceneKey(scene.scene.key);
        console.log(`Scène active mise à jour : ${scene.scene.key}`);
    };

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={handleSceneChange} />
        </div>
    );
}

export default App;
