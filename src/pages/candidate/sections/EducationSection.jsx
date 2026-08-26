export default function EducationSection({ items, onAdd, onDelete }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Education History</h3>
                <button onClick={onAdd} className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    + Add Education
                </button>
            </div>
            <div className="p-6">
                {(!items || items.length === 0) && (
                    <p className="text-slate-500 text-sm italic">No education history added yet.</p>
                )}
                
                <div className="space-y-6">
                    {items?.map((item) => (
                        <div key={item.id} className="flex justify-between items-start border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                            <div className="w-full">
                                <div className="flex items-center space-x-2">
                                    <h4 className="font-bold text-lg text-slate-900">{item.degree_title}</h4>
                                    {item.degree_type && (
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded uppercase border border-blue-200">
                                            {item.degree_type}
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-700 font-medium mt-1">{item.institution}</p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mt-3 text-sm text-slate-600">
                                    {item.major_group && <p><span className="font-medium text-slate-800">Major/Group:</span> {item.major_group}</p>}
                                    {item.board_university && <p><span className="font-medium text-slate-800">Board/University:</span> {item.board_university}</p>}
                                    {item.passing_year && <p><span className="font-medium text-slate-800">Passing Year:</span> {item.passing_year}</p>}
                                    {item.result && (
                                        <p>
                                            <span className="font-medium text-slate-800">Result:</span> {item.result} 
                                            {item.scale ? ` (Out of ${item.scale})` : ''}
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => onDelete('education', item.id)} 
                                className="text-red-500 hover:text-red-700 text-sm font-medium ml-4 shrink-0 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}