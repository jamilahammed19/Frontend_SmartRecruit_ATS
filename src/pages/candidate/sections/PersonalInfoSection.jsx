import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

// Django Model Choices
const RELIGIONS = [
  { value: "islam", label: "Islam" },
  { value: "hinduism", label: "Hinduism" },
  { value: "christianity", label: "Christianity" },
  { value: "buddhism", label: "Buddhism" },
  { value: "judaism", label: "Judaism" },
  { value: "other", label: "Other" },
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function PersonalInfoSection({ data, setData, onSave }) {
  const handleChange = (field, value) => setData({ ...data, [field]: value });

  // Helper to render required labels beautifully
  const RequiredLabel = ({ text }) => (
    <label className="block text-sm font-bold text-slate-700 mb-1">
      {text} <span className="text-red-500">*</span>
    </label>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Personal Information</h3>
        <span className="text-xs font-bold text-slate-500">
          <span className="text-red-500">*</span> Required to apply for jobs
        </span>
      </div>

      <form onSubmit={onSave} className="p-6 space-y-8">
        {/* --- GROUP 1: BASIC IDENTITY --- */}
        <div>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">
            Basic Identity
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Full Name"
              value={data.full_name || ""}
              onChange={(e) => handleChange("full_name", e.target.value)}
              required
            />
            <Input
              label="Father's Name"
              value={data.father_name || ""}
              onChange={(e) => handleChange("father_name", e.target.value)}
              required
            />
            <Input
              label="Mother's Name"
              value={data.mother_name || ""}
              onChange={(e) => handleChange("mother_name", e.target.value)}
              required
            />

            <Input
              label="Date of Birth"
              type="date"
              value={data.date_of_birth || ""}
              onChange={(e) => handleChange("date_of_birth", e.target.value)}
              required
            />

            <div>
              <RequiredLabel text="Gender" />
              <select
                value={data.gender || ""}
                onChange={(e) => handleChange("gender", e.target.value)}
                required
                className="w-full p-2 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <RequiredLabel text="Marital Status" />
              <select
                value={data.marital_status || ""}
                onChange={(e) => handleChange("marital_status", e.target.value)}
                required
                className="w-full p-2 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select...</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>

            <div>
              <RequiredLabel text="Religion" />
              <select
                value={data.religion || ""}
                onChange={(e) => handleChange("religion", e.target.value)}
                required
                className="w-full p-2 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select...</option>
                {RELIGIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <RequiredLabel text="Blood Group" />
              <select
                value={data.blood_group || ""}
                onChange={(e) => handleChange("blood_group", e.target.value)}
                required
                className="w-full p-2 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select...</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Nationality"
              value={data.nationality || "Bangladeshi"}
              onChange={(e) => handleChange("nationality", e.target.value)}
              required
            />
          </div>
        </div>

        {/* --- GROUP 2: IDENTIFIERS --- */}
        <div>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">
            Official Identifiers
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="National ID (NID)"
              value={data.nid || ""}
              onChange={(e) => handleChange("nid", e.target.value)}
              required
            />
            <Input
              label="Passport Number (Optional)"
              value={data.passport_number || ""}
              onChange={(e) => handleChange("passport_number", e.target.value)}
            />
          </div>
        </div>

        {/* --- GROUP 3: CONTACT INFORMATION --- */}
        <div>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">
            Contact Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Primary Phone"
              value={data.phone_number || ""}
              onChange={(e) => handleChange("phone_number", e.target.value)}
              required
            />
            <Input
              label="Alternate Phone (Optional)"
              value={data.phone_number_alt || ""}
              onChange={(e) => handleChange("phone_number_alt", e.target.value)}
            />

            {/* Primary Email is usually tied to the account, so we show it as disabled/read-only */}
            <div className="opacity-70">
              <Input
                label="Primary Email"
                type="email"
                value={data.verified_email || ""}
                disabled
              />
            </div>
            <Input
              label="Alternate Email (Optional)"
              type="email"
              value={data.email_alt || ""}
              onChange={(e) => handleChange("email_alt", e.target.value)}
            />
          </div>
        </div>

        {/* --- GROUP 4: PHYSICAL ATTRIBUTES --- */}
        <div>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">
            Physical Attributes (Optional)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Height (e.g., 5.8 feet)"
              type="number"
              step="0.01"
              value={data.height || ""}
              onChange={(e) => handleChange("height", e.target.value)}
            />
            <Input
              label="Weight (kg)"
              type="number"
              step="0.01"
              value={data.weight || ""}
              onChange={(e) => handleChange("weight", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-8 pt-4 flex justify-end border-t border-slate-100">
          <Button
            type="submit"
            className="!w-auto px-10 py-3 text-lg shadow-md"
          >
            Save Personal Info
          </Button>
        </div>
      </form>
    </div>
  );
}
