import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

const divisions = [
  "Barishal",
  "Chittagong",
  "Dhaka",
  "Khulna",
  "Mymensingh",
  "Rajshahi",
  "Rangpur",
  "Sylhet",
];
const districts = [
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barishal",
  "Bhola",
  "Bogura",
  "Brahmanbaria",
  "Chandpur",
  "Chapainawabganj",
  "Chittagong",
  "Chuadanga",
  "Comilla",
  "Coxs Bazar",
  "Dhaka",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokati",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachhari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon",
];

export default function AddressSection({ title, data, setData, onSave }) {
  const handleChange = (field, value) => setData({ ...data, [field]: value });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">{title}</h3>
      </div>

      <form
        onSubmit={onSave}
        className="p-6 flex-grow flex flex-col justify-between"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="md:col-span-2">
            <Input
              label="Country"
              value={data.country || "Bangladesh"}
              onChange={(e) => handleChange("country", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Division <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={data.division || ""}
              onChange={(e) => handleChange("division", e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            >
              <option value="">Select Division...</option>
              {divisions.map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              District <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={data.district || ""}
              onChange={(e) => handleChange("district", e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            >
              <option value="">Select District...</option>
              {districts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Thana / Upazila"
            value={data.thana_upzila || ""}
            onChange={(e) => handleChange("thana_upzila", e.target.value)}
            required
          />

          <Input
            label="Post Office"
            value={data.post_office || ""}
            onChange={(e) => handleChange("post_office", e.target.value)}
            required
          />

          <Input
            label="Post Code"
            type="number"
            value={data.post_code || ""}
            onChange={(e) => handleChange("post_code", e.target.value)}
            required
          />

          <div className="md:col-span-2">
            <Input
              label="House / Road / Village"
              value={data.house_road_village || ""}
              onChange={(e) =>
                handleChange("house_road_village", e.target.value)
              }
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button type="submit" className="!w-auto px-8 shadow-md">
            Save {title}
          </Button>
        </div>
      </form>
    </div>
  );
}
