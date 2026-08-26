import Modal from "../../../components/common/Modal";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

export default function ProfileModal({
  activeModal,
  modalData,
  setModalData,
  isSaving,
  onSubmit,
  onClose,
}) {
  const handleChange = (field, value) =>
    setModalData({ ...modalData, [field]: value });

  return (
    <Modal
      isOpen={!!activeModal}
      onClose={onClose}
      title={`Add ${activeModal}`}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {activeModal === "education" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Degree Type <span className="text-red-500">*</span>
              </label>
              <select
                value={modalData.degree_type || ""}
                onChange={(e) => handleChange("degree_type", e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                <option value="">Select Degree Type...</option>
                <option value="ssc">SSC / Equivalent</option>
                <option value="hsc">HSC / Equivalent</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="phd">PhD / Doctorate</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Input
              label="Degree Title"
              value={modalData.degree_title || ""}
              onChange={(e) => handleChange("degree_title", e.target.value)}
              placeholder="e.g., BSc in Computer Science"
              required
            />
            <Input
              label="Institution Name"
              value={modalData.institution || ""}
              onChange={(e) => handleChange("institution", e.target.value)}
              required
            />

            <Input
              label="Board / University"
              value={modalData.board_university || ""}
              onChange={(e) => handleChange("board_university", e.target.value)}
              placeholder="e.g., Dhaka University"
            />
            <Input
              label="Major / Group"
              value={modalData.major_group || ""}
              onChange={(e) => handleChange("major_group", e.target.value)}
              placeholder="e.g., Science"
            />

            <Input
              label="Passing Year"
              type="number"
              value={modalData.passing_year || ""}
              onChange={(e) => handleChange("passing_year", e.target.value)}
              placeholder="e.g., 2024"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Result (CGPA)"
                value={modalData.result || ""}
                onChange={(e) => handleChange("result", e.target.value)}
                placeholder="e.g., 3.85"
              />
              <Input
                label="Scale"
                value={modalData.scale || ""}
                onChange={(e) => handleChange("scale", e.target.value)}
                placeholder="e.g., 4.00"
              />
            </div>
          </div>
        )}

        {activeModal === "employment" && (
          <>
            <Input
              label="Organization Name"
              value={modalData.organization_name || ""}
              onChange={(e) =>
                handleChange("organization_name", e.target.value)
              }
              required
            />
            <Input
              label="Designation"
              value={modalData.designation || ""}
              onChange={(e) => handleChange("designation", e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={modalData.start_date || ""}
                onChange={(e) => handleChange("start_date", e.target.value)}
              />
              <Input
                label="End Date"
                type="date"
                value={modalData.end_date || ""}
                onChange={(e) => handleChange("end_date", e.target.value)}
              />
            </div>
          </>
        )}

        {activeModal === "skill" && (
          <>
            <Input
              label="Skill Name"
              value={modalData.skill_name || ""}
              onChange={(e) => handleChange("skill_name", e.target.value)}
              required
            />
            <Input
              label="Years of Experience"
              type="number"
              value={modalData.years_of_experience || ""}
              onChange={(e) =>
                handleChange("years_of_experience", e.target.value)
              }
            />
          </>
        )}

        <div className="pt-4 flex justify-end">
          <Button type="submit" isLoading={isSaving} className="!w-auto px-6">
            Save Entry
          </Button>
        </div>
      </form>
    </Modal>
  );
}
