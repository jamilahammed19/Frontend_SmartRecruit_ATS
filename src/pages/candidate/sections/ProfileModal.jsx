const MAJOR_GROUP_TYPES = [
  { value: "science", label: "Science" },
  { value: "arts", label: "Arts / Humanities" },
  { value: "commerce", label: "Commerce / Business Studies" },
  { value: "not_applicable", label: "Not Applicable" },
];

const SCALES = [
  { value: "4.00", label: "Out of 4.00" },
  { value: "5.00", label: "Out of 5.00" },
  { value: "10.00", label: "Out of 10.00" },
  { value: "100", label: "Out of 100 (Percentage)" },
  { value: "other", label: "Other" },
];

const EMPLOYMENT_TYPES = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
];

const ITEM_TYPES = [
  { value: "project", label: "Project" },
  { value: "publication", label: "Publication / Research" },
  { value: "portfolio", label: "Portfolio Website" },
  { value: "award", label: "Award / Achievement" },
  { value: "other", label: "Other" },
];

export default function ProfileModal({
  activeModal,
  modalData,
  setModalData,
  isSaving,
  onSubmit,
  onClose,
}) {
  if (!activeModal) return null;

  const isEditing = !!modalData.id;
  const titlePrefix = isEditing ? "Edit" : "Add";

  const isSchoolLevel = ["ssc", "hsc"].includes(
    modalData.degree_type?.toLowerCase(),
  );

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-900 capitalize">
            {titlePrefix} {activeModal.replace("_", " ")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 border"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="p-6 space-y-4 overflow-y-auto flex-grow"
        >
          {activeModal === "education" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Degree Level (Required)
                </label>
                <select
                  required
                  className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                  value={modalData.degree_type || ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, degree_type: e.target.value })
                  }
                >
                  <option value="">Select Level...</option>
                  <option value="ssc">SSC / Equivalent</option>
                  <option value="hsc">HSC / Equivalent</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelors">Bachelor's</option>
                  <option value="masters">Master's</option>
                  <option value="phd">PhD</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {modalData.degree_type && (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Degree Title (e.g., BSc in CSE)
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 border rounded-lg focus:ring-blue-500"
                      value={modalData.degree_title || ""}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          degree_title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Institution
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 border rounded-lg focus:ring-blue-500"
                      value={modalData.institution || ""}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          institution: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      {isSchoolLevel ? "Education Board" : "University Board"}
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg focus:ring-blue-500"
                      value={modalData.board_university || ""}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          board_university: e.target.value,
                        })
                      }
                    />
                  </div>

                  {isSchoolLevel ? (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          Group Type
                        </label>
                        <select
                          className="w-full p-2 border rounded-lg focus:ring-blue-500 bg-white"
                          value={modalData.major_group_type || ""}
                          onChange={(e) =>
                            setModalData({
                              ...modalData,
                              major_group_type: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Stream...</option>
                          {MAJOR_GROUP_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          Specific Group
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-lg focus:ring-blue-500"
                          placeholder="e.g., General Science"
                          value={modalData.major_group || ""}
                          onChange={(e) =>
                            setModalData({
                              ...modalData,
                              major_group: e.target.value,
                            })
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          Department
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-lg focus:ring-blue-500"
                          placeholder="e.g., CSE, EEE"
                          value={modalData.dept || ""}
                          onChange={(e) =>
                            setModalData({ ...modalData, dept: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          Specific Major
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-lg focus:ring-blue-500"
                          placeholder="e.g., Software Engineering"
                          value={modalData.major_group || ""}
                          onChange={(e) =>
                            setModalData({
                              ...modalData,
                              major_group: e.target.value,
                            })
                          }
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Passing Year
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg focus:ring-blue-500"
                      value={modalData.passing_year || ""}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          passing_year: e.target.value,
                        })
                      }
                    />
                  </div>

                  {!isSchoolLevel ? (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-lg focus:ring-blue-500"
                        placeholder="e.g. 4 Years"
                        value={modalData.duration || ""}
                        onChange={(e) =>
                          setModalData({
                            ...modalData,
                            duration: e.target.value,
                          })
                        }
                      />
                    </div>
                  ) : (
                    <div className="hidden md:block"></div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Result (GPA/CGPA/Class)
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg focus:ring-blue-500"
                      value={modalData.result || ""}
                      onChange={(e) =>
                        setModalData({ ...modalData, result: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Scale (Out of)
                    </label>
                    <select
                      className="w-full p-2 border rounded-lg focus:ring-blue-500 bg-white"
                      value={modalData.scale || ""}
                      onChange={(e) =>
                        setModalData({ ...modalData, scale: e.target.value })
                      }
                    >
                      <option value="">Select Scale...</option>
                      {SCALES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          )}

          {activeModal === "employment" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Job Type
                </label>
                <select
                  className="w-full p-2 border rounded-lg bg-white focus:ring-blue-500"
                  value={modalData.employment_type || "full_time"}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      employment_type: e.target.value,
                    })
                  }
                >
                  {EMPLOYMENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  value={modalData.designation || ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, designation: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  value={modalData.organization_name || ""}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      organization_name: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  value={modalData.department || ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, department: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Organization Business
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  placeholder="e.g. IT, Bank"
                  value={modalData.organization_business || ""}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      organization_business: e.target.value,
                    })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Organization Location
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  placeholder="e.g. Dhaka, Bangladesh (or Remote)"
                  value={modalData.organization_location || ""}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      organization_location: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  value={modalData.start_date || ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, start_date: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                  value={modalData.end_date || ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, end_date: e.target.value })
                  }
                  disabled={modalData.is_current}
                />

                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    id="is_current_job"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    checked={modalData.is_current || false}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        is_current: e.target.checked,
                        end_date: e.target.checked ? "" : modalData.end_date,
                      })
                    }
                  />
                  <label
                    htmlFor="is_current_job"
                    className="ml-2 text-sm font-medium text-slate-700 cursor-pointer"
                  >
                    I currently work here
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Responsibilities
                </label>
                <textarea
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  rows="4"
                  value={modalData.responsibilities || ""}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      responsibilities: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          {activeModal === "training" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Training / Course Title (Required)
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  value={modalData.training_title || ""}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      training_title: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Institute / Organization
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  value={modalData.institute || ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, institute: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  placeholder="e.g. Dhaka, Online"
                  value={modalData.location || ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, location: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  value={modalData.start_date || ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, start_date: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  value={modalData.end_date || ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, end_date: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {activeModal === "reference" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  value={modalData.name || ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Organization
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  value={modalData.organization || ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, organization: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  value={modalData.designation || ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, designation: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  placeholder="e.g. Manager, Professor"
                  value={modalData.relationship || ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, relationship: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  value={modalData.mobile_number || ""}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      mobile_number: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Office Phone
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  value={modalData.phone_office || ""}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      phone_office: e.target.value,
                    })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  value={modalData.email || ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, email: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Address
                </label>
                <textarea
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  rows="2"
                  value={modalData.address || ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, address: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {activeModal === "portfolio" && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Item Type
                </label>
                <select
                  className="w-full p-2 border rounded-lg bg-white focus:ring-blue-500"
                  value={modalData.item_type || "project"}
                  onChange={(e) =>
                    setModalData({ ...modalData, item_type: e.target.value })
                  }
                >
                  {ITEM_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  value={modalData.title || ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Link (URL)
                </label>
                <input
                  type="url"
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  value={modalData.link || ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, link: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  rows="3"
                  value={modalData.description || ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, description: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {activeModal === "skill" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  value={modalData.skill_name || ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, skill_name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  placeholder="e.g. 2.5"
                  value={modalData.years_of_experience || ""}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      years_of_experience: e.target.value,
                    })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Description / Details
                </label>
                <textarea
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  rows="3"
                  placeholder="e.g., Developed multiple full-stack applications using this technology..."
                  value={modalData.description || ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, description: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {activeModal === "extracurricular" && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Activity Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  value={modalData.activity_name || ""}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      activity_name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Position Held
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  value={modalData.position_held || ""}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      position_held: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                  rows="3"
                  value={modalData.description || ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, description: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end space-x-3 border-t mt-6 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSaving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
