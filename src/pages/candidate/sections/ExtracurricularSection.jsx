export default function ExtracurricularSection({ items, onAdd, onEdit, onDelete }) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">Extracurricular Activities</h3>
          <button onClick={onAdd} className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 transition-colors text-sm">
            + Add Activity
          </button>
        </div>
        
        <div className="space-y-4">
          {!items || items.length === 0 ? (
            <p className="text-sm text-slate-500">No activities added yet.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="p-5 border border-slate-100 bg-slate-50 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                
                <div className="flex-grow">
                  <h4 className="font-bold text-slate-900 text-lg">{item.activity_name}</h4>
                  
                  {item.position_held && (
                      <div className="text-sm text-indigo-700 font-bold mt-1">
                          {item.position_held}
                      </div>
                  )}
                  
                  {item.description && (
                      <p className="text-sm text-slate-600 mt-2 whitespace-pre-line">{item.description}</p>
                  )}
                </div>

                <div className="flex space-x-3 sm:ml-4 flex-shrink-0">
                  <button onClick={() => onEdit(item)} className="text-sm font-bold text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                  <button onClick={() => onDelete("extracurricular", item.id)} className="text-sm font-bold text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    );
}