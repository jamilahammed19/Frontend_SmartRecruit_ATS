import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as scannerService from "../../services/scannerService";
import * as candidateService from "../../services/candidateService";

// --- Strict Django Choices ---
const GENDERS = [{value: 'male', label: 'Male'}, {value: 'female', label: 'Female'}, {value: 'other', label: 'Other'}];
const RELIGIONS = [{value: 'islam', label: 'Islam'}, {value: 'hinduism', label: 'Hinduism'}, {value: 'christianity', label: 'Christianity'}, {value: 'buddhism', label: 'Buddhism'}, {value: 'judaism', label: 'Judaism'}, {value: 'other', label: 'Other'}];
const MARITAL_STATUSES = [{value: 'single', label: 'Single'}, {value: 'married', label: 'Married'}, {value: 'divorced', label: 'Divorced'}, {value: 'widowed', label: 'Widowed'}];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const DEGREE_TYPES = [{value: 'ssc', label: 'SSC / Equivalent'}, {value: 'hsc', label: 'HSC / Equivalent'}, {value: 'diploma', label: 'Diploma'}, {value: 'bachelors', label: 'Bachelors'}, {value: 'masters', label: 'Masters'}, {value: 'phd', label: 'PhD'}, {value: 'other', label: 'Other'}];
const MAJOR_GROUP_TYPES = [{value: 'science', label: 'Science'}, {value: 'arts', label: 'Arts / Humanities'}, {value: 'commerce', label: 'Commerce / Business Studies'}, {value: 'not_applicable', label: 'Not Applicable'}];
const SCALES = [{value: '4.00', label: 'Out of 4.00'}, {value: '5.00', label: 'Out of 5.00'}, {value: '10.00', label: 'Out of 10.00'}, {value: '100', label: 'Out of 100 (Percentage)'}, {value: 'other', label: 'Other'}];
const EMPLOYMENT_TYPES = [{value: 'full_time', label: 'Full-time'}, {value: 'part_time', label: 'Part-time'}, {value: 'contract', label: 'Contract'}, {value: 'internship', label: 'Internship'}, {value: 'freelance', label: 'Freelance'}];
const ITEM_TYPES = [{value: 'project', label: 'Project'}, {value: 'publication', label: 'Publication / Research'}, {value: 'portfolio', label: 'Portfolio Website'}, {value: 'award', label: 'Award / Achievement'}, {value: 'other', label: 'Other'}];
const DIVISIONS = ["Barishal", "Chittagong", "Dhaka", "Khulna", "Mymensingh", "Rajshahi", "Rangpur", "Sylhet"];
const DISTRICTS = ["Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogura", "Brahmanbaria", "Chandpur", "Chapainawabganj", "Chittagong", "Chuadanga", "Comilla", "Coxs Bazar", "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore", "Jhalokati", "Jhenaidah", "Joypurhat", "Khagrachhari", "Khulna", "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet", "Tangail", "Thakurgaon"];

// Helper to check if an object actually has real data inside it (ignoring empty strings and nulls)
const hasMeaningfulData = (obj, ignoreKeys = []) => {
  if (!obj || typeof obj !== 'object') return false;
  return Object.entries(obj).some(([key, val]) => {
    if (ignoreKeys.includes(key)) return false;
    if (val === null || val === undefined) return false;
    if (typeof val === 'string' && val.trim() === '') return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  });
};

