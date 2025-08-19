import React, { useState, useRef, useEffect } from "react"; 
import { Search, Upload, X, Plus, UserPlus, Users } from "lucide-react"; 
import { Dialog } from "@mui/material"; 
import { api } from "../../services/api"; 
import getInitial from "../../utils/getInitial"; 
 
const ParticipantsManager = ({ open, onClose, code }) => { 
  const fileInputRef = useRef(null); 
 
  // États du composant
  const [availableParticipants, setAvailableParticipants] = useState([]); 
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [searchSelectedTerm, setSearchSelectedTerm] = useState(""); 
  const [showAddSection, setShowAddSection] = useState(false);
 
  const fetchUsersSelected = async () => { 
    try { 
      const response = await api.get(`get/participant_list/${code}`); 
      setSelectedParticipants(response.data.participants || []); 
    } catch (error) { 
      console.error("Erreur lors du chargement des participants sélectionnés:", error); 
      setSelectedParticipants([]); 
    } 
  }; 
 
  const fetchUsers = async () => { 
    try { 
      const response = await api.get("get/liste_collaborateur"); 
      setAvailableParticipants(response.data.data || []); 
    } catch (error) { 
      console.error("Erreur lors du chargement des collaborateurs:", error); 
      setAvailableParticipants([]); 
    } 
  };
 
  const uploadFile = async (event) => { 
    const file = event.target.files[0]; 
    if (file) { 
      const formData = new FormData(); 
      formData.append("file", file); 
 
      try { 
        const response = await api.post( 
          "formation/participant-from-file", 
          formData, 
          { 
            headers: { 
              "Content-Type": "multipart/form-data", 
            }, 
          } 
        ); 
        console.log("Fichier envoyé avec succès:", response.data); 
        // Recharger les participants après l'upload
        fetchUsersSelected();
      } catch (error) { 
        console.error("Erreur lors de l'envoi du fichier:", error); 
      } 
    } 
  };
 
  useEffect(() => { 
    if (open && code) { 
      fetchUsersSelected(); 
      fetchUsers(); 
    } 
  }, [open, code]);
 
  // Filtrer les participants disponibles selon la recherche (sécurisé)
  const filteredParticipants = (availableParticipants || []).filter((participant) => {
    const name = (participant?.name || "").toLowerCase();
    const email = (participant?.email || "").toLowerCase();
    const q = (searchTerm || "").toLowerCase();
    return name.includes(q) || email.includes(q);
  });
 
  // Filtrer les participants sélectionnés selon la recherche (sécurisé)
  const filteredSelectedParticipants = (selectedParticipants || []).filter((participant) => {
    const name = (participant?.name || "").toLowerCase();
    const email = (participant?.email || "").toLowerCase();
    const q = (searchSelectedTerm || "").toLowerCase();
    return name.includes(q) || email.includes(q);
  });
 
  // Ajouter un participant à la liste sélectionnée
  const addParticipant = (participant) => {
    setSelectedParticipants((prev) => {
      if (prev.find((p) => p.id === participant.id)) return prev;
      return [...prev, { ...participant }];
    });
    setAvailableParticipants((prev) => prev.filter((p) => p.id !== participant.id));
  }; 
 
  // Supprimer un participant de la liste sélectionnée 
  const removeParticipant = (participantId) => { 
    const participantToRemove = selectedParticipants.find( 
      (p) => p.id === participantId 
    ); 
    if (participantToRemove) { 
      setSelectedParticipants( 
        selectedParticipants.filter((p) => p.id !== participantId) 
      ); 
      // Vérifier si le participant n'est pas déjà dans la liste des disponibles
      const isAlreadyAvailable = availableParticipants.some(
        (p) => p.id === participantId
      );
      if (!isAlreadyAvailable) {
        setAvailableParticipants([ 
          ...availableParticipants, 
          participantToRemove, 
        ]); 
      } 
    } 
  };
 
  const handleClose = () => {
    setShowAddSection(false); 
    setSearchTerm(""); 
    setSearchSelectedTerm(""); 
    onClose(); 
  };
 
  return ( 
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <div> 
        <div 
          style={{ 
            position: "fixed", 
            top: "0", 
            left: "0", 
            right: "0", 
            bottom: "0", 
            backgroundColor: "rgba(0,0,0,0.6)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            zIndex: 1000, 
            padding: "20px", 
          }} 
        > 
          <div 
            style={{ 
              backgroundColor: "white", 
              borderRadius: "12px", 
              width: "90%", 
              maxWidth: "800px", 
              maxHeight: "90vh", 
              overflow: "hidden", 
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)", 
              fontFamily: "Arial, sans-serif", 
            }} 
          > 
            {/* Header du modal principal */} 
            <div 
              style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                padding: "24px 24px 20px 24px", 
                borderBottom: "1px solid #eee", 
              }} 
            > 
              <h2 
                style={{ 
                  margin: "0", 
                  fontSize: "24px", 
                  fontWeight: "600", 
                  color: "#333", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "10px", 
                }} 
              > 
                <Users size={24} color="#007bff" /> 
                Participants ({selectedParticipants?.length}) 
              </h2> 
 
              <div 
                style={{ display: "flex", gap: "12px", alignItems: "center" }} 
              > 
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px", 
                    padding: "10px 16px", 
                    backgroundColor: "#28a745", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "6px", 
                    fontSize: "14px", 
                    fontWeight: "500", 
                    cursor: "pointer", 
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)", 
                  }} 
                > 
                  <Upload size={16} /> 
                  Charger participants 
                </button> 
 
                <button 
                  onClick={() => {
                    setShowAddSection((v) => !v);
                  }}
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px", 
                    padding: "10px 16px", 
                    backgroundColor: showAddSection ? "#6c757d" : "#007bff", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "6px", 
                    fontSize: "14px", 
                    fontWeight: "500", 
                    cursor: "pointer", 
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)", 
                    transition: "all 0.2s ease", 
                  }} 
                > 
                  <Plus size={16} /> 
                  {showAddSection ? "Annuler" : "Ajouter"} 
                </button> 
 
                <button 
                  onClick={handleClose}
                  style={{ 
                    background: "none", 
                    border: "none", 
                    fontSize: "28px", 
                    cursor: "pointer", 
                    color: "#666", 
                    padding: "4px", 
                    borderRadius: "4px", 
                  }} 
                > 
                  × 
                </button> 
              </div> 
            </div> 
 
            {/* Input file caché */} 
            <input 
              ref={fileInputRef} 
              type="file" 
              accept=".csv,.xlsx,.xls" 
              onChange={uploadFile} 
              style={{ display: "none" }} 
            /> 
 
            {/* Contenu principal du modal */} 
            <div 
              style={{ 
                display: "flex", 
                height: "calc(90vh - 120px)", 
                gap: "20px", 
              }} 
            > 
              {/* Section gauche - Participants sélectionnés */} 
              <div 
                style={{ 
                  flex: showAddSection ? "1" : "1", 
                  padding: "20px 0 20px 24px", 
 
                  transition: "all 0.3s ease", 
                }} 
              > 
                <h3 
                  style={{ 
                    margin: "0 0 16px 0", 
                    fontSize: "18px", 
                    fontWeight: "600", 
                    color: "#333", 
                  }} 
                > 
                  Participants sélectionnés 
                </h3> 
 
                {/* Barre de recherche pour les participants sélectionnés */} 
                {selectedParticipants?.length > 0 && ( 
                  <div 
                    style={{ 
                      position: "relative", 
                      marginBottom: "16px", 
                      marginRight: "20px", 
                    }} 
                  > 
                    <Search 
                      size={16} 
                      style={{ 
                        position: "absolute", 
                        left: "10px", 
                        top: "50%", 
                        transform: "translateY(-50%)", 
                        color: "#666", 
                      }} 
                    /> 
                    <input 
                      type="text" 
                      placeholder="Rechercher dans les sélectionnés..." 
                      value={searchSelectedTerm} 
                      onChange={(e) => setSearchSelectedTerm(e.target.value)} 
                      style={{ 
                        width: "100%", 
                        padding: "8px 8px 8px 32px", 
                        border: "1px solid #ddd", 
                        borderRadius: "6px", 
                        fontSize: "12px", 
                        outline: "none", 
                        boxSizing: "border-box", 
                        backgroundColor: "white", 
                      }} 
                    /> 
                  </div> 
                )} 
 
                {filteredSelectedParticipants?.length === 0 && 
                selectedParticipants?.length > 0 ? ( 
                  <div 
                    style={{ 
                      textAlign: "center", 
                      color: "#666", 
                      padding: "20px", 
                      fontSize: "14px", 
                      backgroundColor: "#f8f9fa", 
                      borderRadius: "8px", 
                      marginRight: "20px", 
                    }} 
                  > 
                    <Search 
                      size={32} 
                      color="#ccc" 
                      style={{ marginBottom: "12px" }} 
                    /> 
                    <div>Aucun participant trouvé</div> 
                  </div> 
                ) : selectedParticipants?.length === 0 ? ( 
                  <div 
                    style={{ 
                      textAlign: "center", 
                      color: "#666", 
                      padding: "40px 20px", 
                      fontSize: "14px", 
                      backgroundColor: "#f8f9fa", 
                      borderRadius: "8px", 
                    }} 
                  > 
                    <Users 
                      size={48} 
                      color="#ccc" 
                      style={{ marginBottom: "16px" }} 
                    /> 
                    <div>Aucun participant sélectionné</div> 
                  </div> 
                ) : ( 
                  <div 
                    style={{ 
                      backgroundColor: "#f8f9fa", 
                      borderRadius: "8px", 
                      padding: "16px", 
                      marginRight: "20px", 
                      overflowY: "auto", 
                      maxHeight: "400px", 
                    }} 
                  > 
                    {filteredSelectedParticipants?.map((participant, index) => ( 
                      <div 
                        key={participant.id} 
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "space-between", 
                          padding: "12px 0", 
                          borderBottom: 
                            index < filteredSelectedParticipants?.length - 1 
                              ? "1px solid #dee2e6" 
                              : "none", 
                        }} 
                      > 
                        <div 
                          style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "12px", 
                          }} 
                        > 
                          <div 
                            style={{ 
                              width: "40px", 
                              height: "40px", 
                              borderRadius: "50%", 
                              backgroundColor: participant.color, 
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "center", 
                              color: "white", 
                              fontWeight: "600", 
                              fontSize: "14px", 
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)", 
                            }} 
                          > 
                            {getInitial(participant.prenom, participant.nom)} 
                          </div> 
                          <div> 
                            <div 
                              style={{ 
                                fontWeight: "600", 
                                color: "#333", 
                                fontSize: "14px", 
                                marginBottom: "2px", 
                              }} 
                            > 
                              {participant.name} 
                            </div> 
                            <div 
                              style={{ 
                                fontSize: "12px", 
                                color: "#666", 
                              }} 
                            > 
                              {participant.email} 
                              {participant.matricule && 
                                ` • Matricule: ${participant.matricule}`} 
                            </div> 
                          </div> 
                        </div> 
 
                        <button 
                          onClick={() => removeParticipant(participant.id)} 
                          style={{ 
                            background: "none", 
                            border: "none", 
                            color: "#dc3545", 
                            cursor: "pointer", 
                            padding: "8px", 
                            borderRadius: "50%", 
                            transition: "background-color 0.2s", 
                          }} 
                          onMouseEnter={(e) => 
                            (e.target.style.backgroundColor = "#f8d7da") 
                          } 
                          onMouseLeave={(e) => 
                            (e.target.style.backgroundColor = "transparent") 
                          } 
                        > 
                          <X size={18} /> 
                        </button> 
                      </div> 
                    ))} 
                  </div> 
                )} 
              </div> 
 
              {/* Section droite - Ajouter des participants (conditionnelle) */} 
              {showAddSection && ( 
                <div 
                  style={{ 
                    flex: "1", 
                    borderLeft: "1px solid #eee", 
                    padding: "20px 24px 20px 20px", 
                    overflowY: "auto", 
                    backgroundColor: "#fafbfc", 
                    animation: "slideInRight 0.3s ease", 
                  }} 
                > 
                  <h3 
                    style={{ 
                      margin: "0 0 16px 0", 
                      fontSize: "18px", 
                      fontWeight: "600", 
                      color: "#333", 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "8px", 
                    }} 
                  > 
                    <UserPlus size={20} color="#007bff" /> 
                    Ajouter des participants 
                  </h3> 
 
                  {/* Barre de recherche */} 
                  <div 
                    style={{ 
                      position: "relative", 
                      marginBottom: "20px", 
                    }} 
                  > 
                    <Search 
                      size={18} 
                      style={{ 
                        position: "absolute", 
                        left: "12px", 
                        top: "50%", 
                        transform: "translateY(-50%)", 
                        color: "#666", 
                      }} 
                    /> 
                    <input 
                      type="text" 
                      placeholder="Rechercher par nom, email..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      style={{ 
                        width: "100%", 
                        padding: "10px 10px 10px 40px", 
                        border: "1px solid #ddd", 
                        borderRadius: "6px", 
                        fontSize: "14px", 
                        outline: "none", 
                        boxSizing: "border-box", 
                        backgroundColor: "white", 
                      }} 
                    /> 
                  </div> 
 
                  {/* Liste des participants disponibles */} 
                  <div 
                    style={{ 
                      backgroundColor: "white", 
                      borderRadius: "8px", 
                      border: "1px solid #eee", 
                      maxHeight: "400px", 
                      overflowY: "auto", 
                    }} 
                  > 
                    {filteredParticipants?.length === 0 ? ( 
                      <div 
                        style={{ 
                          textAlign: "center", 
                          color: "#666", 
                          padding: "30px 20px", 
                          fontSize: "14px", 
                        }} 
                      > 
                        {searchTerm ? ( 
                          <> 
                            <Search 
                              size={32} 
                              color="#ccc" 
                              style={{ marginBottom: "12px" }} 
                            /> 
                            <div>Aucun participant trouvé</div> 
                          </> 
                        ) : ( 
                          <> 
                            <Users 
                              size={32} 
                              color="#ccc" 
                              style={{ marginBottom: "12px" }} 
                            /> 
                            <div>Tous les participants ont été ajoutés</div> 
                          </> 
                        )} 
                      </div> 
                    ) : ( 
                      filteredParticipants?.map((participant, index) => ( 
                        <div 
                          key={participant.id} 
                          onClick={() => addParticipant(participant)} 
                          style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "12px", 
                            padding: "12px 16px", 
                            cursor: "pointer", 
                            transition: "all 0.2s ease", 
                            backgroundColor: "white", 
                            borderBottom: 
                              index < filteredParticipants.length - 1 
                                ? "1px solid #f0f0f0" 
                                : "none", 
                          }} 
                          onMouseEnter={(e) => { 
                            e.currentTarget.style.backgroundColor = "#f8f9fa"; 
                            e.currentTarget.style.transform = "translateX(4px)"; 
                          }} 
                          onMouseLeave={(e) => { 
                            e.currentTarget.style.backgroundColor = "white"; 
                            e.currentTarget.style.transform = "translateX(0)"; 
                          }} 
                        > 
                          <div 
                            style={{ 
                              width: "36px", 
                              height: "36px", 
                              borderRadius: "50%", 
                              backgroundColor: participant.color, 
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "center", 
                              color: "white", 
                              fontWeight: "600", 
                              fontSize: "12px", 
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)", 
                            }} 
                          > 
                            {getInitial(participant.prenom, participant.nom)} 
                          </div> 
                          <div style={{ flex: 1 }}> 
                            <div 
                              style={{ 
                                fontWeight: "600", 
                                color: "#333", 
                                fontSize: "14px", 
                                marginBottom: "2px", 
                              }} 
                            > 
                              {participant.name} 
                            </div> 
                            <div 
                              style={{ 
                                fontSize: "12px", 
                                color: "#666", 
                              }} 
                            > 
                              {participant.email} • {participant.role} 
                            </div> 
                          </div> 
                          <Plus size={16} color="#007bff" /> 
                        </div> 
                      )) 
                    )} 
                  </div> 
                </div> 
              )} 
            </div> 
          </div> 
        </div> 
      </div> 
    </Dialog> 
  ); 
}; 
 
export default ParticipantsManager;