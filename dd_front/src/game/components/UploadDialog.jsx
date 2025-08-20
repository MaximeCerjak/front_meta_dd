import React, { useState, useRef } from 'react';

const UploadDialog = ({ isVisible, onClose, itemData, onFileUploaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const getMediaType = (file) => {
    const type = file.type.toLowerCase();
    
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) return 'document';
    if (type.includes('model') || file.name.toLowerCase().includes('.glb') || file.name.toLowerCase().includes('.gltf')) return '3d';
    
    return 'document'; // Default
  };

  const validateFile = (file) => {
    const mediaType = getMediaType(file);
    const maxSize = 100 * 1024 * 1024; // 100MB

    if (file.size > maxSize) {
      return { valid: false, error: 'Fichier trop volumineux (max 100MB)' };
    }
    
    if (itemData && !itemData.supportedFormats.includes(mediaType)) {
      return { valid: false, error: `Type de fichier non supporté par ${itemData.itemName}` };
    }
    
    return { valid: true, mediaType };
  };

  const handleFileSelect = (file) => {
    const validation = validateFile(file);
    
    if (!validation.valid) {
      alert('⌐ ' + validation.error);
      return;
    }
    
    setSelectedFile({ file, mediaType: validation.mediaType });
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      // Simuler un upload (en production, on uploaderait vers le serveur)
      await new Promise(resolve => setTimeout(resolve, 1000));
      onFileUploaded(selectedFile.file, selectedFile.mediaType);
      handleClose();
      
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('⌐ Erreur lors de l\'upload du fichier');
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setDragOver(false);
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMediaTypeIcon = (mediaType) => {
    const icons = {
      image: '🖼️',
      document: '📄',
      video: '🎬',
      audio: '🎵',
      '3d': '🎭'
    };
    return icons[mediaType] || '📁';
  };

  const getSupportedTypesText = () => {
    if (!itemData || !itemData.supportedFormats) return '';
    
    const typeDescriptions = {
      image: 'Images (JPG, PNG, GIF, WebP)',
      document: 'Documents (PDF, Word, Texte)',
      video: 'Vidéos (MP4, WebM, OGG)',
      audio: 'Audio (MP3, WAV, OGG)',
      '3d': 'Modèles 3D (GLB, GLTF, OBJ)'
    };
    
    return itemData.supportedFormats
      .map(type => typeDescriptions[type])
      .filter(Boolean)
      .join(', ');
  };

  if (!isVisible) return null;

  return (
    <div className="upload-overlay">
      <div className="upload-dialog">
        {/* Header */}
        <div className="upload-header">
          <div className="header-border-top"></div>
          <div className="header-content">
            <div className="header-title">
              <span className="title-icon">📤</span>
              <span className="title-text">AJOUTER DU CONTENU</span>
            </div>
            <button 
              className="upload-close-btn"
              onClick={handleClose}
              disabled={isUploading}
              aria-label="Fermer le dialog"
            >
              ✕
            </button>
          </div>
          <div className="header-border-bottom"></div>
        </div>

        <div className="dialog-content">
          <div className="content-border">
            {/* Item Info */}
            {itemData && (
              <div className="item-info-section">
                <div className="info-box">
                  <div className="info-header">🛏️ {itemData.itemName}</div>
                  <div className="info-content">
                    <div className="supported-formats">
                      <div className="format-label">FORMATS SUPPORTÉS:</div>
                      <div className="format-text">{getSupportedTypesText()}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Drop Zone */}
            <div className="drop-zone-container">
              <div 
                className={`drop-zone ${dragOver ? 'drag-over' : ''} ${selectedFile ? 'has-file' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !selectedFile && fileInputRef.current?.click()}
              >
                <div className="drop-zone-border">
                  {!selectedFile ? (
                    <div className="drop-content">
                      <div className="drop-icon">📁</div>
                      <div className="drop-text">
                        {dragOver ? 'DÉPOSEZ LE FICHIER ICI' : 'GLISSEZ UN FICHIER ICI'}
                      </div>
                      <div className="drop-text2">OU CLIQUEZ POUR PARCOURIR</div>
                      <div className="drop-hint">TAILLE MAX: 100MB</div>
                    </div>
                  ) : (
                    <div className="selected-file-info">
                      <div className="file-icon-container">
                        <div className="file-icon">
                          {getMediaTypeIcon(selectedFile.mediaType)}
                        </div>
                      </div>
                      <div className="file-details">
                        <div className="file-name">{selectedFile.file.name}</div>
                        <div className="file-type">TYPE: {selectedFile.mediaType.toUpperCase()}</div>
                        <div className="file-size">TAILLE: {formatFileSize(selectedFile.file.size)}</div>
                      </div>
                      <button 
                        className="remove-file-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        disabled={isUploading}
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileInputChange}
              accept={itemData?.supportedFormats || '*/*'}
              disabled={isUploading}
            />

            {/* Actions */}
            <div className="upload-actions">
              <button 
                className="action-btn cancel"
                onClick={handleClose}
                disabled={isUploading}
              >
                ANNULER
              </button>
              <button 
                className="action-btn upload"
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <span className="loading-spinner">⏳</span>
                    UPLOAD...
                  </>
                ) : (
                  <>
                    📤 AJOUTER
                  </>
                )}
              </button>
            </div>

            {/* Demo Notice */}
            <div className="demo-notice">
              <div className="notice-box">
                <div className="notice-header">ℹ️ MODE DÉMONSTRATION</div>
                <div className="notice-content">
                  <div className="notice-line">► Le fichier sera stocké temporairement pour cette session</div>
                  <div className="notice-line">► En production, il serait uploadé sur le serveur</div>
                  <div className="notice-line">► Tous les utilisateurs verraient le contenu</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        .upload-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1002;
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .upload-dialog {
          width: 480px;
          max-height: 90vh;
          background: #2d1b0e;
          border: 4px solid #000;
          box-shadow: 
            inset 2px 2px 0px #4a3426,
            inset -2px -2px 0px #1a0f08,
            4px 4px 0px #000;
          display: flex;
          flex-direction: column;
          font-family: 'Press Start 2P', 'Courier New', monospace;
          font-size: 8px;
          line-height: 1.4;
          image-rendering: pixelated;
          animation: slideIn 0.4s ease-out;
        }

        @keyframes slideIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .upload-header {
          background: #d4af37;
          border-bottom: 3px solid #000;
        }

        .header-border-top {
          height: 3px;
          background: repeating-linear-gradient(
            90deg,
            #f4e06d 0px,
            #f4e06d 3px,
            #b8941f 3px,
            #b8941f 6px
          );
        }

        .header-content {
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(180deg, #f4e06d 0%, #d4af37 50%, #b8941f 100%);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .title-icon {
          font-size: 12px;
        }

        .title-text {
          color: #1a0f08;
          text-shadow: 1px 1px 0px #f4e06d;
          font-size: 8px;
        }

        .upload-close-btn {
          background: #8b4513;
          color: #f4e06d;
          border: 2px solid #000;
          width: 24px;
          height: 24px;
          cursor: pointer;
          font-family: inherit;
          font-size: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            inset 1px 1px 0px #a0522d,
            inset -1px -1px 0px #654321;
        }

        .upload-close-btn:hover:not(:disabled) {
          background: #a0522d;
        }

        .upload-close-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .upload-close-btn:active:not(:disabled) {
          box-shadow: 
            inset -1px -1px 0px #a0522d,
            inset 1px 1px 0px #654321;
        }

        .header-border-bottom {
          height: 3px;
          background: repeating-linear-gradient(
            90deg,
            #b8941f 0px,
            #b8941f 3px,
            #8b7314 3px,
            #8b7314 6px
          );
        }

        .dialog-content {
          flex: 1;
          overflow-y: auto;
          background: #2d1b0e;
          padding: 12px;
        }

        .dialog-content::-webkit-scrollbar {
          width: 16px;
        }

        .dialog-content::-webkit-scrollbar-track {
          background: #1a0f08;
          border: 2px solid #000;
        }

        .dialog-content::-webkit-scrollbar-thumb {
          background: #8b4513;
          border: 2px solid #000;
          box-shadow: 
            inset 1px 1px 0px #a0522d,
            inset -1px -1px 0px #654321;
        }

        .content-border {
          border: 2px solid #553c26;
          background: #3a2918;
          padding: 12px;
          box-shadow: 
            inset 1px 1px 0px #4a3426,
            inset -1px -1px 0px #2d1b0e;
        }

        .item-info-section {
          margin-bottom: 16px;
        }

        .info-box {
          background: #553c26;
          border: 2px solid #000;
          box-shadow: 
            inset 1px 1px 0px #6b4932,
            inset -1px -1px 0px #3a2918;
        }

        .info-header {
          background: #8b4513;
          color: #f4e06d;
          padding: 8px 12px;
          border-bottom: 2px solid #000;
          font-size: 7px;
        }

        .info-content {
          padding: 12px;
        }

        .format-label {
          color: #d4af37;
          font-size: 6px;
          margin-bottom: 4px;
        }

        .format-text {
          color: #e6d7c3;
          font-size: 6px;
          line-height: 1.6;
        }

        .drop-zone-container {
          margin-bottom: 16px;
        }

        .drop-zone {
          cursor: pointer;
          transition: none;
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .drop-zone.has-file {
          cursor: default;
        }

        .drop-zone-border {
          width: 100%;
          background: #2d1b0e;
          border: 3px dashed #8b4513;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100px;
          box-shadow: 
            inset 1px 1px 0px #3a2918,
            inset -1px -1px 0px #1a0f08;
        }

        .drop-zone.drag-over .drop-zone-border {
          border-color: #d4af37;
          background: #3a2918;
          animation: pulse 1s infinite;
        }

        .drop-zone.has-file .drop-zone-border {
          border-color: #d4af37;
          background: #553c26;
          border-style: solid;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .drop-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .drop-icon {
          font-size: 32px;
          opacity: 0.7;
        }

        .drop-text {
          color: #e6d7c3;
          font-size: 7px;
        }

        .drop-text2 {
          color: #d4af37;
          font-size: 6px;
        }

        .drop-hint {
          color: #8b7314;
          font-size: 5px;
          margin-top: 4px;
        }

        .selected-file-info {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
        }

        .file-icon-container {
          width: 48px;
          height: 48px;
          background: #8b4513;
          border: 2px solid #000;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            inset 1px 1px 0px #a0522d,
            inset -1px -1px 0px #654321;
        }

        .file-icon {
          font-size: 24px;
        }

        .file-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .file-name {
          color: #d4af37;
          font-size: 7px;
          word-break: break-word;
        }

        .file-type,
        .file-size {
          color: #e6d7c3;
          font-size: 6px;
        }

        .remove-file-btn {
          background: #8b0000;
          color: #e6d7c3;
          border: 2px solid #000;
          padding: 8px;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          box-shadow: 
            inset 1px 1px 0px #cd5c5c,
            inset -1px -1px 0px #5a0000;
        }

        .remove-file-btn:hover:not(:disabled) {
          background: #a52a2a;
        }

        .remove-file-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .remove-file-btn:active:not(:disabled) {
          box-shadow: 
            inset -1px -1px 0px #cd5c5c,
            inset 1px 1px 0px #5a0000;
        }

        .upload-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-bottom: 16px;
        }

        .action-btn {
          padding: 8px 16px;
          cursor: pointer;
          font-family: inherit;
          font-size: 7px;
          border: 2px solid #000;
          display: flex;
          align-items: center;
          gap: 4px;
          min-width: 80px;
          justify-content: center;
        }

        .action-btn.cancel {
          background: #8b4513;
          color: #e6d7c3;
          box-shadow: 
            inset 1px 1px 0px #a0522d,
            inset -1px -1px 0px #654321;
        }

        .action-btn.cancel:hover:not(:disabled) {
          background: #a0522d;
        }

        .action-btn.upload {
          background: #228b22;
          color: #e6d7c3;
          box-shadow: 
            inset 1px 1px 0px #32cd32,
            inset -1px -1px 0px #006400;
        }

        .action-btn.upload:hover:not(:disabled) {
          background: #32cd32;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .action-btn:active:not(:disabled) {
          box-shadow: 
            inset -1px -1px 0px #a0522d,
            inset 1px 1px 0px #654321;
        }

        .action-btn.upload:active:not(:disabled) {
          box-shadow: 
            inset -1px -1px 0px #32cd32,
            inset 1px 1px 0px #006400;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .demo-notice {
          
        }

        .notice-box {
          background: rgba(255, 165, 0, 0.1);
          border: 2px solid #ffa500;
          box-shadow: 
            inset 1px 1px 0px rgba(255, 215, 0, 0.3),
            inset -1px -1px 0px rgba(255, 140, 0, 0.3);
        }

        .notice-header {
          background: #ffa500;
          color: #1a0f08;
          padding: 6px 8px;
          border-bottom: 2px solid #ff8c00;
          font-size: 6px;
        }

        .notice-content {
          padding: 8px;
        }

        .notice-line {
          color: #ffd700;
          font-size: 5px;
          margin-bottom: 3px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .upload-dialog {
            width: 95vw;
            max-width: 480px;
            font-size: 7px;
          }
          
          .file-icon-container {
            width: 40px;
            height: 40px;
          }
          
          .file-icon {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default UploadDialog;