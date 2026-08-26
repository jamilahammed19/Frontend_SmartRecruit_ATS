import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export default function PersonalInfoSection({ data, setData, onSave }) {
    const handleChange = (field, value) => setData({ ...data, [field]: value });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h3 className="font-bold">Personal Information</h3>
            </div>
            <form onSubmit={onSave} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input label="Full Name" value={data.full_name || ""} onChange={(e) => handleChange("full_name", e.target.value)} />
                    <Input label="Father's Name" value={data.father_name || ""} onChange={(e) => handleChange("father_name", e.target.value)} />
                    <Input label="Mother's Name" value={data.mother_name || ""} onChange={(e) => handleChange("mother_name", e.target.value)} />
                    <Input label="Date of Birth" type="date" value={data.date_of_birth || ""} onChange={(e) => handleChange("date_of_birth", e.target.value)} />

                    <div>
                        <label className="block text-sm font-medium mb-1">Gender</label>
                        <select value={data.gender || ""} onChange={(e) => handleChange("gender", e.target.value)} className="w-full p-2 border rounded-lg">
                            <option value="">Select...</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Marital Status</label>
                        <select value={data.marital_status || ""} onChange={(e) => handleChange("marital_status", e.target.value)} className="w-full p-2 border rounded-lg">
                            <option value="">Select...</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorced">Divorced</option>
                        </select>
                    </div>

                    <Input label="Phone Number" value={data.phone_number || ""} onChange={(e) => handleChange("phone_number", e.target.value)} />
                    <Input label="National ID" value={data.nid || ""} onChange={(e) => handleChange("nid", e.target.value)} />
                    <Input label="Nationality" value={data.nationality || ""} onChange={(e) => handleChange("nationality", e.target.value)} />
                </div>
                <Button type="submit" className="mt-4 !w-auto">Update Personal Info</Button>
            </form>
        </div>
    );
}