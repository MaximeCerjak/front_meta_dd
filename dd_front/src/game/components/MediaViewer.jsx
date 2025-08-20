import React, { useState, useRef, useEffect } from 'react';

const MediaViewer = ({ isVisible, onClose, mediaData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isVisible && mediaData) {
      setIsLoading(true);
      setError(null);
      loadMediaContent();
    }
  }, [isVisible, mediaData]);

  const loadMediaContent = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (mediaData.file.isDemo) {
        generateDemoContent();
      } else {
        await processRealFile();
      }
      
      setIsLoading(false);
    } catch (err) {
      setError('ERREUR LORS DU CHARGEMENT DU CONTENU');
      setIsLoading(false);
    }
  };

  const generateDemoContent = () => {
    switch (mediaData.mediaType) {
      case 'document':
        setTotalPages(Math.floor(Math.random() * 10) + 1);
        break;
      case 'image':
        // Utiliser une image de placeholder
        break;
      case 'video':
        // Simuler une vidéo
        break;
      case 'audio':
        // Simuler un audio
        break;
      case '3d':
        // Simuler un modèle 3D
        break;
    }
  };

  const processRealFile = async () => {
    const file = mediaData.file;
    
    switch (mediaData.mediaType) {
      case 'image':
        const imageUrl = URL.createObjectURL(file);
        return imageUrl;
        
      case 'document':
        // Pour les PDFs et documents
        if (file.type === 'application/pdf') {
          // En production, on utiliserait PDF.js
          setTotalPages(1);
        }
        break;
        
      case 'video':
      case 'audio':
        return URL.createObjectURL(file);
        
      case '3d':
        // En production, on utiliserait Three.js ou un viewer 3D
        break;
    }
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    
    setCurrentPage(1);
    setError(null);
    onClose();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading-content">
          <div className="loading-border">
            <div className="loading-spinner">⏳</div>
            <div className="loading-text">CHARGEMENT DU CONTENU...</div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-content">
          <div className="error-border">
            <div className="error-icon">⌐</div>
            <div className="error-text">{error}</div>
          </div>
        </div>
      );
    }

    switch (mediaData.mediaType) {
      case 'image':
        return renderImageViewer();
      case 'document':
        return renderDocumentViewer();
      case 'video':
        return renderVideoViewer();
      case 'audio':
        return renderAudioViewer();
      case '3d':
        return render3DViewer();
      default:
        return (
          <div className="unsupported-content">
            <div className="unsupported-border">
              <div className="unsupported-icon">❓</div>
              <div className="unsupported-text">TYPE DE FICHIER NON SUPPORTÉ</div>
            </div>
          </div>
        );
    }
  };

  const renderImageViewer = () => {
    const imageUrl = mediaData.file.isDemo 
      ? `https://picsum.photos/800/600?random=${Math.random()}` 
      : URL.createObjectURL(mediaData.file);

    return (
      <div className="image-viewer">
        <div className="image-border">
          <img 
            src={imageUrl}
            alt={mediaData.file.name}
            className="image-content"
            onLoad={() => setIsLoading(false)}
            onError={() => setError('IMPOSSIBLE DE CHARGER L\'IMAGE')}
          />
        </div>
        <div className="image-info">
          <div className="info-border">
            <div className="info-line">📁 NOM: {mediaData.file.name}</div>
            <div className="info-line">🖼️ FORMAT: IMAGE</div>
          </div>
        </div>
      </div>
    );
  };

  const renderDocumentViewer = () => {
    return (
      <div className="document-viewer">
        <div className="document-header">
          <div className="header-border">
            <div className="page-info">PAGE {currentPage} SUR {totalPages}</div>
            <div className="page-controls">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="page-btn"
              >
                ⬅️
              </button>
              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
                className="page-btn"
              >
                ➡️
              </button>
            </div>
          </div>
        </div>
        
        <div className="document-content">
          <div className="document-border">
            {mediaData.file.isDemo ? (
              <div className="demo-document">
                <div className="demo-header">📄 DOCUMENT DE DÉMONSTRATION</div>
                <div className="demo-page">PAGE {currentPage}</div>
                <div className="demo-text">
                  <div className="demo-line">► CECI EST UNE SIMULATION D'UN DOCUMENT</div>
                  <div className="demo-line">► EN PRODUCTION, LE CONTENU RÉEL SERAIT AFFICHÉ ICI</div>
                  <div className="demo-line"></div>
                  <div className="demo-line">► LE SYSTÈME SUPPORTERAIT:</div>
                  <div className="demo-line">  • DOCUMENTS PDF AVEC NAVIGATION</div>
                  <div className="demo-line">  • DOCUMENTS WORD CONVERTIS</div>
                  <div className="demo-line">  • FICHIERS TEXTE FORMATÉS</div>
                  <div className="demo-line">  • PRÉSENTATIONS POWERPOINT</div>
                  <div className="demo-line"></div>
                  <div className="demo-line">► L'UTILISATEUR POURRAIT NAVIGUER ENTRE LES PAGES</div>
                  <div className="demo-line">► ZOOMER ET TÉLÉCHARGER LE DOCUMENT ORIGINAL</div>
                </div>
              </div>
            ) : (
              <div className="real-document">
                <div className="real-doc-text">VISUALISATION DU DOCUMENT: {mediaData.file.name}</div>
                <div className="real-doc-text">EN PRODUCTION, LE CONTENU SERAIT RENDU ICI AVEC PDF.JS</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderVideoViewer = () => {
    const videoUrl = mediaData.file.isDemo 
      ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      : URL.createObjectURL(mediaData.file);

    return (
      <div className="video-viewer">
        <div className="video-border">
          <video 
            ref={videoRef}
            className="video-content"
            controls
            preload="metadata"
            onLoadedMetadata={() => setIsLoading(false)}
            onError={() => setError('IMPOSSIBLE DE CHARGER LA VIDÉO')}
          >
            <source src={videoUrl} type={mediaData.file.type || 'video/mp4'} />
            VOTRE NAVIGATEUR NE SUPPORTE PAS LA LECTURE VIDÉO
          </video>
        </div>
        <div className="video-info">
          <div className="info-border">
            <div className="info-line">📁 NOM: {mediaData.file.name}</div>
            <div className="info-line">🎬 FORMAT: VIDÉO</div>
            {mediaData.file.isDemo && (
              <div className="info-line demo-notice">► VIDÉO DE DÉMONSTRATION</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAudioViewer = () => {
    const audioUrl = mediaData.file.isDemo 
      ? 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
      : URL.createObjectURL(mediaData.file);

    return (
      <div className="audio-viewer">
        <div className="audio-visual">
          <div className="audio-border">
            <div className="audio-icon">🎵</div>
            <div className="audio-title">{mediaData.file.name}</div>
          </div>
        </div>
        
        <div className="audio-player">
          <div className="player-border">
            <audio 
              ref={audioRef}
              className="audio-content"
              controls
              preload="metadata"
              onLoadedMetadata={() => setIsLoading(false)}
              onError={() => setError('IMPOSSIBLE DE CHARGER L\'AUDIO')}
            >
              <source src={audioUrl} type={mediaData.file.type || 'audio/mpeg'} />
              VOTRE NAVIGATEUR NE SUPPORTE PAS LA LECTURE AUDIO
            </audio>
          </div>
        </div>
        
        <div className="audio-info">
          <div className="info-border">
            <div className="info-line">📁 NOM: {mediaData.file.name}</div>
            <div className="info-line">🎵 FORMAT: AUDIO</div>
            {mediaData.file.isDemo && (
              <div className="info-line demo-notice">► AUDIO DE DÉMONSTRATION</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const render3DViewer = () => {
    return (
      <div className="model-viewer">
        <div className="model-display">
          <div className="model-border">
            <div className="model-icon">🎭</div>
            <div className="model-title">MODÈLE 3D</div>
            <div className="demo-3d-content">
              <div className="rotating-cube">
                <div className="cube-face front">3D</div>
                <div className="cube-face back">3D</div>
                <div className="cube-face right">3D</div>
                <div className="cube-face left">3D</div>
                <div className="cube-face top">3D</div>
                <div className="cube-face bottom">3D</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="model-controls">
          <div className="controls-border">
            <div className="controls-info">
              <div className="info-line">📁 FICHIER: {mediaData.file.name}</div>
              <div className="info-line">🎭 TYPE: MODÈLE 3D</div>
            </div>
            <div className="control-buttons">
              <button className="control-btn">🔄 ROTATION</button>
              <button className="control-btn">🔍 ZOOM</button>
              <button className="control-btn">💡 ÉCLAIRAGE</button>
            </div>
            {mediaData.file.isDemo && (
              <div className="demo-notice">
                ► VISUALISEUR 3D DE DÉMONSTRATION
                ► EN PRODUCTION, LE MODÈLE RÉEL SERAIT RENDU AVEC THREE.JS
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!isVisible) return null;

  return (
    <div className="media-overlay">
      <div className="media-viewer-container">
        {/* Header */}
        <div className="media-header">
          <div className="header-border-top"></div>
          <div className="header-content">
            <div className="header-title">
              <span className="title-icon">👁️</span>
              <span className="title-text">CONSULTATION - {mediaData?.itemName || 'CONTENU'}</span>
            </div>
            <button 
              className="media-close-btn"
              onClick={handleClose}
              aria-label="Fermer la visionneuse"
            >
              ✕
            </button>
          </div>
          <div className="header-border-bottom"></div>
        </div>

        {/* Content */}
        <div className="media-content">
          <div className="content-border">
            {renderContent()}
          </div>
        </div>

        {/* Footer */}
        <div className="media-footer">
          <div className="footer-border">
            <div className="media-metadata">
              <span className="metadata-item">📄 {mediaData?.file?.name}</span>
              <span className="metadata-item">📊 {mediaData?.mediaType?.toUpperCase()}</span>
              {mediaData?.file?.size && (
                <span className="metadata-item">💾 {(mediaData.file.size / 1024 / 1024).toFixed(2)} MB</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        .media-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1003;
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .media-viewer-container {
          width: 90vw;
          height: 90vh;
          max-width: 1000px;
          max-height: 800px;
          background: #2d1b0e;
          border: 4px solid #000;
          box-shadow: 
            inset 2px 2px 0px #4a3426,
            inset -2px -2px 0px #1a0f08,
            8px 8px 0px #000;
          display: flex;
          flex-direction: column;
          font-family: 'Press Start 2P', 'Courier New', monospace;
          font-size: 8px;
          line-height: 1.4;
          image-rendering: pixelated;
          position: relative;
          overflow: hidden;
          animation: slideIn 0.4s ease-out;
        }

        @keyframes slideIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .media-header {
          background: #d4af37;
          border-bottom: 3px solid #000;
        }

        .header-border-top {
          height: 4px;
          background: repeating-linear-gradient(
            90deg,
            #f4e06d 0px,
            #f4e06d 4px,
            #b8941f 4px,
            #b8941f 8px
          );
        }

        .header-content {
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(180deg, #f4e06d 0%, #d4af37 50%, #b8941f 100%);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .title-icon {
          font-size: 16px;
          text-shadow: 2px 2px 0px #000;
        }

        .title-text {
          color: #1a0f08;
          text-shadow: 1px 1px 0px #f4e06d;
          font-size: 10px;
        }

        .media-close-btn {
          background: #8b4513;
          color: #f4e06d;
          border: 2px solid #000;
          width: 28px;
          height: 28px;
          cursor: pointer;
          font-family: inherit;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            inset 1px 1px 0px #a0522d,
            inset -1px -1px 0px #654321;
        }

        .media-close-btn:hover {
          background: #a0522d;
        }

        .media-close-btn:active {
          box-shadow: 
            inset -1px -1px 0px #a0522d,
            inset 1px 1px 0px #654321;
        }

        .header-border-bottom {
          height: 4px;
          background: repeating-linear-gradient(
            90deg,
            #b8941f 0px,
            #b8941f 4px,
            #8b7314 4px,
            #8b7314 8px
          );
        }

        .media-content {
          flex: 1;
          overflow: hidden;
          background: #2d1b0e;
          padding: 12px;
        }

        .content-border {
          border: 2px solid #553c26;
          background: #3a2918;
          height: 100%;
          overflow-y: auto;
          box-shadow: 
            inset 1px 1px 0px #4a3426,
            inset -1px -1px 0px #2d1b0e;
        }

        .content-border::-webkit-scrollbar {
          width: 12px;
        }

        .content-border::-webkit-scrollbar-track {
          background: #1a0f08;
          border: 2px solid #000;
        }

        .content-border::-webkit-scrollbar-thumb {
          background: #8b4513;
          border: 2px solid #000;
          box-shadow: 
            inset 1px 1px 0px #a0522d,
            inset -1px -1px 0px #654321;
        }

        /* Loading/Error States */
        .loading-content, .error-content, .unsupported-content {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }

        .loading-border, .error-border, .unsupported-border {
          background: #553c26;
          border: 2px solid #000;
          padding: 24px;
          text-align: center;
          box-shadow: 
            inset 1px 1px 0px #6b4932,
            inset -1px -1px 0px #3a2918;
        }

        .loading-spinner, .error-icon, .unsupported-icon {
          font-size: 32px;
          margin-bottom: 12px;
          display: block;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .loading-text, .error-text, .unsupported-text {
          color: #d4af37;
          font-size: 8px;
        }

        /* Image Viewer */
        .image-viewer {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 12px;
          gap: 12px;
        }

        .image-border {
          flex: 1;
          border: 2px solid #000;
          background: #000;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-content {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .image-info, .video-info, .audio-info {
          
        }

        .info-border {
          background: #553c26;
          border: 2px solid #000;
          padding: 8px;
          box-shadow: 
            inset 1px 1px 0px #6b4932,
            inset -1px -1px 0px #3a2918;
        }

        .info-line {
          color: #e6d7c3;
          font-size: 7px;
          margin-bottom: 4px;
        }

        .info-line:last-child {
          margin-bottom: 0;
        }

        .demo-notice {
          color: #8b7314;
          font-style: italic;
        }

        /* Document Viewer */
        .document-viewer {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .document-header {
          padding: 12px;
          border-bottom: 2px solid #553c26;
        }

        .header-border {
          background: #553c26;
          border: 2px solid #000;
          padding: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 
            inset 1px 1px 0px #6b4932,
            inset -1px -1px 0px #3a2918;
        }

        .page-info {
          color: #d4af37;
          font-size: 7px;
        }

        .page-controls {
          display: flex;
          gap: 6px;
        }

        .page-btn {
          background: #8b4513;
          color: #e6d7c3;
          border: 2px solid #000;
          padding: 4px 6px;
          cursor: pointer;
          font-family: inherit;
          font-size: 8px;
          box-shadow: 
            inset 1px 1px 0px #a0522d,
            inset -1px -1px 0px #654321;
        }

        .page-btn:hover:not(:disabled) {
          background: #a0522d;
        }

        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-btn:active:not(:disabled) {
          box-shadow: 
            inset -1px -1px 0px #a0522d,
            inset 1px 1px 0px #654321;
        }

        .document-content {
          flex: 1;
          padding: 12px;
          overflow-y: auto;
        }

        .document-border {
          border: 2px solid #000;
          background: #2d1b0e;
          padding: 16px;
          height: 100%;
          box-sizing: border-box;
          overflow-y: auto;
          box-shadow: 
            inset 1px 1px 0px #1a0f08,
            inset -1px -1px 0px #4a3426;
        }

        .demo-document, .real-document {
          
        }

        .demo-header {
          color: #d4af37;
          font-size: 8px;
          margin-bottom: 12px;
          border-bottom: 1px solid #553c26;
          padding-bottom: 6px;
        }

        .demo-page {
          color: #e6d7c3;
          font-size: 7px;
          margin-bottom: 16px;
        }

        .demo-text {
          
        }

        .demo-line {
          color: #e6d7c3;
          font-size: 6px;
          line-height: 1.8;
          margin-bottom: 6px;
        }

        .real-doc-text {
          color: #e6d7c3;
          font-size: 7px;
          margin-bottom: 8px;
        }

        /* Video Viewer */
        .video-viewer {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 12px;
          gap: 12px;
        }

        .video-border {
          flex: 1;
          border: 2px solid #000;
          background: #000;
          overflow: hidden;
        }

        .video-content {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        /* Audio Viewer */
        .audio-viewer {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 32px;
          gap: 24px;
        }

        .audio-visual {
          text-align: center;
        }

        .audio-border {
          background: #553c26;
          border: 2px solid #000;
          padding: 24px;
          text-align: center;
          box-shadow: 
            inset 1px 1px 0px #6b4932,
            inset -1px -1px 0px #3a2918;
        }

        .audio-icon {
          font-size: 48px;
          margin-bottom: 16px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        .audio-title {
          color: #d4af37;
          font-size: 8px;
          word-break: break-word;
        }

        .audio-player {
          width: 100%;
          max-width: 400px;
        }

        .player-border {
          border: 2px solid #000;
          background: #2d1b0e;
          padding: 12px;
          box-shadow: 
            inset 1px 1px 0px #1a0f08,
            inset -1px -1px 0px #4a3426;
        }

        .audio-content {
          width: 100%;
        }

        /* 3D Model Viewer */
        .model-viewer {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 16px;
          gap: 16px;
        }

        .model-display {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .model-border {
          background: #553c26;
          border: 2px solid #000;
          padding: 32px;
          text-align: center;
          box-shadow: 
            inset 1px 1px 0px #6b4932,
            inset -1px -1px 0px #3a2918;
        }

        .model-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .model-title {
          color: #d4af37;
          font-size: 10px;
          margin-bottom: 24px;
        }

        .demo-3d-content {
          perspective: 1000px;
          margin-bottom: 20px;
        }

        .rotating-cube {
          position: relative;
          width: 80px;
          height: 80px;
          transform-style: preserve-3d;
          animation: rotate3d 8s infinite linear;
          margin: 0 auto;
        }

        @keyframes rotate3d {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          25% { transform: rotateX(90deg) rotateY(90deg); }
          50% { transform: rotateX(180deg) rotateY(180deg); }
          75% { transform: rotateX(270deg) rotateY(270deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }

        .cube-face {
          position: absolute;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #d4af37 0%, #8b4513 100%);
          border: 2px solid #000;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          color: #1a0f08;
          font-weight: normal;
        }

        .cube-face.front { transform: rotateY(0deg) translateZ(40px); }
        .cube-face.back { transform: rotateY(180deg) translateZ(40px); }
        .cube-face.right { transform: rotateY(90deg) translateZ(40px); }
        .cube-face.left { transform: rotateY(-90deg) translateZ(40px); }
        .cube-face.top { transform: rotateX(90deg) translateZ(40px); }
        .cube-face.bottom { transform: rotateX(-90deg) translateZ(40px); }

        .model-controls {
          
        }

        .controls-border {
          background: #553c26;
          border: 2px solid #000;
          padding: 16px;
          box-shadow: 
            inset 1px 1px 0px #6b4932,
            inset -1px -1px 0px #3a2918;
        }

        .controls-info {
          margin-bottom: 12px;
        }

        .control-buttons {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .control-btn {
          background: #8b4513;
          color: #e6d7c3;
          border: 2px solid #000;
          padding: 6px 10px;
          cursor: pointer;
          font-family: inherit;
          font-size: 6px;
          box-shadow: 
            inset 1px 1px 0px #a0522d,
            inset -1px -1px 0px #654321;
        }

        .control-btn:hover {
          background: #a0522d;
        }

        .control-btn:active {
          box-shadow: 
            inset -1px -1px 0px #a0522d,
            inset 1px 1px 0px #654321;
        }

        .demo-notice {
          color: #8b7314;
          font-size: 6px;
          line-height: 1.6;
        }

        /* Footer */
        .media-footer {
          background: #3a2918;
          border-top: 3px solid #000;
          padding: 8px;
        }

        .footer-border {
          border: 2px solid #553c26;
          background: #2d1b0e;
          padding: 8px;
          box-shadow: 
            inset 1px 1px 0px #4a3426,
            inset -1px -1px 0px #1a0f08;
        }

        .media-metadata {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .metadata-item {
          background: #553c26;
          color: #d4af37;
          padding: 4px 8px;
          border: 1px solid #000;
          font-size: 6px;
          box-shadow: 
            inset 1px 1px 0px #6b4932,
            inset -1px -1px 0px #3a2918;
        }

        /* Effet de scanlines rétro */
        .media-viewer-container::after {
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

        /* Responsive */
        @media (max-width: 768px) {
          .media-viewer-container {
            width: 95vw;
            height: 95vh;
            font-size: 7px;
          }
          
          .title-text {
            font-size: 8px;
          }
          
          .control-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .media-metadata {
            flex-direction: column;
            align-items: center;
          }
          
          .audio-viewer {
            padding: 16px;
            gap: 16px;
          }
          
          .model-viewer {
            padding: 12px;
          }
        }

        @media (max-width: 480px) {
          .media-viewer-container {
            width: 98vw;
            height: 98vh;
          }
          
          .rotating-cube {
            width: 60px;
            height: 60px;
          }
          
          .cube-face {
            width: 60px;
            height: 60px;
            font-size: 10px;
          }
          
          .cube-face.front { transform: rotateY(0deg) translateZ(30px); }
          .cube-face.back { transform: rotateY(180deg) translateZ(30px); }
          .cube-face.right { transform: rotateY(90deg) translateZ(30px); }
          .cube-face.left { transform: rotateY(-90deg) translateZ(30px); }
          .cube-face.top { transform: rotateX(90deg) translateZ(30px); }
          .cube-face.bottom { transform: rotateX(-90deg) translateZ(30px); }
        }
      `}</style>
    </div>
  );
};

export default MediaViewer;