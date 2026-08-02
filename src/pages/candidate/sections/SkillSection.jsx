export default function SkillSection({ items, onAdd, onDelete }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="bg-slate-50 px-6 py-4 border-b flex justify-between">
                <h3 className="font-bold">Skills</h3>
                <button onClick={onAdd} className="text-blue-600 font-medium">+ Add</button>
            </div>
            <div className="p-6">
                {items?.length === 0 && <p className="text-slate-500 text-sm">No skills added.</p>}
                {items?.map((item) => (
                    <div key={item.id} className="flex justify-between border-b border-slate-100 py-3 last:border-0">
                        <p><b>{item.skill_name}</b> ({item.years_of_experience} years)</p>
                        <button onClick={() => onDelete('skill', item.id)} className="text-red-500 text-sm font-medium">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}