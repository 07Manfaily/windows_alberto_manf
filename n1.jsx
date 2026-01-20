import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  X,
  Check,
  Loader2,
  Plus,
  Calendar,
  Eye,
  Edit,
  Download,
  Building2,
  Search,
  Users,
  Upload,
  FileText,
  Trash2,
  Settings,
  ArrowLeft,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import "./style.css";
import CustomSelect from "../../components/selectField";

export default function AGListView() {
  // États principaux
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAgForEdit, setSelectedAgForEdit] = useState(null);
  
  // États pour le modal d'upload de fichier
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedSgiForUpload, setSelectedSgiForUpload] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  
  // Sélection entreprise
  const [companyOption, setCompanyOption] = useState(null);
  const [dateAg, setDateAg] = useState("");
  
  // États de chargement
  const [loadingList, setLoadingList] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState(false);
  const [deletingFile, setDeletingFile] = useState(false);
  
  // Données
  const [companies, setCompanies] = useState([]);
  const [ags, setAgs] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [agFiles, setAgFiles] = useState([]);
  
  // États de navigation
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSgi, setSelectedSgi] = useState(null);
  const [selectedAgDetails, setSelectedAgDetails] = useState(null);
  
  // États de recherche
  const [searchSgi, setSearchSgi] = useState("");
  const [searchParticipant, setSearchParticipant] = useState("");
  
  // Références
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  // ---- Utilitaires ----
  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat("fr-FR", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }).format(d);
    } catch {
      return iso;
    }
  };

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  // ---- API Calls ----
  
  // Récupérer les entreprises
  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/automation_ag/liste_entreprises", {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        console.error("Erreur lors de la récupération des entreprises");
        return;
      }
      const data = await response.json();
      const list = Array.isArray(data?.data) ? data.data : [];
      setCompanies(list);
    } catch (error) {
      console.error("Erreur réseau (entreprises):", error);
    }
  };

  // Récupérer la liste des AG
  const fetchAgs = async () => {
    setLoadingList(true);
    try {
      const response = await fetch("/api/automation_ag/list_ags", {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        console.error("Erreur lors de la récupération des AG");
        return;
      }
      const data = await response.json();
      setAgs(data.items || []);
    } catch (error) {
      console.error("Erreur réseau (AG):", error);
    } finally {
      setLoadingList(false);
    }
  };

  // Récupérer les informations détaillées d'une AG
  const fetchAgInfo = async (agId) => {
    try {
      const response = await fetch(`/api/automation_ag/info_ag/${agId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        console.error("Erreur lors de la récupération des infos AG");
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur réseau (info AG):", error);
      return null;
    }
  };

  // Récupérer les fichiers d'une AG
  const fetchAgFiles = async (agId) => {
    setLoadingFiles(true);
    try {
      const response = await fetch(`/api/automation_ag/get_list_file_ag/${agId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        console.error("Erreur lors de la récupération des fichiers");
        return;
      }
      const data = await response.json();
      setAgFiles(data.files || []);
    } catch (error) {
      console.error("Erreur réseau (fichiers AG):", error);
    } finally {
      setLoadingFiles(false);
    }
  };

  // Récupérer les participants par SGI
  const fetchParticipants = async (codeAg) => {
    setLoadingParticipants(true);
    try {
      const response = await fetch(
        `/api/automation_ag/list_users_ag/${codeAg}/participants-par-sgi`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        console.error("Erreur lors de la récupération des participants");
        return;
      }
      const data = await response.json();
      setParticipants(data);
    } catch (error) {
      console.error("Erreur réseau (participants):", error);
    } finally {
      setLoadingParticipants(false);
    }
  };

  // Récupérer les actionnaires par SGI
  const fetchActionnaires = async (download = false, format = 'json') => {
    try {
      const params = new URLSearchParams();
      if (download) params.append('download', 'true');
      if (format !== 'json') params.append('format', format);
      
      const response = await fetch(
        `/api/automation_ag/liste_actionnaires_ag/actionnaires-par-sgi?${params}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        console.error("Erreur lors de la récupération des actionnaires");
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur réseau (actionnaires):", error);
      return null;
    }
  };

  // Créer une nouvelle AG
  const createAg = async () => {
    if (!companyOption || !dateAg) return;
    setLoadingCreate(true);
    
    const payload = {
      date_ag: dateAg,
      infos_entreprise: {
        nom_entreprise: companyOption,
      },
    };

    try {
      const response = await fetch("/api/automation_ag/create_ag", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        console.error("Erreur lors de la création");
        return;
      }
      
      await fetchAgs();
      setOpen(false);
      setCompanyOption(null);
      setDateAg("");
    } catch (error) {
      console.error("Erreur réseau:", error);
    } finally {
      setLoadingCreate(false);
    }
  };

  // Modifier une AG existante
  const updateAg = async () => {
    if (!selectedAgForEdit || !companyOption || !dateAg) return;
    setLoadingCreate(true);
    
    const payload = {
      ag_id: selectedAgForEdit.ag_id,
      date_ag: dateAg,
      infos_entreprise: {
        nom_entreprise: companyOption,
      },
    };

    try {
      const response = await fetch(`/api/automation_ag/update_ag/${selectedAgForEdit.ag_id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        console.error("Erreur lors de la modification");
        return;
      }
      
      await fetchAgs();
      setOpen(false);
      setEditMode(false);
      setSelectedAgForEdit(null);
      setCompanyOption(null);
      setDateAg("");
    } catch (error) {
      console.error("Erreur réseau:", error);
    } finally {
      setLoadingCreate(false);
    }
  };

  // Upload de fichier avec SGI
  const handleFileUploadWithSgi = async () => {
    if (!uploadFile || !selectedSgiForUpload || !selectedAgDetails) return;
    
    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('sgi_info', selectedSgiForUpload);

    try {
      const response = await fetch(`/api/automation_ag/add_file/${selectedAgDetails.ag_id}/files-sgi`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        console.error("Erreur lors de l'upload du fichier");
        return;
      }

      // Refresh la liste des fichiers
      await fetchAgFiles(selectedAgDetails.ag_id);
      
      // Reset et fermer le modal
      setUploadModalOpen(false);
      setSelectedSgiForUpload(null);
      setUploadFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Erreur réseau (upload):", error);
    } finally {
      setUploadingFile(false);
    }
  };

  // Supprimer un fichier
  const deleteFile = async (fileId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?")) {
      return;
    }

    setDeletingFile(true);
    try {
      const response = await fetch(`/api/automation_ag/delete_file_ag/${fileId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        console.error("Erreur lors de la suppression du fichier");
        return;
      }

      // Refresh la liste des fichiers
      await fetchAgFiles(selectedAgDetails.ag_id);
    } catch (error) {
      console.error("Erreur réseau (suppression):", error);
    } finally {
      setDeletingFile(false);
    }
  };

  // Télécharger un fichier
  const downloadFile = async (fileId, fileName) => {
    setDownloadingFile(true);
    try {
      const response = await fetch(`/api/automation_ag/download_file/${fileId}`, {
        method: 'GET',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        console.error("Erreur lors du téléchargement");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erreur réseau (téléchargement):", error);
    } finally {
      setDownloadingFile(false);
    }
  };

  // Télécharger la liste des participants
  const downloadParticipants = async (format) => {
    setDownloadingFile(true);
    try {
      const response = await fetch(
        `/api/automation_ag/list_users_ag/${selectedAgDetails.code_ag}/participants-par-sgi?download=true&format=${format}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        console.error("Erreur lors du téléchargement");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `participants_${selectedAgDetails.code_ag}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erreur réseau (téléchargement participants):", error);
    } finally {
      setDownloadingFile(false);
    }
  };

  // ---- Handlers ----
  
  const handleAgClick = async (ag) => {
    setSelectedAgDetails(ag);
    setSelectedSgi(null);
    setSearchSgi("");
    setSearchParticipant("");
    
    // Charger les participants et les fichiers en parallèle
    await Promise.all([
      fetchParticipants(ag.code_ag),
      fetchAgFiles(ag.ag_id)
    ]);
  };

  const handleBackToList = () => {
    setSelectedAgDetails(null);
    setParticipants([]);
    setAgFiles([]);
    setSelectedSgi(null);
    setSearchSgi("");
    setSearchParticipant("");
  };

  const handleSgiClick = (sgi) => {
    setIsOpen(true);
    setSelectedSgi(sgi);
    setSearchParticipant("");
  };

  const handleEditAg = (ag) => {
    setSelectedAgForEdit(ag);
    setEditMode(true);
    setCompanyOption(ag.entreprise.nom_entreprise);
    setDateAg(ag.date_ag);
    setOpen(true);
  };

  const handleOpenUploadModal = () => {
    setUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
    setSelectedSgiForUpload(null);
    setUploadFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Vérifier que le fichier est CSV ou XLSX
      const allowedTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      const allowedExtensions = ['.csv', '.xlsx'];
      const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      
      if (allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension)) {
        setUploadFile(file);
      } else {
        alert("Seuls les fichiers CSV et XLSX sont autorisés.");
        event.target.value = '';
      }
    }
  };

  // ---- Effects ----
  useEffect(() => {
    fetchCompanies();
    fetchAgs();
  }, []);

  // ---- Computed values ----
  const companyOptions = useMemo(
    () =>
      companies.map((e) => ({
        label: e?.nom_entreprise ?? "",
        value: e?.nom_entreprise ?? "",
      })),
    [companies]
  );

  const sgiOptions = useMemo(
    () =>
      participants?.result?.map((sgi, index) => ({
        label: sgi?.nom_sgi ?? "",
        value: index.toString(),
      })) || [],
    [participants]
  );

  const filteredParticipants = participants?.result?.filter((sgi) =>
    sgi.nom_sgi.toLowerCase().includes(searchSgi.toLowerCase())
  );

  const filteredSgiParticipants = selectedSgi
    ? selectedSgi.participants?.filter((p) =>
        p.nom_prenom.toLowerCase().includes(searchParticipant.toLowerCase())
      )
    : [];

  // ---- Modal d'upload de fichier ----
  const UploadModal = () => {
    if (!uploadModalOpen) return null;
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
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
            background: "white",
            borderRadius: "24px",
            padding: "32px",
            maxWidth: "500px",
            width: "100%",
            boxShadow: "0 20px 80px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "24px",
                fontWeight: "700",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Charger un fichier
            </h3>
            <button
              onClick={handleCloseUploadModal}
              style={{
                padding: "10px",
                background: "rgba(100, 116, 139, 0.1)",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <X style={{ width: "24px", height: "24px", color: "#6b7280" }} />
            </button>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Champ AG (disabled) */}
            <div>
              <label className="labelStyle">AG concernée</label>
              <input
                value={selectedAgDetails?.code_ag || ""}
                disabled
                className="inputStyle"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e5e7eb",
                  outline: "none",
                  backgroundColor: "#f9fafb",
                  color: "#6b7280",
                }}
              />
            </div>
            
            {/* Sélection SGI */}
            <div>
              <label className="labelStyle">SGI</label>
              <CustomSelect
                placeholder="Sélectionner une SGI"
                options={sgiOptions}
                value={selectedSgiForUpload}
                onChange={setSelectedSgiForUpload}
                searchPlaceholder="Rechercher une SGI..."
              />
            </div>
            
            {/* Upload de fichier */}
            <div>
              <label className="labelStyle">Fichier (CSV ou XLSX)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileChange}
                className="inputStyle"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e5e7eb",
                  outline: "none",
                  cursor: "pointer",
                }}
              />
              {uploadFile && (
                <div style={{ 
                  marginTop: "8px", 
                  fontSize: "14px", 
                  color: "#10b981",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  <Check size={16} />
                  {uploadFile.name}
                </div>
              )}
            </div>
            
            <div style={{ display: "flex", gap: "12px", paddingTop: "16px" }}>
              <button
                onClick={handleCloseUploadModal}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  background: "#f3f4f6",
                  color: "#374151",
                  borderRadius: "12px",
                  border: "none",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
              >
                Annuler
              </button>
              
              <button
                onClick={handleFileUploadWithSgi}
                disabled={uploadingFile || !selectedSgiForUpload || !uploadFile}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "white",
                  borderRadius: "12px",
                  border: "none",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: "pointer",
                  opacity: uploadingFile || !selectedSgiForUpload || !uploadFile ? 0.7 : 1,
                }}
              >
                {uploadingFile ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Upload style={{ width: "20px", height: "20px" }} />
                )}
                {uploadingFile ? "Upload..." : "Charger le fichier"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ---- Modal des participants SGI ----
  if (isOpen && selectedAgDetails && selectedSgi) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          padding: "20px",
          animation: "fadeIn 0.3s ease-out",
        }}
        onClick={() => setIsOpen(false)}
      >
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 20px 80px rgba(0,0,0,0.3)",
            width: "700px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "25px",
              borderRadius: "12px",
              marginBottom: "25px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.3)",
                  padding: "15px",
                  borderRadius: "12px",
                }}
              >
                <Users size={30} color="white" />
              </div>
              <div>
                <h2
                  style={{
                    color: "white",
                    fontWeight: "700",
                    fontSize: "24px",
                    margin: 0,
                    marginBottom: "6px",
                  }}
                >
                  {selectedSgi.nom_sgi}
                </h2>
                <div
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "14px",
                  }}
                >
                  {selectedSgi.participants.length} participants présents
                </div>
              </div>
            </div>
          </div>

          {/* Barre de recherche */}
          <div style={{ position: "relative", marginBottom: "25px" }}>
            <Search
              size={20}
              color="#9ca3af"
              style={{
                position: "absolute",
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              type="text"
              placeholder="Rechercher un participant..."
              value={searchParticipant}
              onChange={(e) => setSearchParticipant(e.target.value)}
              style={{
                width: "calc(100% - 30px)",
                padding: "14px 14px 14px 45px",
                borderRadius: "10px",
                border: "2px solid #e5e7eb",
                fontSize: "15px",
                outline: "none",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#667eea")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>

          {/* Liste des participants */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredSgiParticipants?.length > 0 ? (
              filteredSgiParticipants.map((participant, pIndex) => (
                <div
                  key={pIndex}
                  style={{
                    background: "#f8fafc",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.3s ease",
                    border: "1px solid #e2e8f0",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#e2e8f0";
                    e.currentTarget.style.transform = "translateX(5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f8fafc";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "18px",
                    }}
                  >
                    <div
                      style={{
                        width: "55px",
                        height: "55px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "18px",
                        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                      }}
                    >
                      {participant.nom_prenom
                        .split(" ")
                        .map((n) => n.charAt(0))
                        .join("")}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: "700",
                          color: "#1a202c",
                          fontSize: "17px",
                          marginBottom: "5px",
                        }}
                      >
                        {participant.nom_prenom}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#6b7280",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "#10b981",
                          }}
                        ></div>
                        ID: {participant.user_id}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#10b981",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    Présent
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "50px",
                  color: "#6b7280",
                  fontSize: "15px",
                }}
              >
                <Users
                  size={48}
                  color="#d1d5db"
                  style={{ margin: "0 auto 15px" }}
                />
                Aucun participant trouvé
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---- Modal de création/modification d'AG ----
  const Modal = () => {
    if (!open) return null;
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          padding: "20px",
          animation: "fadeIn 0.3s ease-out",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "32px",
            maxWidth: "600px",
            width: "100%",
            boxShadow: "0 20px 80px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "24px",
                fontWeight: "700",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {editMode ? "Modifier l'AG" : "Créer une nouvelle AG"}
            </h3>
            <button
              onClick={() => {
                setOpen(false);
                setEditMode(false);
                setSelectedAgForEdit(null);
                setCompanyOption(null);
                setDateAg("");
              }}
              style={{
                padding: "10px",
                background: "rgba(100, 116, 139, 0.1)",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <X style={{ width: "24px", height: "24px", color: "#6b7280" }} />
            </button>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label className="labelStyle">Entreprise</label>
              <CustomSelect
                placeholder="Sélectionner une entreprise"
                options={companyOptions}
                value={companyOption}
                onChange={setCompanyOption}
                searchPlaceholder="Rechercher une entreprise..."
              />
            </div>
            
            <div>
              <label className="labelStyle">Date de l'AG</label>
              <input
                value={dateAg}
                onChange={(e) => setDateAg(e.target.value)}
                type="date"
                className="inputStyle"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #e5e7eb",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                }}
              />
            </div>
            
            <div style={{ display: "flex", gap: "12px", paddingTop: "16px" }}>
              <button
                onClick={() => {
                  setOpen(false);
                  setEditMode(false);
                  setSelectedAgForEdit(null);
                  setCompanyOption(null);
                  setDateAg("");
                }}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  background: "#f3f4f6",
                  color: "#374151",
                  borderRadius: "12px",
                  border: "none",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
              >
                Annuler
              </button>
              
              <button
                onClick={editMode ? updateAg : createAg}
                disabled={loadingCreate || !companyOption || !dateAg}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "white",
                  borderRadius: "12px",
                  border: "none",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: "pointer",
                  opacity: loadingCreate || !companyOption || !dateAg ? 0.7 : 1,
                }}
              >
                {loadingCreate ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Check style={{ width: "20px", height: "20px" }} />
                )}
                {loadingCreate 
                  ? (editMode ? "Modification..." : "Création...")
                  : (editMode ? "Modifier l'AG" : "Créer l'AG")
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ---- Vue détaillée d'une AG ----
  if (selectedAgDetails) {
    return (
      <div style={{ padding: "40px" }}>
        <UploadModal />
        
        {/* Bouton retour */}
        <button
          onClick={handleBackToList}
          style={{
            background: "#f3f4f6",
            color: "#374151",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <ArrowLeft size={16} />
          Retour à la liste des AG
        </button>

        {/* En-tête de l'AG */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "28px",
                  color: "#1a202c",
                  marginBottom: "10px",
                }}
              >
                {selectedAgDetails.code_ag}
              </h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Building2 size={18} color="#667eea" />
                  <span style={{ fontSize: "16px", color: "#6b7280" }}>
                    {selectedAgDetails.entreprise.nom_entreprise}
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Calendar size={18} color="#10b981" />
                  <span style={{ fontSize: "16px", color: "#6b7280" }}>
                    {formatDate(selectedAgDetails.date_ag)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleOpenUploadModal}
                disabled={uploadingFile}
                style={{
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: uploadingFile ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  opacity: uploadingFile ? 0.7 : 1,
                }}
              >
                <Upload size={16} />
                Charger un fichier
              </button>
              
              <button
                onClick={() => handleEditAg(selectedAgDetails)}
                style={{
                  background: "#f59e0b",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                <Edit size={16} />
                Modifier AG
              </button>
            </div>
          </div>

          {/* Statistiques */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#1e40af",
                  marginBottom: "5px",
                  fontWeight: "600",
                }}
              >
                Fichiers
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#1e3a8a",
                }}
              >
                {agFiles.length}
              </div>
            </div>
            
            <div
              style={{
                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#d97706",
                  marginBottom: "5px",
                  fontWeight: "600",
                }}
              >
                Total Actionnaires
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#92400e",
                }}
              >
                {participants?.result?.reduce((acc, sgi) => acc + sgi.participants.length, 0) || 0}
              </div>
            </div>
            
            <div
              style={{
                background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#15803d",
                  marginBottom: "5px",
                  fontWeight: "600",
                }}
              >
                SGI représentés
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#14532d",
                }}
              >
                {participants?.result?.length || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Section des fichiers */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: "30px",
          }}
        >
          <h3 style={{ fontSize: "20px", color: "#1a202c", marginBottom: "20px" }}>
            Fichiers de l'AG
          </h3>
          
          {loadingFiles ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Loader2 className="animate-spin" size={32} />
              <p style={{ marginTop: "10px", color: "#6b7280" }}>Chargement des fichiers...</p>
            </div>
          ) : agFiles.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
              <FileText size={48} color="#d1d5db" style={{ margin: "0 auto 15px" }} />
              Aucun fichier disponible
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "15px" }}>
              {agFiles.map((file, index) => (
                <div
                  key={index}
                  style={{
                    background: "#f8fafc",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <FileText size={24} color="#667eea" />
                    <div>
                      <div style={{ fontWeight: "600", color: "#1a202c" }}>
                        {file.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        {file.size} • {file.type}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      onClick={() => downloadFile(file.id, file.name)}
                      disabled={downloadingFile}
                      style={{
                        background: "#10b981",
                        color: "white",
                        border: "none",
                        padding: "8px",
                        borderRadius: "6px",
                        cursor: downloadingFile ? "not-allowed" : "pointer",
                        opacity: downloadingFile ? 0.7 : 1,
                      }}
                    >
                      {downloadingFile ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    </button>
                    
                    <button
                      onClick={() => deleteFile(file.id)}
                      disabled={deletingFile}
                      style={{
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "8px",
                        borderRadius: "6px",
                        cursor: deletingFile ? "not-allowed" : "pointer",
                        opacity: deletingFile ? 0.7 : 1,
                      }}
                    >
                      {deletingFile ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section des SGI */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <h3 style={{ fontSize: "20px", color: "#1a202c", margin: 0 }}>
              SGI présents à l'assemblée
            </h3>
            
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => downloadParticipants('xlsx')}
                disabled={downloadingFile}
                style={{
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: downloadingFile ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  opacity: downloadingFile ? 0.7 : 1,
                }}
              >
                <Download size={16} />
                Excel
              </button>
              
              <button
                onClick={() => downloadParticipants('pdf')}
                disabled={downloadingFile}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: downloadingFile ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  opacity: downloadingFile ? 0.7 : 1,
                }}
              >
                <Download size={16} />
                PDF
              </button>
            </div>
          </div>

          {/* Barre de recherche SGI */}
          <div style={{ position: "relative", marginBottom: "25px" }}>
            <Search
              size={20}
              color="#9ca3af"
              style={{
                position: "absolute",
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              type="text"
              placeholder="Rechercher un SGI..."
              value={searchSgi}
              onChange={(e) => setSearchSgi(e.target.value)}
              style={{
                width: "calc(100% - 30px)",
                padding: "14px 14px 14px 45px",
                borderRadius: "10px",
                border: "2px solid #e5e7eb",
                fontSize: "15px",
                outline: "none",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#667eea")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>

          {loadingParticipants ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px",
                color: "#6b7280",
              }}
            >
              <Loader2 
                size={50}
                className="animate-spin"
                style={{ margin: "0 auto 20px" }}
              />
              Chargement des SGI...
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "20px",
              }}
            >
              {filteredParticipants && filteredParticipants.length > 0 ? (
                filteredParticipants.map((sgi, index) => {
                  const colors = [
                    {
                      bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      light: "#e0e7ff",
                      text: "#4338ca",
                      icon: "#667eea",
                    },
                    {
                      bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                      light: "#fce7f3",
                      text: "#be185d",
                      icon: "#f093fb",
                    },
                    {
                      bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                      light: "#dbeafe",
                      text: "#0369a1",
                      icon: "#4facfe",
                    },
                    {
                      bg: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                      light: "#d1fae5",
                      text: "#065f46",
                      icon: "#43e97b",
                    },
                    {
                      bg: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                      light: "#fef3c7",
                      text: "#92400e",
                      icon: "#fa709a",
                    },
                  ];
                  const colorScheme = colors[index % colors.length];
                  
                  return (
                    <div
                      key={index}
                      onClick={() => handleSgiClick(sgi)}
                      style={{
                        background: "white",
                        border: `2px solid ${colorScheme.light}`,
                        borderRadius: "16px",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.boxShadow = `0 12px 24px ${colorScheme.light}`;
                        e.currentTarget.style.borderColor = colorScheme.text;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor = colorScheme.light;
                      }}
                    >
                      <div
                        style={{
                          background: colorScheme.bg,
                          padding: "15px",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            background: "rgba(255,255,255,0.3)",
                            backdropFilter: "blur(10px)",
                            width: "60px",
                            height: "60px",
                            borderRadius: "15px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "15px",
                          }}
                        >
                          <Users size={30} color="white" />
                        </div>
                        <h4
                          style={{
                            fontSize: "18px",
                            fontWeight: "700",
                            color: "white",
                            marginBottom: "8px",
                            margin: 0,
                          }}
                        >
                          {sgi.nom_sgi}
                        </h4>
                        <div
                          style={{
                            color: "rgba(255,255,255,0.9)",
                            fontSize: "13px",
                            marginTop: "8px",
                          }}
                        >
                          Société de Gestion et d'Intermédiation
                        </div>
                      </div>
                      
                      <div style={{ padding: "15px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "15px",
                          }}
                        >
                          <div style={{ fontSize: "14px", color: "#6b7280" }}>
                            Nombre d'actionnaires
                          </div>
                          <div
                            style={{
                              background: colorScheme.light,
                              color: colorScheme.text,
                              padding: "6px 16px",
                              borderRadius: "20px",
                              fontSize: "16px",
                              fontWeight: "700",
                            }}
                          >
                            {sgi.participants.length}
                          </div>
                        </div>
                        
                        <div
                          style={{
                            padding: "15px",
                            background: colorScheme.light,
                            borderRadius: "10px",
                            marginBottom: "15px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "12px",
                              color: colorScheme.text,
                              fontWeight: "600",
                              marginBottom: "8px",
                            }}
                          >
                            Aperçu des participants
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: "6px",
                              flexWrap: "wrap",
                            }}
                          >
                            {sgi.participants.slice(0, 5).map((p, i) => (
                              <div
                                key={i}
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  background: colorScheme.bg,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  fontSize: "11px",
                                  fontWeight: "700",
                                  border: "2px solid white",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                }}
                              >
                                {p.nom_prenom
                                  .split(" ")
                                  .map((n) => n.charAt(0))
                                  .join("")}
                              </div>
                            ))}
                            {sgi.participants.length > 5 && (
                              <div
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  background: "#f3f4f6",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#6b7280",
                                  fontSize: "11px",
                                  fontWeight: "700",
                                  border: "2px solid white",
                                }}
                              >
                                +{sgi.participants.length - 5}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            color: colorScheme.text,
                            fontSize: "14px",
                            fontWeight: "600",
                            paddingTop: "10px",
                            borderTop: `1px solid ${colorScheme.light}`,
                          }}
                        >
                          <Eye size={16} />
                          Voir tous les participants
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "50px",
                    color: "#6b7280",
                    fontSize: "15px",
                  }}
                >
                  <Users
                    size={48}
                    color="#d1d5db"
                    style={{ margin: "0 auto 15px" }}
                  />
                  Aucun SGI trouvé
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- Vue principale (liste des AG) ----
  return (
    <div style={{ padding: "40px" }}>
      <Modal />
      
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <h1 style={{ 
          fontSize: "32px", 
          fontWeight: "700", 
          color: "#1f2937",
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Gestion des Assemblées Générales
        </h1>
        
        <button
          onClick={() => setOpen(true)}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "14px 28px",
            borderRadius: "12px",
            border: "none",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontSize: "16px",
            fontWeight: "600",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
          }}
        >
          <Plus style={{ width: "22px", height: "22px" }} />
          Créer une AG
        </button>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
          minHeight: 200,
        }}
      >
        {loadingList ? (
          <div style={{ 
            display: "flex", 
            flexDirection: "column",
            alignItems: "center", 
            justifyContent: "center",
            padding: "60px",
            gap: "20px" 
          }}>
            <Loader2 
              size={50}
              className="animate-spin"
              color="#667eea"
            />
            <span style={{ color: "#6b7280", fontSize: "16px" }}>
              Chargement des AG...
            </span>
          </div>
        ) : ags.length === 0 ? (
          <div style={{ 
            textAlign: "center",
            padding: "60px",
            color: "#6b7280" 
          }}>
            <Calendar size={64} color="#d1d5db" style={{ margin: "0 auto 20px" }} />
            <h3 style={{ margin: "0 0 10px 0", color: "#374151" }}>
              Aucune AG créée
            </h3>
            <p style={{ margin: 0 }}>
              Commencez par créer votre première Assemblée Générale
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: "30px",
            }}
          >
            {ags.map((ag, index) => (
              <div
                key={ag.entreprise?.entreprise_id || index}
                onClick={() => handleAgClick(ag)}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: "1px solid #f1f5f9",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                  e.currentTarget.style.borderColor = "#f1f5f9";
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    padding: "25px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "20px",
                      right: "20px",
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    {new Date(ag.date_ag).toLocaleDateString("fr-FR")}
                  </div>
                  
                  <div
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      width: "70px",
                      height: "70px",
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <Calendar size={35} color="white" />
                  </div>
                  
                  <h3
                    style={{
                      fontSize: "22px",
                      fontWeight: "700",
                      color: "white",
                      marginBottom: "12px",
                      margin: 0,
                    }}
                  >
                    {ag.code_ag}
                  </h3>
                  
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "15px",
                    }}
                  >
                    <Building2 size={18} />
                    {ag.entreprise?.nom_entreprise || "Entreprise non définie"}
                  </div>
                </div>
                
                <div style={{ padding: "25px" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "20px",
                      marginBottom: "25px",
                    }}
                  >
                    <div
                      style={{
                        background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
                        padding: "18px",
                        borderRadius: "12px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#1e40af",
                          marginBottom: "8px",
                          fontWeight: "600",
                        }}
                      >
                        Fichiers
                      </div>
                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: "700",
                          color: "#1e3a8a",
                        }}
                      >
                        {ag.fichiers_count || "N/A"}
                      </div>
                    </div>
                    
                    <div
                      style={{
                        background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                        padding: "18px",
                        borderRadius: "12px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#15803d",
                          marginBottom: "8px",
                          fontWeight: "600",
                        }}
                      >
                        Participants
                      </div>
                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: "700",
                          color: "#14532d",
                        }}
                      >
                        {ag.participants_count || "N/A"}
                      </div>
                    </div>
                  </div>
                  
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      color: "#667eea",
                      fontSize: "15px",
                      fontWeight: "600",
                      paddingTop: "15px",
                      borderTop: "1px solid #f1f5f9",
                    }}
                  >
                    <Eye size={18} />
                    Voir les détails
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
