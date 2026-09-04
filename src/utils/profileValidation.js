export const checkProfileCompletion = (profile) => {
  if (!profile) return { isComplete: false, missing: {} };

  // 1. Profile Picture
  const hasPhoto = !!profile.photo;

  // 2. All Personal Info Fields
  const pInfo = profile.personal_info || {};
  const hasPersonalInfo = !!(
    pInfo.full_name &&
    pInfo.father_name &&
    pInfo.mother_name &&
    pInfo.date_of_birth &&
    pInfo.gender &&
    pInfo.religion &&
    pInfo.marital_status &&
    pInfo.nationality &&
    pInfo.nid &&
    pInfo.phone_number &&
    pInfo.blood_group
  );

  // 3. Helper for Address completeness
  const isAddressComplete = (addr) => {
    if (!addr) return false;
    return !!(
      addr.country &&
      addr.division &&
      addr.district &&
      addr.thana_upzila &&
      addr.post_office &&
      addr.post_code &&
      addr.house_road_village
    );
  };

  // Check BOTH Addresses
  const hasPresentAddress = isAddressComplete(profile.present_address);
  const hasPermanentAddress = isAddressComplete(profile.permanent_address);

  // 4. Education (SSC and HSC)
  const educations = profile.educations || [];
  const hasSSC = educations.some(
    (edu) => edu.degree_type?.toLowerCase() === "ssc",
  );
  const hasHSC = educations.some(
    (edu) => edu.degree_type?.toLowerCase() === "hsc",
  );
  const hasEducation = hasSSC && hasHSC;

  // 5. References (Minimum 2)
  const references = profile.references || [];
  const hasReferences = references.length >= 2;

  const missing = {
    photo: !hasPhoto,
    personalInfo: !hasPersonalInfo,
    presentAddress: !hasPresentAddress,
    permanentAddress: !hasPermanentAddress,
    education: !hasEducation,
    references: !hasReferences,
  };

  const isComplete = !Object.values(missing).includes(true);
  return { isComplete, missing };
};
