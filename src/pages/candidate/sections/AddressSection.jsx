import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export default function AddressSection({ title, data, setData, onSave }) {
    const handleChange = (field, value) => setData({ ...data, [field]: value });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h3 className="font-bold">{title}</h3>
            </div>
            <form onSubmit={onSave} className="p-6 space-y-4">
                <Input label="Country" value={data.country || "Bangladesh"} onChange={(e) => handleChange("country", e.target.value)} />
                <Input label="District" value={data.district || ""} onChange={(e) => handleChange("district", e.target.value)} />
                <Input label="House/Road/Village" value={data.house_road_village || ""} onChange={(e) => handleChange("house_road_village", e.target.value)} />
                <Button type="submit" className="!w-auto">Update Address</Button>
            </form>
        </div>
    );
}