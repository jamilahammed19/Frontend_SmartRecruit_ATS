import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import * as candidateService from "../../services/candidateService";
import { checkProfileCompletion } from "../../utils/profileValidation";

import ProfileHeader from "./sections/ProfileHeader";
import PersonalInfoSection from "./sections/PersonalInfoSection";
import AddressSection from "./sections/AddressSection";
import EducationSection from "./sections/EducationSection";
import EmploymentSection from "./sections/EmploymentSection";
import SkillSection from "./sections/SkillSection";
import TrainingSection from "./sections/TrainingSection";
import ExtracurricularSection from "./sections/ExtracurricularSection";
import ReferenceSection from "./sections/ReferenceSection";
import PortfolioSection from "./sections/PortfolioSection";
import ProfileModal from "./sections/ProfileModal";

export default function ProfileEdit() {
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => { fetchProfileData(); }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    try {
      await candidateService.uploadProfilePicture(file);
      fetchProfileData();
    } catch (error) { alert("Failed to upload photo."); } 
    finally { setIsUploadingPhoto(false); }
  };

  const cleanEmptyFields = (obj) => {
    const cleaned = { ...obj };
    delete cleaned.id; delete cleaned.created_at; delete cleaned.updated_at; delete cleaned.profile;
    const numberOrDateFields = ["passing_year", "years_of_experience", "start_date", "end_date", "date_of_birth", "height", "weight"];
    Object.keys(cleaned).forEach((key) => {
      if (cleaned[key] === "") {
        if (numberOrDateFields.includes(key)) cleaned[key] = null;
        else cleaned[key] = "";
      }
    });
    return cleaned;
  };

  const handleUpdate1to1 = async (e, type, data) => {
    e.preventDefault();
    const cleanData = cleanEmptyFields(data);
    try {
      if (type === "personal") await candidateService.updatePersonalInfo(cleanData);
      if (type === "present_address") await candidateService.updatePresentAddress(cleanData);
      if (type === "permanent_address") await candidateService.updatePermanentAddress(cleanData);
      alert("Updated successfully!");
      fetchProfileData();
    } catch (error) { alert("Failed to update."); }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const isEditing = !!modalData.id;
    const cleanData = cleanEmptyFields(modalData);

    try {
      const methodMap = {
        education: { add: candidateService.addEducation, edit: candidateService.updateEducation },
        employment: { add: candidateService.addEmployment, edit: candidateService.updateEmployment },
        skill: { add: candidateService.addSkill, edit: candidateService.updateSkill },
        training: { add: candidateService.addTraining, edit: candidateService.updateTraining },
        extracurricular: { add: candidateService.addExtracurricularActivity, edit: candidateService.updateExtracurricularActivity },
        reference: { add: candidateService.addReference, edit: candidateService.updateReference },
        portfolio: { add: candidateService.addPortfolio, edit: candidateService.updatePortfolio },
      };
      await (isEditing ? methodMap[activeModal].edit(modalData.id, cleanData) : methodMap[activeModal].add(cleanData));
      setActiveModal(null);
      setModalData({});
      fetchProfileData();
    } catch (error) {
      if (error.response) alert(`Django Validation Error:\n\n${JSON.stringify(error.response.data, null, 2)}`);
      else alert(`Failed to save: ${error.message}`);
    } finally { setIsSaving(false); }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      const deleteMap = {
        education: candidateService.deleteEducation, employment: candidateService.deleteEmployment, skill: candidateService.deleteSkill,
        training: candidateService.deleteTraining, extracurricular: candidateService.deleteExtracurricularActivity, reference: candidateService.deleteReference,
        portfolio: candidateService.deletePortfolio,
      };
      await deleteMap[type](id);
      fetchProfileData();
    } catch (error) { alert("Failed to delete entry."); }
  };

  const openModal = (type, existingData = null) => { setModalData(existingData || {}); setActiveModal(type); };

  if (loading) return <div className="p-12 text-center">Loading full profile...</div>;

  const { isComplete, missing } = checkProfileCompletion(profile);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 font-sans space-y-8">
      
      {!isComplete && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm mb-8">
            <h3 className="text-red-800 font-bold text-lg">Action Required</h3>
            <p className="text-red-700 text-sm mt-1">
                You cannot apply for jobs yet. Please fill out ALL fields in the sections marked with a red star (<span className="text-red-600 font-bold text-lg">*</span>) to complete your profile.
            </p>
        </div>
      )}

      <div className="relative">
        {missing.photo && <div className="text-red-600 font-bold text-sm mb-2 ml-2 flex items-center gap-1"><span className="text-xl">*</span> Upload Profile Picture required</div>}
        <ProfileHeader profile={profile} personalInfo={personalInfo} isUploadingPhoto={isUploadingPhoto} onPhotoUpload={handlePhotoUpload} />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Comprehensive Candidate Profile</h2>
          <p className="text-slate-500 mt-1">Update your information across all modules.</p>
        </div>
        <Link to="/candidate/ai-scanner" className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg shadow-md flex items-center gap-2">
          <span className="text-lg">✨</span> AI Documents Scanner
        </Link>
      </div>

      <div className="relative">
        {missing.personalInfo && <div className="text-red-600 font-bold text-sm mb-2 ml-2 flex items-center gap-1"><span className="text-xl">*</span> ALL Personal Details required</div>}
        <PersonalInfoSection data={personalInfo} setData={setPersonalInfo} onSave={(e) => handleUpdate1to1(e, "personal", personalInfo)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          {missing.presentAddress && <div className="text-red-600 font-bold text-sm mb-2 ml-2 flex items-center gap-1"><span className="text-xl">*</span> ALL Present Address fields required</div>}
          <AddressSection title="Present Address" data={presentAddress} setData={setPresentAddress} onSave={(e) => handleUpdate1to1(e, "present_address", presentAddress)} />
        </div>
        <div className="relative">
          {missing.permanentAddress && <div className="text-red-600 font-bold text-sm mb-2 ml-2 flex items-center gap-1"><span className="text-xl">*</span> ALL Permanent Address fields required</div>}
          <AddressSection title="Permanent Address" data={permanentAddress} setData={setPermanentAddress} onSave={(e) => handleUpdate1to1(e, "permanent_address", permanentAddress)} />
        </div>
      </div>

      <div className="relative">
        {missing.education && <div className="text-red-600 font-bold text-sm mb-2 ml-2 flex items-center gap-1"><span className="text-xl">*</span> Minimum SSC and HSC Education required</div>}
        <EducationSection items={profile?.educations} onAdd={() => openModal("education")} onEdit={(item) => openModal("education", item)} onDelete={handleDelete} />
      </div>

      <EmploymentSection items={profile?.employments} onAdd={() => openModal("employment")} onEdit={(item) => openModal("employment", item)} onDelete={handleDelete} />
      <SkillSection items={profile?.skills} onAdd={() => openModal("skill")} onEdit={(item) => openModal("skill", item)} onDelete={handleDelete} />
      <TrainingSection items={profile?.trainings} onAdd={() => openModal("training")} onEdit={(item) => openModal("training", item)} onDelete={handleDelete} />
      <ExtracurricularSection items={profile?.extracurricular_activities} onAdd={() => openModal("extracurricular")} onEdit={(item) => openModal("extracurricular", item)} onDelete={handleDelete} />
      <PortfolioSection items={profile?.portfolios_publications_projects} onAdd={() => openModal("portfolio")} onEdit={(item) => openModal("portfolio", item)} onDelete={handleDelete} />
      
      <div className="relative">
        {missing.references && <div className="text-red-600 font-bold text-sm mb-2 ml-2 flex items-center gap-1"><span className="text-xl">*</span> At least TWO References required</div>}
        <ReferenceSection items={profile?.references} onAdd={() => openModal("reference")} onEdit={(item) => openModal("reference", item)} onDelete={handleDelete} />
      </div>

      <ProfileModal activeModal={activeModal} modalData={modalData} setModalData={setModalData} isSaving={isSaving} onSubmit={handleModalSubmit} onClose={() => setActiveModal(null)} />
    </div>
  );
}