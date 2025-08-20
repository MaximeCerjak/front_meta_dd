import React, { useState, useEffect } from 'react';
import { EventBus } from '../EventBus';

const InventoryUI = ({ isVisible, onClose, inventoryManager }) => {
  const [inventoryData, setInventoryData] = useState({});
  const [placedItems, setPlacedItems] = useState({});
  const [selectedTab, setSelectedTab] = useState('inventory');
  const [stats, setStats] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (isVisible && inventoryManager) {
      updateData();
    }
  }, [isVisible, inventoryManager]);

  useEffect(() => {
    const handleStatsUpdate = () => {
      if (inventoryManager) {
        updateData();
      }
    };

    EventBus.on('exhibition-stats-update', handleStatsUpdate);
    return () => EventBus.off('exhibition-stats-update', handleStatsUpdate);
  }, [inventoryManager]);

  const updateData = () => {
    if (!inventoryManager) return;
    
    setInventoryData(inventoryManager.getInventoryData());
    setPlacedItems(inventoryManager.getPlacedItemsData());
    setStats(inventoryManager.getStats());
  };

  const handleItemSelect = (itemType) => {
    console.log('InventoryUI - Sélection objet:', itemType);
    EventBus.emit('inventory-item-selected', itemType);
    
    console.log('InventoryUI - Fermeture pour placement');
    onClose();
  };

  const handleRemoveItem = (itemId) => {
    EventBus.emit('remove-exhibition-item', itemId);
    updateData();
  };

  const toggleEditMode = () => {
    const newEditMode = !isEditMode;
    setIsEditMode(newEditMode);
    
    if (newEditMode) {
      inventoryManager.enableEditMode();
    } else {
      inventoryManager.disableEditMode();
    }
  };

  const clearAllItems = () => {
    if (window.confirm('⚠️ Êtes-vous sûr de vouloir retirer tous les objets d\'exposition ?')) {
      inventoryManager.clearAllItems();
      updateData();
    }
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

  if (!isVisible) return null;

  return (
    <div className="inventory-overlay">
      <div className="inventory-container">
        {/* Header */}
        <div className="inventory-header">
          <div className="header-border-top"></div>
          <div className="header-content">
            <div className="header-title">
              <span className="title-icon">🎒</span>
              <span className="title-text">GESTIONNAIRE D'EXPOSITION</span>
            </div>
            <button 
              className="inventory-close-btn"
              onClick={onClose}
              aria-label="Fermer l'inventaire"
            >
              ✕
            </button>
          </div>
          <div className="header-border-bottom"></div>
        </div>

        {/* Tabs */}
        <div className="inventory-tabs">
          <div className="tabs-container">
            <button 
              className={`tab-btn ${selectedTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setSelectedTab('inventory')}
            >
              <span className="tab-icon">📦</span>
              <span className="tab-text">INVENTAIRE</span>
            </button>
            <button 
              className={`tab-btn ${selectedTab === 'placed' ? 'active' : ''}`}
              onClick={() => setSelectedTab('placed')}
            >
              <span className="tab-icon">🗿</span>
              <span className="tab-text">OBJETS ({stats.totalItems || 0})</span>
            </button>
            <button 
              className={`tab-btn ${selectedTab === 'stats' ? 'active' : ''}`}
              onClick={() => setSelectedTab('stats')}
            >
              <span className="tab-icon">📊</span>
              <span className="tab-text">STATS</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="inventory-content">
          <div className="content-border">
            {selectedTab === 'inventory' && (
              <div className="inventory-section">
                <div className="instructions-box">
                  <div className="box-header">📋 INSTRUCTIONS</div>
                  <div className="instructions-content">
                    <div className="instruction-line">► Cliquez sur un objet pour activer le mode placement</div>
                    <div className="instruction-line">► Placez l'objet avec un clic gauche</div>
                    <div className="instruction-line">► Annulez avec un clic droit ou Échap</div>
                    <div className="instruction-line">► Interagissez avec les objets placés pour ajouter du contenu</div>
                  </div>
                </div>

                <div className="inventory-grid">
                  {Object.entries(inventoryData).map(([type, itemData]) => (
                    <div 
                      key={type}
                      className="inventory-item"
                      onClick={() => handleItemSelect(type)}
                      title={`Cliquer pour placer: ${itemData.description}`}
                    >
                      <div className="item-border">
                        <div className="item-content">
                          <div className="item-icon-container">
                            <div className="item-icon">{itemData.icon}</div>
                          </div>
                          <div className="item-info">
                            <div className="item-name">{itemData.name}</div>
                            <div className="item-description">{itemData.description}</div>
                            <div className="supported-types">
                              TYPES: {itemData.supportedTypes.join(', ')}
                            </div>
                          </div>
                          <div className="item-count-container">
                            <div className="item-count">
                              {itemData.count === -1 ? '∞' : itemData.count}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'placed' && (
              <div className="placed-items-section">
                <div className="controls-box">
                  <button 
                    className={`pixel-btn ${isEditMode ? 'active' : ''}`}
                    onClick={toggleEditMode}
                  >
                    {isEditMode ? '✅ TERMINER' : '✏️ ÉDITION'}
                  </button>
                  <button 
                    className="pixel-btn danger"
                    onClick={clearAllItems}
                    disabled={stats.totalItems === 0}
                  >
                    🗑️ SUPPRIMER TOUT
                  </button>
                </div>

                {stats.totalItems === 0 ? (
                  <div className="empty-state">
                    <div className="empty-border">
                      <div className="empty-content">
                        <div className="empty-icon">🛏️</div>
                        <div className="empty-text">AUCUN OBJET D'EXPOSITION PLACÉ</div>
                        <div className="empty-hint">ALLEZ DANS L'ONGLET INVENTAIRE POUR COMMENCER</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="placed-items-list">
                    {Object.entries(placedItems).map(([id, item]) => (
                      <div key={id} className="placed-item">
                        <div className="placed-item-border">
                          <div className="placed-item-content">
                            <div className="placed-item-header">
                              <span className="item-type">
                                {inventoryData[item.type]?.icon} {item.name}
                              </span>
                              <span className="item-position">
                                📍 ({Math.round(item.position.x)}, {Math.round(item.position.y)})
                              </span>
                            </div>
                            
                            <div className="placed-item-info">
                              {item.hasContent ? (
                                <div className="content-info">
                                  <span className="content-type">
                                    {getMediaTypeIcon(item.mediaType)} {item.fileName}
                                  </span>
                                  <span className="content-status good">✅ CONTENU PRÉSENT</span>
                                </div>
                              ) : (
                                <div className="content-info">
                                  <span className="content-status empty">📁 VIDE</span>
                                </div>
                              )}
                            </div>

                            <div className="placed-item-actions">
                              <button 
                                className="action-btn remove"
                                onClick={() => handleRemoveItem(id)}
                                title="Supprimer cet objet"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'stats' && (
              <div className="stats-section">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-border">
                      <div className="stat-content">
                        <div className="stat-icon">🛏️</div>
                        <div className="stat-info">
                          <div className="stat-label">OBJETS TOTAUX</div>
                          <div className="stat-value">{stats.totalItems || 0}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-border">
                      <div className="stat-content">
                        <div className="stat-icon">📄</div>
                        <div className="stat-info">
                          <div className="stat-label">AVEC CONTENU</div>
                          <div className="stat-value">{stats.itemsWithContent || 0}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-border">
                      <div className="stat-content">
                        <div className="stat-icon">📊</div>
                        <div className="stat-info">
                          <div className="stat-label">TAUX REMPLISSAGE</div>
                          <div className="stat-value">
                            {stats.totalItems ? Math.round((stats.itemsWithContent / stats.totalItems) * 100) : 0}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {stats.itemsByType && Object.keys(stats.itemsByType).length > 0 && (
                  <div className="types-breakdown">
                    <div className="breakdown-border">
                      <div className="breakdown-header">RÉPARTITION PAR TYPE</div>
                      <div className="types-list">
                        {Object.entries(stats.itemsByType).map(([type, count]) => (
                          <div key={type} className="type-stat">
                            <span className="type-icon">{inventoryData[type]?.icon}</span>
                            <span className="type-name">{inventoryData[type]?.name}</span>
                            <span className="type-count">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="info-box">
                  <div className="info-border">
                    <div className="info-header">ℹ️ À PROPOS DE CETTE DÉMO</div>
                    <div className="info-content">
                      <div className="info-line">► Les objets sont sauvegardés localement dans votre navigateur</div>
                      <div className="info-line">► Les fichiers uploadés sont temporaires (session uniquement)</div>
                      <div className="info-line">► En production, tout serait synchronisé avec le serveur</div>
                      <div className="info-line">► D'autres joueurs verraient vos créations en temps réel</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        .inventory-overlay {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 640px;
          height: 480px;
          z-index: 1001;
          animation: slideIn 0.4s ease-out;
        }

        @keyframes slideIn {
          from { 
            transform: translate(-50%, -50%) scale(0.8); 
            opacity: 0; 
          }
          to { 
            transform: translate(-50%, -50%) scale(1); 
            opacity: 1; 
          }
        }

        .inventory-container {
          width: 100%;
          height: 100%;
          background: #2d1b0e;
          border: 4px solid #000;
          border-radius: 0;
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
          position: relative;
        }

        .inventory-header {
          background: #d4af37;
          border-bottom: 3px solid #000;
          position: relative;
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
          position: relative;
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
          font-weight: normal;
        }

        .inventory-close-btn {
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

        .inventory-close-btn:hover {
          background: #a0522d;
        }

        .inventory-close-btn:active {
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

        .inventory-tabs {
          background: #3a2918;
          border-bottom: 3px solid #000;
          padding: 8px;
        }

        .tabs-container {
          display: flex;
          gap: 4px;
        }

        .tab-btn {
          background: #553c26;
          color: #e6d7c3;
          border: 2px solid #000;
          padding: 6px 8px;
          cursor: pointer;
          font-family: inherit;
          font-size: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 
            inset 1px 1px 0px #6b4932,
            inset -1px -1px 0px #2d1b0e;
          min-width: 80px;
          justify-content: center;
        }

        .tab-btn.active {
          background: #d4af37;
          color: #1a0f08;
          box-shadow: 
            inset -1px -1px 0px #f4e06d,
            inset 1px 1px 0px #b8941f;
        }

        .tab-btn:hover:not(.active) {
          background: #6b4932;
        }

        .tab-icon {
          font-size: 8px;
        }

        .tab-text {
          font-size: 6px;
        }

        .inventory-content {
          flex: 1;
          overflow-y: auto;
          background: #2d1b0e;
          padding: 8px;
        }

        .inventory-content::-webkit-scrollbar {
          width: 16px;
        }

        .inventory-content::-webkit-scrollbar-track {
          background: #1a0f08;
          border: 2px solid #000;
        }

        .inventory-content::-webkit-scrollbar-thumb {
          background: #8b4513;
          border: 2px solid #000;
          box-shadow: 
            inset 1px 1px 0px #a0522d,
            inset -1px -1px 0px #654321;
        }

        .content-border {
          border: 2px solid #553c26;
          background: #3a2918;
          min-height: calc(100% - 4px);
          padding: 8px;
          box-shadow: 
            inset 1px 1px 0px #4a3426,
            inset -1px -1px 0px #2d1b0e;
        }

        .instructions-box {
          background: #553c26;
          border: 2px solid #000;
          margin-bottom: 12px;
          box-shadow: 
            inset 1px 1px 0px #6b4932,
            inset -1px -1px 0px #3a2918;
        }

        .box-header {
          background: #8b4513;
          color: #f4e06d;
          padding: 6px 8px;
          border-bottom: 2px solid #000;
          font-size: 7px;
        }

        .instructions-content {
          padding: 8px;
        }

        .instruction-line {
          color: #e6d7c3;
          font-size: 6px;
          margin-bottom: 4px;
        }

        .inventory-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .inventory-item {
          cursor: pointer;
          transition: none;
        }

        .item-border {
          background: #553c26;
          border: 2px solid #000;
          box-shadow: 
            inset 1px 1px 0px #6b4932,
            inset -1px -1px 0px #3a2918;
        }

        .inventory-item:hover .item-border {
          background: #6b4932;
          box-shadow: 
            inset 1px 1px 0px #7d5a3f,
            inset -1px -1px 0px #553c26;
        }

        .inventory-item:active .item-border {
          box-shadow: 
            inset -1px -1px 0px #7d5a3f,
            inset 1px 1px 0px #553c26;
        }

        .item-content {
          padding: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .item-icon-container {
          width: 32px;
          height: 32px;
          background: #3a2918;
          border: 2px solid #000;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            inset 1px 1px 0px #4a3426,
            inset -1px -1px 0px #2d1b0e;
        }

        .item-icon {
          font-size: 16px;
        }

        .item-info {
          flex: 1;
        }

        .item-name {
          color: #d4af37;
          font-size: 7px;
          margin-bottom: 2px;
        }

        .item-description {
          color: #e6d7c3;
          font-size: 6px;
          margin-bottom: 4px;
        }

        .supported-types {
          color: #8b7314;
          font-size: 5px;
        }

        .item-count-container {
          width: 24px;
          height: 24px;
          background: #8b4513;
          border: 2px solid #000;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            inset 1px 1px 0px #a0522d,
            inset -1px -1px 0px #654321;
        }

        .item-count {
          color: #f4e06d;
          font-size: 8px;
        }

        .controls-box {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .pixel-btn {
          background: #8b4513;
          color: #e6d7c3;
          border: 2px solid #000;
          padding: 6px 8px;
          cursor: pointer;
          font-family: inherit;
          font-size: 6px;
          box-shadow: 
            inset 1px 1px 0px #a0522d,
            inset -1px -1px 0px #654321;
        }

        .pixel-btn.active {
          background: #d4af37;
          color: #1a0f08;
          box-shadow: 
            inset -1px -1px 0px #f4e06d,
            inset 1px 1px 0px #b8941f;
        }

        .pixel-btn.danger {
          background: #8b0000;
          box-shadow: 
            inset 1px 1px 0px #cd5c5c,
            inset -1px -1px 0px #5a0000;
        }

        .pixel-btn:hover:not(:disabled):not(.active) {
          background: #a0522d;
        }

        .pixel-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pixel-btn:active:not(:disabled) {
          box-shadow: 
            inset -1px -1px 0px #a0522d,
            inset 1px 1px 0px #654321;
        }

        .empty-state {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
        }

        .empty-border {
          background: #553c26;
          border: 2px solid #000;
          padding: 24px;
          text-align: center;
          box-shadow: 
            inset 1px 1px 0px #6b4932,
            inset -1px -1px 0px #3a2918;
        }

        .empty-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .empty-icon {
          font-size: 24px;
        }

        .empty-text {
          color: #d4af37;
          font-size: 7px;
        }

        .empty-hint {
          color: #8b7314;
          font-size: 6px;
        }

        .placed-items-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .placed-item-border {
          background: #553c26;
          border: 2px solid #000;
          box-shadow: 
            inset 1px 1px 0px #6b4932,
            inset -1px -1px 0px #3a2918;
        }

        .placed-item-content {
          padding: 8px;
        }

        .placed-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .item-type {
          color: #d4af37;
          font-size: 7px;
        }

        .item-position {
          color: #8b7314;
          font-size: 6px;
        }

        .placed-item-info {
          margin-bottom: 8px;
        }

        .content-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .content-type {
          color: #e6d7c3;
          font-size: 6px;
        }

        .content-status {
          font-size: 6px;
        }

        .content-status.good {
          color: #32cd32;
        }

        .content-status.empty {
          color: #8b7314;
        }

        .placed-item-actions {
          display: flex;
          justify-content: flex-end;
        }

        .action-btn {
          background: #8b0000;
          color: #e6d7c3;
          border: 2px solid #000;
          padding: 4px 6px;
          cursor: pointer;
          font-family: inherit;
          font-size: 8px;
          box-shadow: 
            inset 1px 1px 0px #cd5c5c,
            inset -1px -1px 0px #5a0000;
        }

        .action-btn:hover {
          background: #a52a2a;
        }

        .action-btn:active {
          box-shadow: 
            inset -1px -1px 0px #cd5c5c,
            inset 1px 1px 0px #5a0000;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 8px;
          margin-bottom: 12px;
        }

        .stat-border {
          background: #553c26;
          border: 2px solid #000;
          box-shadow: 
            inset 1px 1px 0px #6b4932,
            inset -1px -1px 0px #3a2918;
        }

        .stat-content {
          padding: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .stat-icon {
          font-size: 16px;
        }

        .stat-label {
          color: #d4af37;
          font-size: 6px;
          margin-bottom: 2px;
        }

        .stat-value {
          color: #e6d7c3;
          font-size: 10px;
        }

        .types-breakdown {
          margin-bottom: 12px;
        }

        .breakdown-border {
          background: #553c26;
          border: 2px solid #000;
          box-shadow: 
            inset 1px 1px 0px #6b4932,
            inset -1px -1px 0px #3a2918;
        }

        .breakdown-header {
          background: #8b4513;
          color: #f4e06d;
          padding: 6px 8px;
          border-bottom: 2px solid #000;
          font-size: 7px;
        }

        .types-list {
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .type-stat {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px;
          background: #3a2918;
          border: 1px solid #2d1b0e;
        }

        .type-icon {
          font-size: 10px;
        }

        .type-name {
          flex: 1;
          color: #e6d7c3;
          font-size: 6px;
        }

        .type-count {
          color: #d4af37;
          font-size: 7px;
        }

        .info-box {
          margin-top: 12px;
        }

        .info-border {
          background: #553c26;
          border: 2px solid #000;
          box-shadow: 
            inset 1px 1px 0px #6b4932,
            inset -1px -1px 0px #3a2918;
        }

        .info-header {
          background: #8b4513;
          color: #f4e06d;
          padding: 6px 8px;
          border-bottom: 2px solid #000;
          font-size: 7px;
        }

        .info-content {
          padding: 8px;
        }

        .info-line {
          color: #e6d7c3;
          font-size: 6px;
          margin-bottom: 4px;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }

        .content-status.good {
          animation: blink 2s infinite;
        }

        /* Responsive pour les petits écrans */
        @media (max-width: 768px) {
          .inventory-overlay {
            width: 95vw;
            height: 90vh;
            max-width: 640px;
            max-height: 480px;
          }
          
          .inventory-container {
            font-size: 7px;
          }
          
          .tab-text {
            font-size: 5px;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
        `}</style>
    </div>
  );
};

export default InventoryUI;

