import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // <-- Added useLocation and Link
import * as candidateService from "../../services/candidateService";

// Import all our newly separated sections
import ProfileHeader from "./sections/ProfileHeader";
import PersonalInfoSection from "./sections/PersonalInfoSection";
import AddressSection from "./sections/AddressSection";
import EducationSection from "./sections/EducationSection";
import EmploymentSection from "./sections/EmploymentSection";
import SkillSection from "./sections/SkillSection";
import ProfileModal from "./sections/ProfileModal";

export default function ProfileEdit() {
  const location = useLocation(); // <-- Needed to catch AI data
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form States
  const [personalInfo, setPersonalInfo] = useState({});
  const [presentAddress, setPresentAddress] = useState({});
  const [permanentAddress, setPermanentAddress] = useState({});

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfileData = async () => {
    try {
      const data = await candidateService.getProfile();
      setProfile(data);
      if (data.personal_info) setPersonalInfo(data.personal_info);
      if (data.present_address) setPresentAddress(data.present_address);
      if (data.permanent_address) setPermanentAddress(data.permanent_address);
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // --- NEW: Catch AI Data from Scanner Page ---
  useEffect(() => {
    if (location.state?.aiData) {
      const aiData = location.state.aiData;
      
      // Merge AI data into current form states so the user can review before saving!
      if (aiData.personal_info) setPersonalInfo(prev => ({ ...prev, ...aiData.personal_info }));
      if (aiData.present_address) setPresentAddress(prev => ({ ...prev, ...aiData.present_address }));
      if (aiData.permanent_address) setPermanentAddress(prev => ({ ...prev, ...aiData.permanent_address }));
      
      // If AI returns arrays for educations/employments, you can store them here too 
      // depending on how you want the user to accept them.
    }
  }, [location.state]);


  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    try {
      await candidateService.uploadProfilePicture(file);
      fetchProfileData();
    } catch (error) {
      alert("Failed to upload profile picture.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleUpdate1to1 = async (e, type, data) => {
    e.preventDefault();
    try {
      if (type === "personal") await candidateService.updatePersonalInfo(data);
      if (type === "present_address") await candidateService.updatePresentAddress(data);
      if (type === "permanent_address") await candidateService.updatePermanentAddress(data);
      alert("Information updated successfully!");
      fetchProfileData();
    } catch (error) {
      alert(`Failed to update information.`);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (activeModal === "education") await candidateService.addEducation(modalData);
      if (activeModal === "employment") await candidateService.addEmployment(modalData);
      if (activeModal === "skill") await candidateService.addSkill(modalData);
      
      setActiveModal(null);
      setModalData({});
      fetchProfileData();
    } catch (error) {
      alert("Failed to save entry.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      if (type === "education") await candidateService.deleteEducation(id);
      if (type === "employment") await candidateService.deleteEmployment(id);
      if (type === "skill") await candidateService.deleteSkill(id);
      fetchProfileData();
    } catch (error) {
      alert("Failed to delete entry.");
    }
  };

  const openModal = (type) => {
    setModalData({});
    setActiveModal(type);
  };

  if (loading) return <div className="p-12 text-center">Loading full profile...</div>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 font-sans space-y-8">
      
      <ProfileHeader 
        profile={profile} 
        personalInfo={personalInfo} 
        isUploadingPhoto={isUploadingPhoto} 
        onPhotoUpload={handlePhotoUpload} 
      />

      {/* --- UPDATED HEADER WITH AI SCANNER BUTTON --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Comprehensive Candidate Profile</h2>
          <p className="text-slate-500 mt-1">Update your information across all modules.</p>
        </div>
        
        <Link 
          to="/candidate/ai-scanner" 
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform transition-all hover:-translate-y-0.5 flex items-center gap-2"
        >
          <span className="text-lg">✨</span> AI Documents Scanner
        </Link>
      </div>

      <PersonalInfoSection 
        data={personalInfo} 
        setData={setPersonalInfo} 
        onSave={(e) => handleUpdate1to1(e, "personal", personalInfo)} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AddressSection 
          title="Present Address" 
          data={presentAddress} 
          setData={setPresentAddress} 
          onSave={(e) => handleUpdate1to1(e, "present_address", presentAddress)} 
        />
        <AddressSection 
          title="Permanent Address" 
          data={permanentAddress} 
          setData={setPermanentAddress} 
          onSave={(e) => handleUpdate1to1(e, "permanent_address", permanentAddress)} 
        />
      </div>

      <EducationSection items={profile?.educations} onAdd={() => openModal("education")} onDelete={handleDelete} />
      <EmploymentSection items={profile?.employments} onAdd={() => openModal("employment")} onDelete={handleDelete} />
      <SkillSection items={profile?.skills} onAdd={() => openModal("skill")} onDelete={handleDelete} />

      <ProfileModal 
        activeModal={activeModal} 
        modalData={modalData} 
        setModalData={setModalData} 
        isSaving={isSaving} 
        onSubmit={handleModalSubmit} 
        onClose={() => setActiveModal(null)} 
      />

    </div>
  );
}