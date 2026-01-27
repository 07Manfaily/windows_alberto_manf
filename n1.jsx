// MODIFICATIONS À APPORTER AU FICHIER AGListView.jsx

// 1. AJOUTER CES ÉTATS SUPPLÉMENTAIRES (après les états existants du modal upload) :

  // États pour le modal de remplacement de fichier
  const [replaceModalOpen, setReplaceModalOpen] = useState(false);
  const [selectedFileForReplace, setSelectedFileForReplace] = useState(null);
  const [selectedSgiForReplace, setSelectedSgiForReplace] = useState(null);
  const [replaceFile, setReplaceFile] = useState(null);

// 2. AJOUTER CETTE RÉFÉRENCE (après les références existantes) :

  const replaceFileInputRef = useRef(null);

// 3. AJOUTER CETTE FONCTION API (après les fonctions API existantes) :

  // Remplacer un fichier avec SGI
  const replaceFileWithSgi = async () => {
    if (!replaceFile || !selectedSgiForReplace || !selectedFileForReplace) return;
    
    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', replaceFile);
    formData.append('sgi_info', selectedSgiForReplace);

    try {
      const response = await fetch(`/api/automation_ag/replace_file_ag/${selectedFileForReplace.id}/replace`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        console.error("Erreur lors du remplacement du fichier");
        return;
      }

      // Refresh la liste des fichiers
      await fetchAgFiles(selectedAgDetails.ag_id);
      
      // Reset et fermer le modal
      setReplaceModalOpen(false);
      setSelectedFileForReplace(null);
      setSelectedSgiForReplace(null);
      setReplaceFile(null);
      if (replaceFileInputRef.current) {
        replaceFileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Erreur réseau (remplacement):", error);
    } finally {
      setUploadingFile(false);
    }
  };

// 4. AJOUTER CES HANDLERS (après les handlers existants) :

  const handleOpenReplaceModal = (file) => {
    setSelectedFileForReplace(file);
    setReplaceModalOpen(true);
  };

  const handleCloseReplaceModal = () => {
    setReplaceModalOpen(false);
    setSelectedFileForReplace(null);
    setSelectedSgiForReplace(null);
    setReplaceFile(null);
    if (replaceFileInputRef.current) {
      replaceFileInputRef.current.value = '';
    }
  };

  const handleReplaceFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Vérifier que le fichier est CSV ou XLSX
      const allowedTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      const allowedExtensions = ['.csv', '.xlsx'];
      const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      
      if (allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension)) {
        setReplaceFile(file);
      } else {
        alert("Seuls les fichiers CSV et XLSX sont autorisés.");
        event.target.value = '';
      }
    }
  };