export default function AiScanner() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const docs = await scannerService.getDocuments();
        setDocuments(Array.isArray(docs) ? docs : docs.results || []);
        const profile = await candidateService.getProfile();
        setCurrentProfile(profile);
      } catch (error) {
        console.error("Failed to load initial data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "png", "jpg", "jpeg", "docx"].includes(ext)) {
      return alert("Please upload a PDF, DOCX, PNG, or JPG file.");
    }

    setIsUploading(true);
    try {
      const newDoc = await scannerService.uploadDocument(file);
      setDocuments((prev) => [newDoc, ...prev]);
    } catch (error) {
      alert("Failed to upload document.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await scannerService.deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (error) {
      alert("Failed to delete document.");
    }
  };

  const checkDuplicates = (parsedArray, existingArray, matchKeys) => {
    if (!parsedArray) return [];
    return parsedArray.map(item => {
      let isDuplicate = false;
      if (existingArray && existingArray.length > 0) {
        isDuplicate = existingArray.some(existing => {
          return matchKeys.every(key => {
            const val1 = item[key] ? String(item[key]).toLowerCase().trim() : "";
            const val2 = existing[key] ? String(existing[key]).toLowerCase().trim() : "";
            return val1 && val2 && val1 === val2;
          });
        });
      }
      return { ...item, _selected: !isDuplicate, _isDuplicate: isDuplicate, _id: Math.random().toString() };
    });
  };

  const handleScanDocuments = async () => {
    if (documents.length === 0) return alert("Please upload a document first.");
    setIsProcessing(true);
    try {
      const aiData = await scannerService.processDocumentsWithAi();
      const processedData = { ...aiData };

      // Auto-select ONLY if they contain meaningful data
      processedData._select_personal_info = hasMeaningfulData(aiData.personal_info);
      processedData._select_present_address = hasMeaningfulData(aiData.present_address, ['address_type']);
      processedData._select_permanent_address = hasMeaningfulData(aiData.permanent_address, ['address_type']);

      processedData.educations = checkDuplicates(aiData.educations, currentProfile?.educations, ['degree_title']);
      processedData.employments = checkDuplicates(aiData.employments, currentProfile?.employments, ['designation', 'organization_name']);
      processedData.skills = checkDuplicates(aiData.skills, currentProfile?.skills, ['skill_name']);
      processedData.trainings = checkDuplicates(aiData.trainings, currentProfile?.trainings, ['training_title']);
      processedData.extracurricular_activities = checkDuplicates(aiData.extracurricular_activities, currentProfile?.extracurricular_activities, ['activity_name']);
      processedData.references = checkDuplicates(aiData.references, currentProfile?.references, ['name']);
      processedData.portfolios_publications_projects = checkDuplicates(aiData.portfolios_publications_projects, currentProfile?.portfolios_publications_projects, ['title']);

      // Filter out empty entries from arrays so they don't show up as blank boxes
      processedData.educations = processedData.educations.filter(e => hasMeaningfulData(e, ['_id', '_selected', '_isDuplicate']));
      processedData.employments = processedData.employments.filter(e => hasMeaningfulData(e, ['_id', '_selected', '_isDuplicate', 'is_current']));
      processedData.skills = processedData.skills.filter(s => hasMeaningfulData(s, ['_id', '_selected', '_isDuplicate']));
      processedData.trainings = processedData.trainings.filter(t => hasMeaningfulData(t, ['_id', '_selected', '_isDuplicate']));
      processedData.extracurricular_activities = processedData.extracurricular_activities.filter(a => hasMeaningfulData(a, ['_id', '_selected', '_isDuplicate']));
      processedData.references = processedData.references.filter(r => hasMeaningfulData(r, ['_id', '_selected', '_isDuplicate']));
      processedData.portfolios_publications_projects = processedData.portfolios_publications_projects.filter(p => hasMeaningfulData(p, ['_id', '_selected', '_isDuplicate']));

      setParsedData(processedData); 
    } catch (error) {
      alert(`AI Processing failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveToProfile = async () => {
    setIsSaving(true);
    try {
      
      // STRICT DATA CLEANER & TYPE CONVERTER FOR DJANGO
      const cleanObj = (obj) => {
        const cleaned = { ...obj };
        
        // Remove UI flags
        delete cleaned._selected; delete cleaned._isDuplicate; delete cleaned._id;
        delete cleaned.id; delete cleaned.created_at; delete cleaned.updated_at; delete cleaned.profile;

        // Type Conversion Rules
        const integerFields = ["passing_year", "post_code"];
        const decimalFields = ["height", "weight", "years_of_experience"];
        const dateFields = ["start_date", "end_date", "date_of_birth"];

        Object.keys(cleaned).forEach((key) => {
          let val = cleaned[key];
          
          if (val === "" || val === null || val === undefined) {
             if (integerFields.includes(key) || decimalFields.includes(key) || dateFields.includes(key)) {
                cleaned[key] = null;
             } else {
                cleaned[key] = "";
             }
          } else {
             // Force Parse Strings into actual Numbers to prevent Django 400 Bad Requests
             if (integerFields.includes(key)) cleaned[key] = parseInt(val, 10) || null;
             if (decimalFields.includes(key)) cleaned[key] = parseFloat(val) || null;
          }
        });
        return cleaned;
      };

      // 1. Save Core Profiles
      if (parsedData._select_personal_info && hasMeaningfulData(parsedData.personal_info)) {
        await candidateService.updatePersonalInfo(cleanObj(parsedData.personal_info));
      }
      if (parsedData._select_present_address && hasMeaningfulData(parsedData.present_address, ['address_type'])) {
        await candidateService.updatePresentAddress(cleanObj({ ...parsedData.present_address, address_type: "present" }));
      }
      if (parsedData._select_permanent_address && hasMeaningfulData(parsedData.permanent_address, ['address_type'])) {
        await candidateService.updatePermanentAddress(cleanObj({ ...parsedData.permanent_address, address_type: "permanent" }));
      }

      // 2. Save Arrays
      const arraySaves = [
        { data: parsedData.educations, serviceMethod: candidateService.addEducation },
        { data: parsedData.trainings, serviceMethod: candidateService.addTraining },
        { data: parsedData.employments, serviceMethod: candidateService.addEmployment },
        { data: parsedData.skills, serviceMethod: candidateService.addSkill },
        { data: parsedData.extracurricular_activities, serviceMethod: candidateService.addExtracurricularActivity },
        { data: parsedData.references, serviceMethod: candidateService.addReference },
        { data: parsedData.portfolios_publications_projects, serviceMethod: candidateService.addPortfolio },
      ];

      for (const item of arraySaves) {
        const selectedItems = item.data?.filter(record => record._selected) || [];
        for (let record of selectedItems) {
          const cleanedRecord = cleanObj(record);
          if (Object.keys(cleanedRecord).length > 0) await item.serviceMethod(cleanedRecord);
        }
      }

      alert("Profile successfully updated with AI data!");
      navigate("/profile-edit");
    } catch (error) {
      console.error("Full Error Details:", error);
      if (error.response?.data) alert(`Django Validation Error:\n\n${JSON.stringify(error.response.data, null, 2)}`);
      else alert(`Failed to save: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const updateArrayItem = (arrayName, id, field, value) => {
    setParsedData(prev => ({
      ...prev, [arrayName]: prev[arrayName].map(item => item._id === id ? { ...item, [field]: value } : item)
    }));
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading your documents...</div>;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 font-sans">
      {!parsedData && (
        <>
          <Link to="/profile-edit" className="text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 inline-flex items-center">← Back to Profile</Link>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3"><span className="text-4xl">✨</span> AI Document Scanner</h1>
            <p className="text-slate-500 mt-2">Upload your CV. Our AI will extract all profile sections automatically and map them to your strict data models.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center mb-8">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.png,.jpg,.jpeg,.docx" />
            <button onClick={() => fileInputRef.current.click()} disabled={isUploading || isProcessing} className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 disabled:opacity-50">
              {isUploading ? "Uploading..." : "+ Add Document"}
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50"><h3 className="font-bold text-slate-800">Uploaded Documents ({documents.length})</h3></div>
            <div className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 px-6 flex justify-between items-center hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <div><p className="font-bold text-sm text-slate-900">{doc.file_name}</p><p className="text-xs text-slate-500">{new Date(doc.created_at).toLocaleDateString()}</p></div>
                  </div>
                  <button onClick={() => handleDelete(doc.id)} disabled={isProcessing} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg text-sm">Delete</button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleScanDocuments} disabled={isProcessing || documents.length === 0} className="px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-xl shadow-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-3">
              {isProcessing ? "Scanning CV... (Takes ~15s)" : "Scan Documents 🚀"}
            </button>
          </div>
        </>
      )}

      {parsedData && (
        <div className="space-y-6">
          <div className="mb-6 flex justify-between items-end">
            <div>
                <button onClick={() => setParsedData(null)} className="text-sm font-medium text-slate-500 hover:text-indigo-600 mb-4 inline-flex items-center">← Discard & Go Back</button>
                <h1 className="text-3xl font-bold text-slate-900">Review & Edit AI Data</h1>
                <p className="text-slate-500 mt-2">Validate choice dropdowns to prevent errors. Only sections with data are shown.</p>
            </div>
          </div>

          {/* --- SECTION 1: PERSONAL INFO --- */}
          {hasMeaningfulData(parsedData.personal_info) && (
            <div className={`bg-white p-6 rounded-2xl shadow-sm border ${parsedData._select_personal_info ? 'border-indigo-300' : 'border-slate-200 opacity-60'}`}>
              <div className="flex items-center gap-3 mb-4 border-b pb-3">
                  <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" checked={parsedData._select_personal_info} onChange={(e) => setParsedData({...parsedData, _select_personal_info: e.target.checked})} />
                  <h3 className="text-lg font-bold text-slate-800">1. Update Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Text Fields */}
                {["full_name", "father_name", "mother_name", "phone_number", "phone_number_alt", "email_alt", "nationality", "nid", "passport_number"].map((field) => (
                  <div key={field}>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">{field.replace(/_/g, " ")}</label>
                    <input type="text" disabled={!parsedData._select_personal_info} className="w-full mt-1 p-2 text-sm border rounded-lg focus:ring-indigo-500 disabled:bg-slate-50"
                      value={parsedData.personal_info?.[field] || ""} onChange={(e) => setParsedData({ ...parsedData, personal_info: { ...parsedData.personal_info, [field]: e.target.value } })}
                    />
                  </div>
                ))}

                {/* Number / Date Fields */}
                <div><label className="block text-[10px] font-bold text-slate-500 uppercase">Date of Birth</label><input type="date" disabled={!parsedData._select_personal_info} className="w-full mt-1 p-2 text-sm border rounded-lg" value={parsedData.personal_info?.date_of_birth || ""} onChange={(e) => setParsedData({ ...parsedData, personal_info: { ...parsedData.personal_info, date_of_birth: e.target.value } })} /></div>
                <div><label className="block text-[10px] font-bold text-slate-500 uppercase">Height (ft)</label><input type="number" step="0.1" disabled={!parsedData._select_personal_info} className="w-full mt-1 p-2 text-sm border rounded-lg" value={parsedData.personal_info?.height || ""} onChange={(e) => setParsedData({ ...parsedData, personal_info: { ...parsedData.personal_info, height: e.target.value } })} /></div>
                <div><label className="block text-[10px] font-bold text-slate-500 uppercase">Weight (kg)</label><input type="number" step="0.1" disabled={!parsedData._select_personal_info} className="w-full mt-1 p-2 text-sm border rounded-lg" value={parsedData.personal_info?.weight || ""} onChange={(e) => setParsedData({ ...parsedData, personal_info: { ...parsedData.personal_info, weight: e.target.value } })} /></div>
                
                {/* Choice Dropdowns */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Gender</label>
                  <select disabled={!parsedData._select_personal_info} className="w-full mt-1 p-2 text-sm border rounded-lg bg-white" value={parsedData.personal_info?.gender || ""} onChange={(e) => setParsedData({ ...parsedData, personal_info: { ...parsedData.personal_info, gender: e.target.value } })}>
                    <option value="">Select...</option>{GENDERS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Religion</label>
                  <select disabled={!parsedData._select_personal_info} className="w-full mt-1 p-2 text-sm border rounded-lg bg-white" value={parsedData.personal_info?.religion || ""} onChange={(e) => setParsedData({ ...parsedData, personal_info: { ...parsedData.personal_info, religion: e.target.value } })}>
                    <option value="">Select...</option>{RELIGIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Marital Status</label>
                  <select disabled={!parsedData._select_personal_info} className="w-full mt-1 p-2 text-sm border rounded-lg bg-white" value={parsedData.personal_info?.marital_status || ""} onChange={(e) => setParsedData({ ...parsedData, personal_info: { ...parsedData.personal_info, marital_status: e.target.value } })}>
                    <option value="">Select...</option>{MARITAL_STATUSES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Blood Group</label>
                  <select disabled={!parsedData._select_personal_info} className="w-full mt-1 p-2 text-sm border rounded-lg bg-white" value={parsedData.personal_info?.blood_group || ""} onChange={(e) => setParsedData({ ...parsedData, personal_info: { ...parsedData.personal_info, blood_group: e.target.value } })}>
                    <option value="">Select...</option>{BLOOD_GROUPS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* --- SECTION 2: ADDRESSES --- */}
          {(() => {
            const showPresent = hasMeaningfulData(parsedData.present_address, ['address_type']);
            const showPermanent = hasMeaningfulData(parsedData.permanent_address, ['address_type']);
            const activeTypes = [];
            if (showPresent) activeTypes.push('present');
            if (showPermanent) activeTypes.push('permanent');

            if (activeTypes.length === 0) return null;

            return (
              <div className={`grid grid-cols-1 ${activeTypes.length === 2 ? 'md:grid-cols-2' : ''} gap-6`}>
                {activeTypes.map((type) => {
                  const objKey = `${type}_address`;
                  const selectKey = `_select_${objKey}`;
                  return (
                    <div key={type} className={`bg-white p-6 rounded-2xl shadow-sm border ${parsedData[selectKey] ? 'border-indigo-300' : 'border-slate-200 opacity-60'}`}>
                      <div className="flex items-center gap-3 mb-4 border-b pb-3">
                          <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" checked={parsedData[selectKey]} onChange={(e) => setParsedData({...parsedData, [selectKey]: e.target.checked})} />
                          <h3 className="text-lg font-bold text-slate-800 capitalize">{type} Address</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Text Inputs */}
                        {["country", "thana_upzila", "post_office", "house_road_village"].map((field) => (
                            <div key={field} className={field === 'house_road_village' ? 'col-span-2' : ''}>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase">{field.replace(/_/g, " ")}</label>
                              <input type="text" disabled={!parsedData[selectKey]} className="w-full mt-1 p-2 text-sm border rounded-lg disabled:bg-slate-50" value={parsedData[objKey]?.[field] || ""} onChange={(e) => setParsedData({...parsedData, [objKey]: {...parsedData[objKey], [field]: e.target.value}})} />
                            </div>
                        ))}
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Post Code</label>
                            <input type="number" disabled={!parsedData[selectKey]} className="w-full mt-1 p-2 text-sm border rounded-lg" value={parsedData[objKey]?.post_code || ""} onChange={(e) => setParsedData({...parsedData, [objKey]: {...parsedData[objKey], post_code: e.target.value}})} />
                        </div>
                        {/* Dropdowns */}
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Division</label>
                          <select disabled={!parsedData[selectKey]} className="w-full mt-1 p-2 text-sm border rounded-lg bg-white" value={parsedData[objKey]?.division || ""} onChange={(e) => setParsedData({...parsedData, [objKey]: {...parsedData[objKey], division: e.target.value}})}>
                            <option value="">Select...</option>{DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">District</label>
                          <select disabled={!parsedData[selectKey]} className="w-full mt-1 p-2 text-sm border rounded-lg bg-white" value={parsedData[objKey]?.district || ""} onChange={(e) => setParsedData({...parsedData, [objKey]: {...parsedData[objKey], district: e.target.value}})}>
                            <option value="">Select...</option>{DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* --- ARRAYS: EDUCATIONS --- */}
          {parsedData.educations?.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">🎓 Educations ({parsedData.educations.length})</h3>
              <div className="space-y-4">
                  {parsedData.educations.map(edu => (
                      <div key={edu._id} className={`p-4 rounded-xl border relative ${edu._selected ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200 bg-slate-50'}`}>
                          <div className="absolute top-4 right-4 flex items-center gap-3">
                              {edu._isDuplicate && <span className="text-[10px] uppercase font-bold bg-red-100 text-red-700 px-2 py-1 rounded">Duplicate</span>}
                              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" checked={edu._selected} onChange={(e) => updateArrayItem('educations', edu._id, '_selected', e.target.checked)} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2 pr-12">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500">Degree Level</label>
                                  <select className="w-full mt-1 p-2 text-sm border rounded bg-white" value={edu.degree_type || ""} onChange={(e) => updateArrayItem('educations', edu._id, 'degree_type', e.target.value)} disabled={!edu._selected}>
                                      <option value="">Select Level...</option>{DEGREE_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                  </select>
                              </div>
                              <div className="md:col-span-3"><label className="block text-xs font-bold text-slate-500">Degree Title</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={edu.degree_title || ""} onChange={(e) => updateArrayItem('educations', edu._id, 'degree_title', e.target.value)} disabled={!edu._selected}/></div>
                              <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-500">Institution</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={edu.institution || ""} onChange={(e) => updateArrayItem('educations', edu._id, 'institution', e.target.value)} disabled={!edu._selected}/></div>
                              <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-500">Board / University</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={edu.board_university || ""} onChange={(e) => updateArrayItem('educations', edu._id, 'board_university', e.target.value)} disabled={!edu._selected}/></div>
                              
                              <div>
                                  <label className="block text-xs font-bold text-slate-500">Group Type</label>
                                  <select className="w-full mt-1 p-2 text-sm border rounded bg-white" value={edu.major_group_type || ""} onChange={(e) => updateArrayItem('educations', edu._id, 'major_group_type', e.target.value)} disabled={!edu._selected}>
                                      <option value="">Select Stream...</option>{MAJOR_GROUP_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                  </select>
                              </div>
                              <div><label className="block text-xs font-bold text-slate-500">Major / Specific Group</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={edu.major_group || ""} onChange={(e) => updateArrayItem('educations', edu._id, 'major_group', e.target.value)} disabled={!edu._selected}/></div>
                              <div><label className="block text-xs font-bold text-slate-500">Department</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={edu.dept || ""} onChange={(e) => updateArrayItem('educations', edu._id, 'dept', e.target.value)} disabled={!edu._selected}/></div>
                              
                              <div><label className="block text-xs font-bold text-slate-500">Passing Year</label><input type="number" className="w-full mt-1 p-2 text-sm border rounded" value={edu.passing_year || ""} onChange={(e) => updateArrayItem('educations', edu._id, 'passing_year', e.target.value)} disabled={!edu._selected}/></div>
                              <div><label className="block text-xs font-bold text-slate-500">Duration</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={edu.duration || ""} onChange={(e) => updateArrayItem('educations', edu._id, 'duration', e.target.value)} disabled={!edu._selected}/></div>
                              <div><label className="block text-xs font-bold text-slate-500">Result (GPA/Class)</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={edu.result || ""} onChange={(e) => updateArrayItem('educations', edu._id, 'result', e.target.value)} disabled={!edu._selected}/></div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500">Scale</label>
                                  <select className="w-full mt-1 p-2 text-sm border rounded bg-white" value={edu.scale || ""} onChange={(e) => updateArrayItem('educations', edu._id, 'scale', e.target.value)} disabled={!edu._selected}>
                                      <option value="">Select Scale...</option>{SCALES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                  </select>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
            </div>
          )}

          {/* --- ARRAYS: EMPLOYMENTS --- */}
          {parsedData.employments?.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">💼 Experience ({parsedData.employments.length})</h3>
              <div className="space-y-4">
                  {parsedData.employments.map(emp => (
                      <div key={emp._id} className={`p-4 rounded-xl border relative ${emp._selected ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200 bg-slate-50'}`}>
                          <div className="absolute top-4 right-4 flex items-center gap-3">
                              {emp._isDuplicate && <span className="text-[10px] uppercase font-bold bg-red-100 text-red-700 px-2 py-1 rounded">Duplicate</span>}
                              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" checked={emp._selected} onChange={(e) => updateArrayItem('employments', emp._id, '_selected', e.target.checked)} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 pr-12">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500">Job Type</label>
                                  <select className="w-full mt-1 p-2 text-sm border rounded bg-white" value={emp.employment_type || "full_time"} onChange={(e) => updateArrayItem('employments', emp._id, 'employment_type', e.target.value)} disabled={!emp._selected}>
                                      {EMPLOYMENT_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                  </select>
                              </div>
                              <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-500">Designation</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={emp.designation || ""} onChange={(e) => updateArrayItem('employments', emp._id, 'designation', e.target.value)} disabled={!emp._selected}/></div>
                              <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-500">Organization Name</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={emp.organization_name || ""} onChange={(e) => updateArrayItem('employments', emp._id, 'organization_name', e.target.value)} disabled={!emp._selected}/></div>
                              <div><label className="block text-xs font-bold text-slate-500">Department</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={emp.department || ""} onChange={(e) => updateArrayItem('employments', emp._id, 'department', e.target.value)} disabled={!emp._selected}/></div>
                              <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-500">Organization Location</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={emp.organization_location || ""} onChange={(e) => updateArrayItem('employments', emp._id, 'organization_location', e.target.value)} disabled={!emp._selected}/></div>
                              <div><label className="block text-xs font-bold text-slate-500">Industry / Business</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={emp.organization_business || ""} onChange={(e) => updateArrayItem('employments', emp._id, 'organization_business', e.target.value)} disabled={!emp._selected}/></div>
                              
                              <div><label className="block text-xs font-bold text-slate-500">Start Date</label><input type="date" className="w-full mt-1 p-2 text-sm border rounded bg-white" value={emp.start_date || ""} onChange={(e) => updateArrayItem('employments', emp._id, 'start_date', e.target.value)} disabled={!emp._selected}/></div>
                              <div><label className="block text-xs font-bold text-slate-500">End Date</label><input type="date" className="w-full mt-1 p-2 text-sm border rounded bg-white disabled:bg-slate-100" value={emp.end_date || ""} onChange={(e) => updateArrayItem('employments', emp._id, 'end_date', e.target.value)} disabled={!emp._selected || emp.is_current}/></div>
                              <div className="flex items-center mt-6">
                                  <input type="checkbox" id={`is_curr_${emp._id}`} className="w-4 h-4 text-indigo-600 rounded" checked={emp.is_current || false} onChange={(e) => { updateArrayItem('employments', emp._id, 'is_current', e.target.checked); if(e.target.checked) updateArrayItem('employments', emp._id, 'end_date', ""); }} disabled={!emp._selected} />
                                  <label htmlFor={`is_curr_${emp._id}`} className="ml-2 text-sm text-slate-700">I currently work here</label>
                              </div>

                              <div className="md:col-span-3"><label className="block text-xs font-bold text-slate-500">Responsibilities</label><textarea className="w-full mt-1 p-2 text-sm border rounded" rows="3" value={emp.responsibilities || ""} onChange={(e) => updateArrayItem('employments', emp._id, 'responsibilities', e.target.value)} disabled={!emp._selected}/></div>
                          </div>
                      </div>
                  ))}
              </div>
            </div>
          )}

          {/* --- ARRAYS: TRAININGS --- */}
          {parsedData.trainings?.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">📜 Trainings & Certifications ({parsedData.trainings.length})</h3>
              <div className="space-y-4">
                  {parsedData.trainings.map(trn => (
                      <div key={trn._id} className={`p-4 rounded-xl border relative ${trn._selected ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200 bg-slate-50'}`}>
                          <div className="absolute top-4 right-4 flex items-center gap-3">
                              {trn._isDuplicate && <span className="text-[10px] uppercase font-bold bg-red-100 text-red-700 px-2 py-1 rounded">Duplicate</span>}
                              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" checked={trn._selected} onChange={(e) => updateArrayItem('trainings', trn._id, '_selected', e.target.checked)} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2 pr-12">
                              <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-500">Training Title</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={trn.training_title || ""} onChange={(e) => updateArrayItem('trainings', trn._id, 'training_title', e.target.value)} disabled={!trn._selected}/></div>
                              <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-500">Institute</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={trn.institute || ""} onChange={(e) => updateArrayItem('trainings', trn._id, 'institute', e.target.value)} disabled={!trn._selected}/></div>
                              <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-500">Location</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={trn.location || ""} onChange={(e) => updateArrayItem('trainings', trn._id, 'location', e.target.value)} disabled={!trn._selected}/></div>
                              <div><label className="block text-xs font-bold text-slate-500">Start Date</label><input type="date" className="w-full mt-1 p-2 text-sm border rounded bg-white" value={trn.start_date || ""} onChange={(e) => updateArrayItem('trainings', trn._id, 'start_date', e.target.value)} disabled={!trn._selected}/></div>
                              <div><label className="block text-xs font-bold text-slate-500">End Date</label><input type="date" className="w-full mt-1 p-2 text-sm border rounded bg-white" value={trn.end_date || ""} onChange={(e) => updateArrayItem('trainings', trn._id, 'end_date', e.target.value)} disabled={!trn._selected}/></div>
                          </div>
                      </div>
                  ))}
              </div>
            </div>
          )}

          {/* --- ARRAYS: EXTRACURRICULARS --- */}
          {parsedData.extracurricular_activities?.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">🏃 Extracurricular Activities ({parsedData.extracurricular_activities.length})</h3>
              <div className="space-y-4">
                  {parsedData.extracurricular_activities.map(ext => (
                      <div key={ext._id} className={`p-4 rounded-xl border relative ${ext._selected ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200 bg-slate-50'}`}>
                          <div className="absolute top-4 right-4 flex items-center gap-3">
                              {ext._isDuplicate && <span className="text-[10px] uppercase font-bold bg-red-100 text-red-700 px-2 py-1 rounded">Duplicate</span>}
                              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" checked={ext._selected} onChange={(e) => updateArrayItem('extracurricular_activities', ext._id, '_selected', e.target.checked)} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pr-12">
                              <div><label className="block text-xs font-bold text-slate-500">Activity Name</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={ext.activity_name || ""} onChange={(e) => updateArrayItem('extracurricular_activities', ext._id, 'activity_name', e.target.value)} disabled={!ext._selected}/></div>
                              <div><label className="block text-xs font-bold text-slate-500">Position Held</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={ext.position_held || ""} onChange={(e) => updateArrayItem('extracurricular_activities', ext._id, 'position_held', e.target.value)} disabled={!ext._selected}/></div>
                              <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-500">Description</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={ext.description || ""} onChange={(e) => updateArrayItem('extracurricular_activities', ext._id, 'description', e.target.value)} disabled={!ext._selected}/></div>
                          </div>
                      </div>
                  ))}
              </div>
            </div>
          )}

          {/* --- ARRAYS: PORTFOLIOS & PROJECTS --- */}
          {parsedData.portfolios_publications_projects?.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">🚀 Portfolios & Projects ({parsedData.portfolios_publications_projects.length})</h3>
              <div className="space-y-4">
                  {parsedData.portfolios_publications_projects.map(proj => (
                      <div key={proj._id} className={`p-4 rounded-xl border relative ${proj._selected ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200 bg-slate-50'}`}>
                          <div className="absolute top-4 right-4 flex items-center gap-3">
                              {proj._isDuplicate && <span className="text-[10px] uppercase font-bold bg-red-100 text-red-700 px-2 py-1 rounded">Duplicate</span>}
                              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" checked={proj._selected} onChange={(e) => updateArrayItem('portfolios_publications_projects', proj._id, '_selected', e.target.checked)} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pr-12">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500">Item Type</label>
                                  <select className="w-full mt-1 p-2 text-sm border rounded bg-white" value={proj.item_type || "project"} onChange={(e) => updateArrayItem('portfolios_publications_projects', proj._id, 'item_type', e.target.value)} disabled={!proj._selected}>
                                      {ITEM_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                  </select>
                              </div>
                              <div><label className="block text-xs font-bold text-slate-500">Project Title</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={proj.title || ""} onChange={(e) => updateArrayItem('portfolios_publications_projects', proj._id, 'title', e.target.value)} disabled={!proj._selected}/></div>
                              <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-500">Link/URL</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={proj.link || ""} onChange={(e) => updateArrayItem('portfolios_publications_projects', proj._id, 'link', e.target.value)} disabled={!proj._selected}/></div>
                              <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-500">Description</label><textarea className="w-full mt-1 p-2 text-sm border rounded" rows="2" value={proj.description || ""} onChange={(e) => updateArrayItem('portfolios_publications_projects', proj._id, 'description', e.target.value)} disabled={!proj._selected}/></div>
                          </div>
                      </div>
                  ))}
              </div>
            </div>
          )}

          {/* --- ARRAYS: REFERENCES --- */}
          {parsedData.references?.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">🤝 References ({parsedData.references.length})</h3>
              <div className="space-y-4">
                  {parsedData.references.map(ref => (
                      <div key={ref._id} className={`p-4 rounded-xl border relative ${ref._selected ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200 bg-slate-50'}`}>
                          <div className="absolute top-4 right-4 flex items-center gap-3">
                              {ref._isDuplicate && <span className="text-[10px] uppercase font-bold bg-red-100 text-red-700 px-2 py-1 rounded">Duplicate</span>}
                              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" checked={ref._selected} onChange={(e) => updateArrayItem('references', ref._id, '_selected', e.target.checked)} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 pr-12">
                              <div><label className="block text-xs font-bold text-slate-500">Name</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={ref.name || ""} onChange={(e) => updateArrayItem('references', ref._id, 'name', e.target.value)} disabled={!ref._selected}/></div>
                              <div><label className="block text-xs font-bold text-slate-500">Organization</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={ref.organization || ""} onChange={(e) => updateArrayItem('references', ref._id, 'organization', e.target.value)} disabled={!ref._selected}/></div>
                              <div><label className="block text-xs font-bold text-slate-500">Designation</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={ref.designation || ""} onChange={(e) => updateArrayItem('references', ref._id, 'designation', e.target.value)} disabled={!ref._selected}/></div>
                              <div><label className="block text-xs font-bold text-slate-500">Relationship</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={ref.relationship || ""} onChange={(e) => updateArrayItem('references', ref._id, 'relationship', e.target.value)} disabled={!ref._selected}/></div>
                              <div><label className="block text-xs font-bold text-slate-500">Mobile</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={ref.mobile_number || ""} onChange={(e) => updateArrayItem('references', ref._id, 'mobile_number', e.target.value)} disabled={!ref._selected}/></div>
                              <div><label className="block text-xs font-bold text-slate-500">Office Phone</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={ref.phone_office || ""} onChange={(e) => updateArrayItem('references', ref._id, 'phone_office', e.target.value)} disabled={!ref._selected}/></div>
                              <div className="md:col-span-3"><label className="block text-xs font-bold text-slate-500">Email</label><input type="text" className="w-full mt-1 p-2 text-sm border rounded" value={ref.email || ""} onChange={(e) => updateArrayItem('references', ref._id, 'email', e.target.value)} disabled={!ref._selected}/></div>
                              <div className="md:col-span-3"><label className="block text-xs font-bold text-slate-500">Address</label><textarea className="w-full mt-1 p-2 text-sm border rounded" rows="2" value={ref.address || ""} onChange={(e) => updateArrayItem('references', ref._id, 'address', e.target.value)} disabled={!ref._selected}/></div>
                          </div>
                      </div>
                  ))}
              </div>
            </div>
          )}

          {/* --- ARRAYS: SKILLS --- */}
          {parsedData.skills?.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">⚡ Skills ({parsedData.skills.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {parsedData.skills.map(skill => (
                      <div key={skill._id} className={`p-4 rounded-xl border flex flex-col gap-2 ${skill._selected ? 'border-indigo-300 bg-indigo-50/50' : 'border-slate-200 bg-slate-50'}`}>
                          <div className="flex justify-between items-start">
                              <div className="flex-1 mr-2">
                                  <label className="block text-xs font-bold text-slate-500">Skill</label>
                                  <input type="text" className="w-full text-sm font-bold bg-transparent border-b border-transparent focus:border-indigo-300 focus:outline-none disabled:text-slate-500" value={skill.skill_name || ""} onChange={(e) => updateArrayItem('skills', skill._id, 'skill_name', e.target.value)} disabled={!skill._selected}/>
                                  {skill._isDuplicate && <p className="text-[10px] text-red-500 font-bold uppercase mt-1">Duplicate</p>}
                              </div>
                              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" checked={skill._selected} onChange={(e) => updateArrayItem('skills', skill._id, '_selected', e.target.checked)} />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500">Years Exp</label>
                              <input type="number" step="0.1" className="w-full p-1 text-sm border rounded bg-white" value={skill.years_of_experience || ""} onChange={(e) => updateArrayItem('skills', skill._id, 'years_of_experience', e.target.value)} disabled={!skill._selected}/>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500">Details</label>
                              <textarea className="w-full p-1 text-sm border rounded bg-white" rows="2" value={skill.description || ""} onChange={(e) => updateArrayItem('skills', skill._id, 'description', e.target.value)} disabled={!skill._selected}/>
                          </div>
                      </div>
                  ))}
              </div>
            </div>
          )}

          {/* --- FINAL SAVE BUTTON --- */}
          <div className="flex justify-end pt-4 pb-10">
            <button onClick={handleSaveToProfile} disabled={isSaving} className="px-8 py-4 bg-emerald-600 text-white font-bold text-lg rounded-xl shadow-md hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center gap-2">
              {isSaving ? "Saving Checked Items..." : "Confirm & Save Profile ✓"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}