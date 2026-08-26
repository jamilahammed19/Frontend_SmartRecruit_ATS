import { useState, useEffect } from "react";
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
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form States
  const [personalInfo, setPersonalInfo] = useState({});
  const [presentAddress, setPresentAddress] = useState({});
  const [permanentAddress, setPermanentAddress] = useState({});

  // Image Upload State
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Modal State Management
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

      <div>
        <h2 className="text-3xl font-bold text-slate-900">Comprehensive Candidate Profile</h2>
        <p className="text-slate-500 mt-1">Update your information across all modules.</p>
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