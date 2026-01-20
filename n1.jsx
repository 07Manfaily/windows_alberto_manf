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
  Shield,
  RefreshCw,
  Archive,
  Star,
  Crown,
} from "lucide-react";
import "./style.css";
import CustomSelect from "../../components/selectField";

export default function AGListView() {
  // États principaux
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAgForEdit, setSelectedAgForEdit] = useState(null);
  
  // États pour le modal d'upload de fichier SGI
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedSgiForUpload, setSelectedSgiForUpload] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  
  // États pour la gestion des dépositaires
  const [depositaireModalOpen, setDepositaireModalOpen] = useState(false);
  const [depositaireAction, setDepositaireAction] = useState('import'); // 'import' ou 'replace'
  const [depositaireFile, setDepositaireFile] = useState(null);
  const [actionnairesSgiData, setActionnairesSgiData] = useState(null);
  const [loadingActionnaires, setLoadingActionnaires] = useState(false);
  
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
  const [uploadingDepositaire, setUploadingDepositaire] = useState(false);
  
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
  const depositaireFileInputRef = useRef(null);
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

  // Récupérer la liste des actionnaires par SGI
  const fetchActionnairesSgi = async (enterpriseId, codeAg, download = false, format = 'json') => {
    setLoadingActionnaires(true);
    try {
      const params = new URLSearchParams();
      if (enterpriseId) params.append('entreprise_id', enterpriseId);
      if (codeAg) params.append('code_ag', codeAg);
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
      
      if (download) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `actionnaires_sgi_${codeAg || 'export'}.${format === 'xlsx' ? 'xlsx' : 'csv'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return null;
      }
      
      const data = await response.json();
      setActionnairesSgiData(data);
      return data;
    } catch (error) {
      console.error("Erreur réseau (actionnaires SGI):", error);
      return null;
    } finally {
      setLoadingActionnaires(false);
    }
  };

  // Import de fichier dépositaire
  const importDepositaireFile = async (agId, file) => {
    setUploadingDepositaire(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/automation_ag/depositaire_file_ag/${agId}/import`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        console.error("Erreur lors de l'import du fichier dépositaire");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erreur réseau (import dépositaire):", error);
      return false;
    } finally {
      setUploadingDepositaire(false);
    }
  };

  // Remplacer le fichier dépositaire
  const replaceDepositaireFile = async (agId, file) => {
    setUploadingDepositaire(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/automation_ag/depositaire_file_ag/${agId}/replace`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        console.error("Erreur lors du remplacement du fichier dépositaire");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erreur réseau (remplacement dépositaire):", error);
      return false;
    } finally {
      setUploadingDepositaire(false);
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

  // Gérer l'upload/remplacement du fichier dépositaire
  const handleDepositaireFileUpload = async () => {
    if (!depositaireFile || !selectedAgDetails) return;

    let success = false;
    if (depositaireAction === 'import') {
      success = await importDepositaireFile(selectedAgDetails.ag_id, depositaireFile);
    } else {
      success = await replaceDepositaireFile(selectedAgDetails.ag_id, depositaireFile);
    }

    if (success) {
      setDepositaireModalOpen(false);
      setDepositaireFile(null);
      setDepositaireAction('import');
      if (depositaireFileInputRef.current) {
        depositaireFileInputRef.current.value = '';
      }
      // Optionnel : refresh des données si nécessaire
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
    setActionnairesSgiData(null);
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

  const handleOpenDepositaireModal = (action) => {
    setDepositaireAction(action);
    setDepositaireModalOpen(true);
  };

  const handleCloseDepositaireModal = () => {
    setDepositaireModalOpen(false);
    setDepositaireFile(null);
    setDepositaireAction('import');
    if (depositaireFileInputRef.current) {
      depositaireFileInputRef.current.value = '';
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

  const handleDepositaireFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Vérifier que le fichier est PDF
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        setDepositaireFile(file);
      } else {
        alert("Seuls les fichiers PDF sont autorisés pour les dépositaires.");
        event.target.value = '';
      }
    }
  };

  // ---- Effects ----
  useEffect(() => {
    fetchCompanies();
    fetchAgs();
  }, []);

  // Charger les actionnaires SGI quand on sélectionne une AG
  useEffect(() => {
    if (selectedAgDetails) {
      fetchActionnairesSgi(selectedAgDetails.entreprise?.entreprise_id, selectedAgDetails.code_ag);
    }
  }, [selectedAgDetails]);

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

  // ---- Modal de gestion des dépositaires ----
  const DepositaireModal = () => {
    if (!depositaireModalOpen) return null;
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
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  padding: "12px",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Shield size={24} color="white" />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    margin: 0,
                    marginBottom: "4px",
                  }}
                >
                  {depositaireAction === 'import' ? 'Importer' : 'Remplacer'} le dépositaire
                </h3>
                <p style={{ 
                  margin: 0, 
                  color: "#6b7280", 
                  fontSize: "14px",
                  fontWeight: "500" 
                }}>
                  {depositaireAction === 'import' 
                    ? 'Ajouter un nouveau fichier dépositaire PDF' 
                    : 'Remplacer le fichier dépositaire existant'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={handleCloseDepositaireModal}
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
            
            {/* Upload de fichier dépositaire */}
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
                Fichier dépositaire (PDF uniquement)
              </label>
              <input
                ref={depositaireFileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleDepositaireFileChange}
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
              {depositaireFile && (
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
                  <span style={{ fontWeight: "500" }}>{depositaireFile.name}</span>
                </div>
              )}
            </div>
            
            <div style={{ display: "flex", gap: "16px", paddingTop: "8px" }}>
              <button
                onClick={handleCloseDepositaireModal}
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
                onClick={handleDepositaireFileUpload}
                disabled={uploadingDepositaire || !depositaireFile}
                style={{
                  flex: 1,
                  padding: "16px 24px",
                  background: uploadingDepositaire || !depositaireFile 
                    ? "rgba(102, 126, 234, 0.5)" 
                    : "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "white",
                  borderRadius: "16px",
                  border: "none",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: uploadingDepositaire || !depositaireFile ? "not-allowed" : "pointer",
                  fontSize: "15px",
                  transition: "all 0.3s ease",
                }}
              >
                {uploadingDepositaire ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Shield size={20} />
                )}
                {uploadingDepositaire 
                  ? "Traitement..." 
                  : (depositaireAction === 'import' ? "Importer" : "Remplacer")
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ---- Modal d'upload de fichier SGI ----
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
      <div style={{ padding: "40px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
        <UploadModal />
        <DepositaireModal />
        
        {/* Bouton retour */}
        <button
          onClick={handleBackToList}
          style={{
            background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
            color: "#4a5568",
            border: "2px solid #e2e8f0",
            padding: "12px 24px",
            borderRadius: "16px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateX(-4px)";
            e.currentTarget.style.background = "linear-gradient(135deg, #e2e8f0, #cbd5e0)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateX(0)";
            e.currentTarget.style.background = "linear-gradient(135deg, #f8fafc, #e2e8f0)";
          }}
        >
          <ArrowLeft size={18} />
          Retour à la liste des AG
        </button>

        {/* En-tête de l'AG avec design premium */}
        <div
          style={{
            background: "linear-gradient(145deg, #ffffff 0%, #f7fafc 100%)",
            padding: "40px",
            borderRadius: "24px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.05)",
            marginBottom: "40px",
            border: "1px solid rgba(226, 232, 240, 0.8)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: "32px",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                <div
                  style={{
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    padding: "16px",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Crown size={32} color="white" />
                </div>
                <div>
                  <h1
                    style={{
                      fontSize: "36px",
                      color: "#1a202c",
                      margin: 0,
                      fontWeight: "800",
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {selectedAgDetails.code_ag}
                  </h1>
                  <div style={{ display: "flex", alignItems: "center", gap: "24px", marginTop: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Building2 size={20} color="#667eea" />
                      <span style={{ fontSize: "16px", color: "#4a5568", fontWeight: "500" }}>
                        {selectedAgDetails.entreprise.nom_entreprise}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Calendar size={20} color="#10b981" />
                      <span style={{ fontSize: "16px", color: "#4a5568", fontWeight: "500" }}>
                        {formatDate(selectedAgDetails.date_ag)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions avec design amélioré */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button
                onClick={handleOpenUploadModal}
                disabled={uploadingFile}
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  color: "white",
                  border: "none",
                  padding: "14px 24px",
                  borderRadius: "16px",
                  cursor: uploadingFile ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  opacity: uploadingFile ? 0.7 : 1,
                  boxShadow: "0 4px 16px rgba(59, 130, 246, 0.4)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => !uploadingFile && (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <Upload size={18} />
                Fichier SGI
              </button>
              
              <button
                onClick={() => handleOpenDepositaireModal('import')}
                disabled={uploadingDepositaire}
                style={{
                  background: "linear-gradient(135deg, #10b981, #047857)",
                  color: "white",
                  border: "none",
                  padding: "14px 24px",
                  borderRadius: "16px",
                  cursor: uploadingDepositaire ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  opacity: uploadingDepositaire ? 0.7 : 1,
                  boxShadow: "0 4px 16px rgba(16, 185, 129, 0.4)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => !uploadingDepositaire && (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <Shield size={18} />
                Dépositaire
              </button>
              
              <button
                onClick={() => handleOpenDepositaireModal('replace')}
                disabled={uploadingDepositaire}
                style={{
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: "white",
                  border: "none",
                  padding: "14px 24px",
                  borderRadius: "16px",
                  cursor: uploadingDepositaire ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  opacity: uploadingDepositaire ? 0.7 : 1,
                  boxShadow: "0 4px 16px rgba(245, 158, 11, 0.4)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => !uploadingDepositaire && (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <RefreshCw size={18} />
                Remplacer
              </button>
              
              <button
                onClick={() => handleEditAg(selectedAgDetails)}
                style={{
                  background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                  color: "white",
                  border: "none",
                  padding: "14px 24px",
                  borderRadius: "16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  boxShadow: "0 4px 16px rgba(139, 92, 246, 0.4)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <Edit size={18} />
                Modifier AG
              </button>
            </div>
          </div>

          {/* Statistiques avec design premium */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "24px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
                padding: "24px",
                borderRadius: "20px",
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(59, 130, 246, 0.2)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  width: "60px",
                  height: "60px",
                  background: "rgba(59, 130, 246, 0.1)",
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  fontSize: "14px",
                  color: "#1e40af",
                  marginBottom: "8px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Fichiers
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "900",
                  color: "#1e3a8a",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                {agFiles.length}
                <FileText size={24} color="#3b82f6" />
              </div>
            </div>
            
            <div
              style={{
                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                padding: "24px",
                borderRadius: "20px",
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(245, 158, 11, 0.2)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  width: "60px",
                  height: "60px",
                  background: "rgba(245, 158, 11, 0.1)",
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  fontSize: "14px",
                  color: "#d97706",
                  marginBottom: "8px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Actionnaires
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "900",
                  color: "#92400e",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                {participants?.result?.reduce((acc, sgi) => acc + sgi.participants.length, 0) || 0}
                <Users size={24} color="#f59e0b" />
              </div>
            </div>
            
            <div
              style={{
                background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                padding: "24px",
                borderRadius: "20px",
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(16, 185, 129, 0.2)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  width: "60px",
                  height: "60px",
                  background: "rgba(16, 185, 129, 0.1)",
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  fontSize: "14px",
                  color: "#15803d",
                  marginBottom: "8px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                SGI Représentés
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "900",
                  color: "#14532d",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                {participants?.result?.length || 0}
                <Building2 size={24} color="#10b981" />
              </div>
            </div>
          </div>
        </div>

        {/* Section des actionnaires par SGI */}
        <div
          style={{
            background: "linear-gradient(145deg, #ffffff 0%, #f7fafc 100%)",
            padding: "32px",
            borderRadius: "24px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            marginBottom: "32px",
            border: "1px solid rgba(226, 232, 240, 0.8)",
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
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  padding: "12px",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Star size={24} color="white" />
              </div>
              <div>
                <h3 style={{ 
                  fontSize: "24px", 
                  color: "#1a202c", 
                  margin: 0,
                  fontWeight: "700"
                }}>
                  Actionnaires par SGI
                </h3>
                <p style={{ 
                  margin: 0, 
                  color: "#6b7280", 
                  fontSize: "14px",
                  marginTop: "4px"
                }}>
                  Gestion et export des données actionnaires
                </p>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => fetchActionnairesSgi(selectedAgDetails.entreprise?.entreprise_id, selectedAgDetails.code_ag)}
                disabled={loadingActionnaires}
                style={{
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  cursor: loadingActionnaires ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  opacity: loadingActionnaires ? 0.7 : 1,
                }}
              >
                {loadingActionnaires ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                Actualiser
              </button>
              
              <button
                onClick={() => fetchActionnairesSgi(selectedAgDetails.entreprise?.entreprise_id, selectedAgDetails.code_ag, true, 'xlsx')}
                disabled={loadingActionnaires}
                style={{
                  background: "linear-gradient(135deg, #10b981, #047857)",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  cursor: loadingActionnaires ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  opacity: loadingActionnaires ? 0.7 : 1,
                }}
              >
                <Download size={16} />
                Excel
              </button>
              
              <button
                onClick={() => fetchActionnairesSgi(selectedAgDetails.entreprise?.entreprise_id, selectedAgDetails.code_ag, true, 'csv')}
                disabled={loadingActionnaires}
                style={{
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  cursor: loadingActionnaires ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  opacity: loadingActionnaires ? 0.7 : 1,
                }}
              >
                <Download size={16} />
                CSV
              </button>
            </div>
          </div>

          {loadingActionnaires ? (
            <div style={{ textAlign: "center", padding: "60px" }}>
              <Loader2 className="animate-spin" size={40} style={{ margin: "0 auto 20px", color: "#667eea" }} />
              <p style={{ color: "#6b7280", fontSize: "16px" }}>Chargement des actionnaires...</p>
            </div>
          ) : actionnairesSgiData ? (
            <div style={{ 
              background: "rgba(102, 126, 234, 0.05)", 
              padding: "24px", 
              borderRadius: "16px",
              border: "1px solid rgba(102, 126, 234, 0.1)"
            }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "12px",
                marginBottom: "16px"
              }}>
                <Check size={20} color="#10b981" />
                <span style={{ color: "#10b981", fontWeight: "600" }}>
                  Données chargées avec succès
                </span>
              </div>
              <pre style={{ 
                background: "#f8fafc", 
                padding: "16px", 
                borderRadius: "8px",
                fontSize: "12px",
                overflow: "auto",
                maxHeight: "200px",
                color: "#4a5568"
              }}>
                {JSON.stringify(actionnairesSgiData, null, 2)}
              </pre>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
              <Archive size={48} color="#d1d5db" style={{ margin: "0 auto 15px" }} />
              Cliquez sur "Actualiser" pour charger les données des actionnaires
            </div>
          )}
        </div>

        {/* Section des fichiers */}
        <div
          style={{
            background: "linear-gradient(145deg, #ffffff 0%, #f7fafc 100%)",
            padding: "32px",
            borderRadius: "24px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            marginBottom: "32px",
            border: "1px solid rgba(226, 232, 240, 0.8)",
          }}
        >
          <h3 style={{ fontSize: "24px", color: "#1a202c", marginBottom: "24px", fontWeight: "700" }}>
            📂 Fichiers de l'AG
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {agFiles.map((file, index) => (
                <div
                  key={index}
                  style={{
                    background: "linear-gradient(145deg, #f8fafc, #e2e8f0)",
                    padding: "24px",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div
                      style={{
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        padding: "12px",
                        borderRadius: "12px",
                      }}
                    >
                      <FileText size={20} color="white" />
                    </div>
                    <div>
                      <div style={{ fontWeight: "700", color: "#1a202c", fontSize: "16px" }}>
                        {file.name}
                      </div>
                      <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
                        {file.size} • {file.type}
                      </div>
                    </div>
                  </div>
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section des SGI */}
        <div
          style={{
            background: "linear-gradient(145deg, #ffffff 0%, #f7fafc 100%)",
            padding: "32px",
            borderRadius: "24px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
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
            <h3 style={{ fontSize: "24px", color: "#1a202c", margin: 0, fontWeight: "700" }}>
              🏛️ SGI présents à l'assemblée
            </h3>
            
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => downloadParticipants('xlsx')}
                disabled={downloadingFile}
                style={{
                  background: "linear-gradient(135deg, #10b981, #047857)",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "16px",
                  cursor: downloadingFile ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  opacity: downloadingFile ? 0.7 : 1,
                  transition: "all 0.3s ease",
                }}
              >
                <Download size={16} />
                Excel
              </button>
              
              <button
                onClick={() => downloadParticipants('pdf')}
                disabled={downloadingFile}
                style={{
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "16px",
                  cursor: downloadingFile ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  opacity: downloadingFile ? 0.7 : 1,
                  transition: "all 0.3s ease",
                }}
              >
                <Download size={16} />
                PDF
              </button>
            </div>
          </div>

          {/* Barre de recherche SGI */}
          <div style={{ position: "relative", marginBottom: "32px" }}>
            <Search
              size={20}
              color="#9ca3af"
              style={{
                position: "absolute",
                left: "20px",
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
                width: "calc(100% - 40px)",
                padding: "16px 20px 16px 50px",
                borderRadius: "16px",
                border: "2px solid #e5e7eb",
                fontSize: "16px",
                outline: "none",
                transition: "all 0.3s ease",
                background: "rgba(248, 250, 252, 0.8)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.background = "white";
                e.target.style.boxShadow = "0 0 0 4px rgba(102, 126, 234, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.background = "rgba(248, 250, 252, 0.8)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {loadingParticipants ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px",
                color: "#6b7280",
              }}
            >
              <Loader2 
                size={50}
                className="animate-spin"
                style={{ margin: "0 auto 20px", color: "#667eea" }}
              />
              <h4 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600" }}>
                Chargement des SGI...
              </h4>
              <p style={{ margin: 0, fontSize: "14px" }}>
                Récupération des données des sociétés de gestion
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "24px",
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
                        borderRadius: "20px",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "all 0.4s ease",
                        position: "relative",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
                        e.currentTarget.style.boxShadow = `0 20px 40px ${colorScheme.light}`;
                        e.currentTarget.style.borderColor = colorScheme.text;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0) scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor = colorScheme.light;
                      }}
                    >
                      <div
                        style={{
                          background: colorScheme.bg,
                          padding: "24px",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            background: "rgba(255,255,255,0.25)",
                            backdropFilter: "blur(10px)",
                            width: "70px",
                            height: "70px",
                            borderRadius: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "20px",
                          }}
                        >
                          <Users size={32} color="white" />
                        </div>
                        <h4
                          style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "white",
                            marginBottom: "8px",
                            margin: 0,
                            lineHeight: "1.3",
                          }}
                        >
                          {sgi.nom_sgi}
                        </h4>
                        <div
                          style={{
                            color: "rgba(255,255,255,0.9)",
                            fontSize: "14px",
                            marginTop: "8px",
                            fontWeight: "500",
                          }}
                        >
                          Société de Gestion et d'Intermédiation
                        </div>
                      </div>
                      
                      <div style={{ padding: "24px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "20px",
                          }}
                        >
                          <div style={{ fontSize: "15px", color: "#6b7280", fontWeight: "500" }}>
                            Nombre d'actionnaires
                          </div>
                          <div
                            style={{
                              background: colorScheme.light,
                              color: colorScheme.text,
                              padding: "8px 18px",
                              borderRadius: "24px",
                              fontSize: "18px",
                              fontWeight: "800",
                            }}
                          >
                            {sgi.participants.length}
                          </div>
                        </div>
                        
                        <div
                          style={{
                            padding: "20px",
                            background: colorScheme.light,
                            borderRadius: "16px",
                            marginBottom: "20px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "13px",
                              color: colorScheme.text,
                              fontWeight: "700",
                              marginBottom: "12px",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            Aperçu des participants
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}
                          >
                            {sgi.participants.slice(0, 5).map((p, i) => (
                              <div
                                key={i}
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "50%",
                                  background: colorScheme.bg,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  border: "2px solid white",
                                  boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
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
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "50%",
                                  background: "#f3f4f6",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#6b7280",
                                  fontSize: "12px",
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
                            gap: "10px",
                            color: colorScheme.text,
                            fontSize: "15px",
                            fontWeight: "700",
                            paddingTop: "16px",
                            borderTop: `2px solid ${colorScheme.light}`,
                          }}
                        >
                          <Eye size={18} />
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
                    padding: "80px",
                    color: "#6b7280",
                    fontSize: "16px",
                  }}
                >
                  <Users
                    size={64}
                    color="#d1d5db"
                    style={{ margin: "0 auto 20px" }}
                  />
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: "600" }}>
                    Aucun SGI trouvé
                  </h4>
                  <p style={{ margin: 0 }}>
                    Aucune société de gestion ne correspond à votre recherche
                  </p>
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
    <div style={{ padding: "40px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Modal />
      
      {/* Header principal avec design premium */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "48px",
        }}
      >
        <div>
          <h1 style={{ 
            fontSize: "48px", 
            fontWeight: "900", 
            color: "#1f2937",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            marginBottom: "8px",
            letterSpacing: "-0.025em",
          }}>
            Assemblées Générales
          </h1>
          <p style={{
            fontSize: "18px",
            color: "#6b7280",
            margin: 0,
            fontWeight: "500",
          }}>
            Gérez vos AG avec élégance et efficacité
          </p>
        </div>
        
        <button
          onClick={() => setOpen(true)}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "18px 32px",
            borderRadius: "20px",
            border: "none",
            boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontSize: "16px",
            fontWeight: "700",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(102, 126, 234, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(102, 126, 234, 0.4)";
          }}
        >
          <Plus style={{ width: "24px", height: "24px" }} />
          Créer une AG
        </button>
      </div>

      <div
        style={{
          background: "linear-gradient(145deg, #ffffff 0%, #f7fafc 100%)",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          minHeight: 300,
          border: "1px solid rgba(226, 232, 240, 0.8)",
        }}
      >
        {loadingList ? (
          <div style={{ 
            display: "flex", 
            flexDirection: "column",
            alignItems: "center", 
            justifyContent: "center",
            padding: "80px",
            gap: "24px" 
          }}>
            <Loader2 
              size={60}
              className="animate-spin"
              color="#667eea"
            />
            <div style={{ textAlign: "center" }}>
              <h3 style={{ 
                color: "#374151", 
                fontSize: "20px", 
                margin: "0 0 8px 0",
                fontWeight: "600"
              }}>
                Chargement des AG...
              </h3>
              <span style={{ color: "#6b7280", fontSize: "16px" }}>
                Récupération de vos assemblées générales
              </span>
            </div>
          </div>
        ) : ags.length === 0 ? (
          <div style={{ 
            textAlign: "center",
            padding: "80px",
            color: "#6b7280" 
          }}>
            <div
              style={{
                background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <Calendar size={48} color="#3b82f6" />
            </div>
            <h3 style={{ 
              margin: "0 0 12px 0", 
              color: "#374151",
              fontSize: "24px",
              fontWeight: "700"
            }}>
              Aucune AG créée
            </h3>
            <p style={{ 
              margin: "0 0 32px 0",
              fontSize: "16px",
              lineHeight: "1.6"
            }}>
              Commencez par créer votre première Assemblée Générale<br />
              et profitez de toutes les fonctionnalités de gestion
            </p>
            <button
              onClick={() => setOpen(true)}
              style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "white",
                padding: "16px 32px",
                borderRadius: "16px",
                border: "none",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              Créer ma première AG
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
              gap: "32px",
            }}
          >
            {ags.map((ag, index) => (
              <div
                key={ag.entreprise?.entreprise_id || index}
                onClick={() => handleAgClick(ag)}
                style={{
                  background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
                  borderRadius: "24px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.4s ease",
                  border: "1px solid rgba(226, 232, 240, 0.6)",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.15)";
                  e.currentTarget.style.borderColor = "rgba(102, 126, 234, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
                  e.currentTarget.style.borderColor = "rgba(226, 232, 240, 0.6)";
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    padding: "32px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Effets de fond décoratifs */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-50px",
                      right: "-50px",
                      width: "150px",
                      height: "150px",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "50%",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-30px",
                      left: "-30px",
                      width: "100px",
                      height: "100px",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "50%",
                    }}
                  />
                  
                  <div
                    style={{
                      position: "absolute",
                      top: "24px",
                      right: "24px",
                      background: "rgba(255,255,255,0.25)",
                      backdropFilter: "blur(10px)",
                      padding: "12px 20px",
                      borderRadius: "24px",
                      fontSize: "14px",
                      color: "white",
                      fontWeight: "700",
                    }}
                  >
                    {new Date(ag.date_ag).toLocaleDateString("fr-FR")}
                  </div>
                  
                  <div
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(15px)",
                      width: "80px",
                      height: "80px",
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "24px",
                    }}
                  >
                    <Calendar size={40} color="white" />
                  </div>
                  
                  <h3
                    style={{
                      fontSize: "26px",
                      fontWeight: "800",
                      color: "white",
                      marginBottom: "16px",
                      margin: 0,
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {ag.code_ag}
                  </h3>
                  
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    <Building2 size={20} />
                    {ag.entreprise?.nom_entreprise || "Entreprise non définie"}
                  </div>
                </div>
                
                <div style={{ padding: "32px" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "24px",
                      marginBottom: "32px",
                    }}
                  >
                    <div
                      style={{
                        background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
                        padding: "24px",
                        borderRadius: "16px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "-10px",
                          right: "-10px",
                          width: "40px",
                          height: "40px",
                          background: "rgba(59, 130, 246, 0.2)",
                          borderRadius: "50%",
                        }}
                      />
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#1e40af",
                          marginBottom: "8px",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Fichiers
                      </div>
                      <div
                        style={{
                          fontSize: "28px",
                          fontWeight: "900",
                          color: "#1e3a8a",
                        }}
                      >
                        {ag.fichiers_count || "N/A"}
                      </div>
                    </div>
                    
                    <div
                      style={{
                        background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                        padding: "24px",
                        borderRadius: "16px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "-10px",
                          right: "-10px",
                          width: "40px",
                          height: "40px",
                          background: "rgba(16, 185, 129, 0.2)",
                          borderRadius: "50%",
                        }}
                      />
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#15803d",
                          marginBottom: "8px",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Participants
                      </div>
                      <div
                        style={{
                          fontSize: "28px",
                          fontWeight: "900",
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
                      gap: "10px",
                      color: "#667eea",
                      fontSize: "16px",
                      fontWeight: "700",
                      paddingTop: "20px",
                      borderTop: "2px solid rgba(102, 126, 234, 0.1)",
                    }}
                  >
                    <Eye size={20} />
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
