import React, { useState, useEffect } from 'react';
import { EventBus } from '../EventBus';
import InventoryUI from './InventoryUI';
import UploadDialog from './UploadDialog';
import MediaViewer from './MediaViewer';

const ExhibitionInterface = () => {
  const [inventoryState, setInventoryState] = useState({
    isOpen: false,
    inventoryManager: null
  });
  
  const [uploadState, setUploadState] = useState({
    isOpen: false,
    itemData: null
  });
  
  const [mediaViewerState, setMediaViewerState] = useState({
    isOpen: false,
    mediaData: null
  });

  const [showExhibitionButton, setShowExhibitionButton] = useState(false);

  useEffect(() => {
    const handleInventoryStateChange = (data) => {
      setInventoryState({
        isOpen: data.isOpen,
        inventoryManager: data.inventoryManager
      });
    };

    const handleUploadDialogOpen = (data) => {
      setUploadState({
        isOpen: true,
        itemData: data
      });
    };

    const handleMediaViewerOpen = (data) => {
      setMediaViewerState({
        isOpen: true,
        mediaData: data
      });
    };

    const handleSceneReady = (scene) => {
      if (scene && scene.exhibitionManager) {
        setShowExhibitionButton(true);
      } else {
        setShowExhibitionButton(false);
      }
    };

    EventBus.on('exhibition-inventory-state-changed', handleInventoryStateChange);
    EventBus.on('exhibition-upload-dialog-open', handleUploadDialogOpen);
    EventBus.on('exhibition-media-viewer-open', handleMediaViewerOpen);
    EventBus.on('current-scene-ready', handleSceneReady);

    return () => {
      EventBus.off('exhibition-inventory-state-changed', handleInventoryStateChange);
      EventBus.off('exhibition-upload-dialog-open', handleUploadDialogOpen);
      EventBus.off('exhibition-media-viewer-open', handleMediaViewerOpen);
      EventBus.off('current-scene-ready', handleSceneReady);
    };
  }, []);

  const handleInventoryClose = () => {
    EventBus.emit('exhibition-inventory-toggle');
  };

  const handleUploadComplete = (file, mediaType) => {
    EventBus.emit('exhibition-upload-complete', {
      file,
      mediaType,
      itemId: uploadState.itemData?.itemId
    });
    
    setUploadState({
      isOpen: false,
      itemData: null
    });
  };

  const handleUploadCancel = () => {
    EventBus.emit('exhibition-upload-cancel');
    setUploadState({
      isOpen: false,
      itemData: null
    });
  };

  const handleMediaViewerClose = () => {
    EventBus.emit('exhibition-media-close');
    setMediaViewerState({
      isOpen: false,
      mediaData: null
    });
  };

  const toggleInventory = () => {
    EventBus.emit('exhibition-inventory-toggle');
  };

  return (
    <>
      {/* Bouton flottant */}
      {showExhibitionButton && !inventoryState.isOpen && (
        <div className="exhibition-floating-button">
          <div className="button-container">
            <button 
              onClick={toggleInventory}
              className="exhibition-btn"
              title="Ouvrir l'inventaire d'exposition (Touche I)"
            >
              <div className="btn-border">
                <div className="btn-content">
                  <span className="btn-icon">🎒</span>
                </div>
              </div>
            </button>
            <div className="button-label">INVENTAIRE</div>
          </div>
        </div>
      )}

      {/* Interface d'inventaire */}
      <InventoryUI 
        isVisible={inventoryState.isOpen}
        onClose={handleInventoryClose}
        inventoryManager={inventoryState.inventoryManager}
      />

      {/* Dialog d'upload */}
      <UploadDialog 
        isVisible={uploadState.isOpen}
        onClose={handleUploadCancel}
        itemData={uploadState.itemData}
        onFileUploaded={handleUploadComplete}
      />

      {/* Visionneuse de médias */}
      <MediaViewer 
        isVisible={mediaViewerState.isOpen}
        onClose={handleMediaViewerClose}
        mediaData={mediaViewerState.mediaData}
      />

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        .exhibition-floating-button {
          position: fixed;
          bottom: 180px;
          right: 24px;
          z-index: 998;
          animation: slideInRight 0.5s ease-out;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .button-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .exhibition-btn {
          width: 64px;
          height: 64px;
          cursor: pointer;
          background: transparent;
          border: none;
          padding: 0;
          font-family: 'Press Start 2P', 'Courier New', monospace;
          transition: transform 0.1s ease;
          position: relative;
        }

        .exhibition-btn:hover {
          transform: scale(1.05);
        }

        .exhibition-btn:active {
          transform: scale(0.95);
        }

        .btn-border {
          width: 100%;
          height: 100%;
          background: #d4af37;
          border: 4px solid #000;
          box-shadow: 
            inset 2px 2px 0px #f4e06d,
            inset -2px -2px 0px #b8941f,
            4px 4px 0px #000;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .exhibition-btn:hover .btn-border {
          background: #f4e06d;
          box-shadow: 
            inset 2px 2px 0px #fff,
            inset -2px -2px 0px #d4af37,
            4px 4px 0px #000;
        }

        .exhibition-btn:active .btn-border {
          box-shadow: 
            inset -2px -2px 0px #f4e06d,
            inset 2px 2px 0px #b8941f,
            2px 2px 0px #000;
          transform: translate(2px, 2px);
        }

        .btn-content {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .btn-icon {
          font-size: 24px;
          text-shadow: 1px 1px 0px #000;
          filter: drop-shadow(1px 1px 0px #8b4513);
        }

        .button-label {
          font-family: 'Press Start 2P', 'Courier New', monospace;
          font-size: 6px;
          color: #f4e06d;
          text-shadow: 
            1px 1px 0px #000,
            -1px -1px 0px #000,
            1px -1px 0px #000,
            -1px 1px 0px #000;
          background: #8b4513;
          padding: 4px 8px;
          border: 2px solid #000;
          box-shadow: 
            inset 1px 1px 0px #a0522d,
            inset -1px -1px 0px #654321;
          white-space: nowrap;
          text-align: center;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0%, 70% { opacity: 1; }
          85%, 100% { opacity: 0.6; }
        }

        .exhibition-btn::before {
          content: '';
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          border: 2px solid #d4af37;
          opacity: 0;
          animation: pulse-ring 3s infinite;
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          80% {
            transform: scale(1.2);
            opacity: 0;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        .btn-border::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 2px,
            rgba(0, 0, 0, 0.1) 2px,
            rgba(0, 0, 0, 0.1) 4px
          );
          pointer-events: none;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .exhibition-floating-button {
            bottom: 100px;
            right: 16px;
          }

          .exhibition-btn {
            width: 56px;
            height: 56px;
          }

          .btn-icon {
            font-size: 20px;
          }

          .button-label {
            font-size: 5px;
            padding: 3px 6px;
          }
        }

        @media (max-width: 480px) {
          .exhibition-floating-button {
            bottom: 80px;
            right: 12px;
          }

          .exhibition-btn {
            width: 48px;
            height: 48px;
          }

          .btn-icon {
            font-size: 16px;
          }

          .button-label {
            font-size: 4px;
            padding: 2px 4px;
          }
        }

        .exhibition-btn:hover::before {
          animation: pulse-ring 1s infinite;
        }

        .btn-border::before {
          content: '';
          position: absolute;
          top: 4px;
          left: 4px;
          right: 4px;
          height: 8px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .exhibition-btn:hover .btn-border::before {
          opacity: 1;
        }
      `}</style>
    </>
  );
};

export default ExhibitionInterface;