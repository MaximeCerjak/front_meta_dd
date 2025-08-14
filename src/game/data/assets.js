// Configuration des assets locaux
export const ASSETS = {
    player: {
        walkSprite: {
            path: '/assets/players/playerMove.png',
            frameWidth: 64,
            frameHeight: 64
        },
        idleSprite: {
            path: '/assets/players/playerIdle.png',
            frameWidth: 64,
            frameHeight: 64
        }
    },
    map: {
        introMap: {
            jsonFile: {
                path: '/assets/maps/intro/receptionMap.json'
            },
            layerFiles: [
                { path: '/assets/maps/intro/adminlayer1.png' },
                { path: '/assets/maps/intro/adminlayer2.png' }
            ]
        },
        welcomeisleMap: {
            jsonFile: {
                path: '/assets/maps/welcomeisle/welcomeisleMap.json'
            },
            layerFiles: [
                { path: '/assets/maps/welcomeisle/welcomeisle.png' }
            ]
        },
        museumreceptionMap: {
            jsonFile: {
                path: '/assets/maps/museum/museumReceptionMap.json'
            },
            layerFiles: [
                { path: '/assets/maps/museum/museumreception.png' },
                { path: '/assets/maps/museum/museumreceptionaccessories.png' }
            ]
        },
        exhibitionroomMap: {
            jsonFile: {
                path: '/assets/maps/museum/exhibitionRoomMap.json'
            },
            layerFiles: [
                { path: '/assets/maps/museum/museumexhibition.png' },
                { path: '/assets/maps/museum/museumexhibitionaccessories.png' }
            ]
        },
        sandboxMap: {
            jsonFile: {
                path: '/assets/maps/sandbox/sandboxMap.json'
            },
            layerFiles: [
                { path: '/assets/maps/sandbox/sandbox.png' }
            ]
        },
    },
    npcs: {
        receptionist: {
            path: '/assets/pnjs/NPCWalk.png',
            frameWidth: 64,
            frameHeight: 64
        }
    },
    environment: {
        portal: {
            path: '/assets/environment/portal.png',
            frameWidth: 64,
            frameHeight: 71
        }
    }
}; 