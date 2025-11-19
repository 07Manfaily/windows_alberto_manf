import React, { useState, useRef } from 'react';

function DeleteComponent() {
  const [items, setItems] = useState([
    { id: 1, name: 'Element 1', description: 'Description de l\'élément 1' },
    { id: 2, name: 'Element 2', description: 'Description de l\'élément 2' },
    { id: 3, name: 'Element 3', description: 'Description de l\'élément 3' },
    { id: 4, name: 'Element 4', description: 'Description de l\'élément 4' },
  ]);

  const [itemToDelete, setItemToDelete] = useState(null);
  const dialogRef = useRef(null);

  const openDeleteDialog = (item) => {
    setItemToDelete(item);
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
    setItemToDelete(null);
  };

  const confirmDelete = () => {
    setItems(items.filter(item => item.id !== itemToDelete.id));
    closeDialog();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gestion des éléments</h1>

      <div style={styles.itemsContainer}>
        {items.length === 0 ? (
          <p style={styles.emptyText}>Aucun élément disponible</p>
        ) : (
          items.map(item => (
            <div key={item.id} style={styles.itemCard}>
              <div style={styles.itemContent}>
                <h3 style={styles.itemName}>{item.name}</h3>
                <p style={styles.itemDescription}>{item.description}</p>
              </div>
              <button
                onClick={() => openDeleteDialog(item)}
                style={styles.deleteButton}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      <dialog ref={dialogRef} style={styles.dialog}>
        <div style={styles.dialogContent}>
          <div style={styles.dialogHeader}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>

          <h2 style={styles.dialogTitle}>Confirmer la suppression</h2>
          
          {itemToDelete && (
            <p style={styles.dialogText}>
              Êtes-vous sûr de vouloir supprimer <strong>{itemToDelete.name}</strong> ?
              Cette action est irréversible.
            </p>
          )}

          <div style={styles.dialogActions}>
            <button onClick={closeDialog} style={styles.cancelButton}>
              Annuler
            </button>
            <button onClick={confirmDelete} style={styles.confirmButton}>
              Supprimer
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: '32px',
    marginBottom: '40px',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  itemsContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  itemCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    margin: '0 0 8px 0',
    fontSize: '20px',
    color: '#1f2937',
  },
  itemDescription: {
    margin: 0,
    fontSize: '14px',
    color: '#6b7280',
  },
  deleteButton: {
    background: '#fee2e2',
    color: '#ef4444',
    border: 'none',
    borderRadius: '8px',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    flexShrink: 0,
    marginLeft: '16px',
  },
  emptyText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: '18px',
    padding: '40px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
  },
  dialog: {
    border: 'none',
    borderRadius: '16px',
    padding: 0,
    maxWidth: '450px',
    width: '90%',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
    background: '#ffffff',
  },
  dialogContent: {
    padding: '32px',
  },
  dialogHeader: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  dialogTitle: {
    margin: '0 0 16px 0',
    fontSize: '24px',
    color: '#1f2937',
    textAlign: 'center',
  },
  dialogText: {
    margin: '0 0 32px 0',
    fontSize: '16px',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: '1.6',
  },
  dialogActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  cancelButton: {
    padding: '12px 24px',
    fontSize: '16px',
    border: '2px solid #e5e7eb',
    background: '#ffffff',
    color: '#374151',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s',
    flex: 1,
  },
  confirmButton: {
    padding: '12px 24px',
    fontSize: '16px',
    border: 'none',
    background: '#ef4444',
    color: '#ffffff',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s',
    flex: 1,
  },
};

export default DeleteComponent;