// 5. AJOUTER CE MODAL (après le modal UploadModal) :

  // ---- Modal de remplacement de fichier SGI ----
  const ReplaceModal = () => {
    if (!replaceModalOpen) return null;
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 60,
          padding: "20px",
          animation: "fadeIn 0.3s ease-out",
        }}
      >
        <div
          style={{
            background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
            borderRadius: "24px",
            padding: "40px",
            maxWidth: "500px",
            width: "100%",
            boxShadow: "0 25px 100px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "32px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  padding: "12px",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RefreshCw size={24} color="white" />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    margin: 0,
                    marginBottom: "4px",
                  }}
                >
                  Remplacer le fichier
                </h3>
                <p style={{ 
                  margin: 0, 
                  color: "#6b7280", 
                  fontSize: "14px",
                  fontWeight: "500" 
                }}>
                  {selectedFileForReplace?.name}
                </p>
              </div>
            </div>
            <button
              onClick={handleCloseReplaceModal}
              style={{
                padding: "12px",
                background: "rgba(100, 116, 139, 0.08)",
                border: "none",
                borderRadius: "16px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X style={{ width: "20px", height: "20px", color: "#6b7280" }} />
            </button>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Champ AG (disabled) */}
            <div>
              <label 
                className="labelStyle"
                style={{ 
                  color: "#374151", 
                  fontWeight: "600",
                  fontSize: "15px",
                  marginBottom: "12px",
                  display: "block"
                }}
              >
                AG concernée
              </label>
              <div
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "2px solid #e5e7eb",
                  backgroundColor: "#f9fafb",
                  color: "#6b7280",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Calendar size={18} color="#9ca3af" />
                {selectedAgDetails?.code_ag || ""}
              </div>
            </div>
            
            {/* Sélection SGI */}
            <div>
              <label 
                className="labelStyle"
                style={{ 
                  color: "#374151", 
                  fontWeight: "600",
                  fontSize: "15px",
                  marginBottom: "12px",
                  display: "block"
                }}
              >
                SGI
              </label>
              <CustomSelect
                placeholder="Sélectionner une SGI"
                options={sgiOptions}
                value={selectedSgiForReplace}
                onChange={setSelectedSgiForReplace}
                searchPlaceholder="Rechercher une SGI..."
              />
            </div>
            
            {/* Upload de fichier de remplacement */}
            <div>
              <label 
                className="labelStyle"
                style={{ 
                  color: "#374151", 
                  fontWeight: "600",
                  fontSize: "15px",
                  marginBottom: "12px",
                  display: "block"
                }}
              >
                Nouveau fichier (CSV ou XLSX)
              </label>
              <input
                ref={replaceFileInputRef}
                type="file"
                accept=".csv,.xlsx"
                onChange={handleReplaceFileChange}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "2px dashed #d1d5db",
                  outline: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backgroundColor: "#fafafa",
                }}
              />
              {replaceFile && (
                <div style={{ 
                  marginTop: "12px", 
                  fontSize: "14px", 
                  color: "#10b981",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px",
                  background: "rgba(16, 185, 129, 0.1)",
                  borderRadius: "8px"
                }}>
                  <Check size={18} />
                  <span style={{ fontWeight: "500" }}>{replaceFile.name}</span>
                </div>
              )}
            </div>
            
            <div style={{ display: "flex", gap: "16px", paddingTop: "8px" }}>
              <button
                onClick={handleCloseReplaceModal}
                style={{
                  flex: 1,
                  padding: "16px 24px",
                  background: "#f8fafc",
                  color: "#6b7280",
                  borderRadius: "16px",
                  border: "2px solid #e5e7eb",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontSize: "15px",
                }}
              >
                Annuler
              </button>
              
              <button
                onClick={replaceFileWithSgi}
                disabled={uploadingFile || !selectedSgiForReplace || !replaceFile}
                style={{
                  flex: 1,
                  padding: "16px 24px",
                  background: uploadingFile || !selectedSgiForReplace || !replaceFile 
                    ? "rgba(245, 158, 11, 0.5)" 
                    : "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: "white",
                  borderRadius: "16px",
                  border: "none",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: uploadingFile || !selectedSgiForReplace || !replaceFile ? "not-allowed" : "pointer",
                  fontSize: "15px",
                  transition: "all 0.3s ease",
                }}
              >
                {uploadingFile ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <RefreshCw size={20} />
                )}
                {uploadingFile ? "Remplacement..." : "Remplacer le fichier"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

// 6. MODIFIER L'AFFICHAGE DES COMPOSANTS MODAUX (dans le return de la vue détaillée) :

        <UploadModal />
        <DepositaireModal />
        <ReplaceModal />

// 7. MODIFIER LA SECTION D'AFFICHAGE DES FICHIERS - AJOUTER LE BOUTON REMPLACER :

// Remplacer cette partie dans la section des fichiers :
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      onClick={() => downloadFile(file.id, file.name)}
                      disabled={downloadingFile}
                      style={{
                        background: "linear-gradient(135deg, #10b981, #047857)",
                        color: "white",
                        border: "none",
                        padding: "12px",
                        borderRadius: "12px",
                        cursor: downloadingFile ? "not-allowed" : "pointer",
                        opacity: downloadingFile ? 0.7 : 1,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {downloadingFile ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    </button>
                    
                    <button
                      onClick={() => handleOpenReplaceModal(file)}
                      disabled={uploadingFile}
                      style={{
                        background: "linear-gradient(135deg, #f59e0b, #d97706)",
                        color: "white",
                        border: "none",
                        padding: "12px",
                        borderRadius: "12px",
                        cursor: uploadingFile ? "not-allowed" : "pointer",
                        opacity: uploadingFile ? 0.7 : 1,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {uploadingFile ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                    </button>
                    
                    <button
                      onClick={() => deleteFile(file.id)}
                      disabled={deletingFile}
                      style={{
                        background: "linear-gradient(135deg, #ef4444, #dc2626)",
                        color: "white",
                        border: "none",
                        padding: "12px",
                        borderRadius: "12px",
                        cursor: deletingFile ? "not-allowed" : "pointer",
                        opacity: deletingFile ? 0.7 : 1,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {deletingFile ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>
