export default function PortfolioSection({ items, onAdd, onEdit, onDelete }) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">Portfolios & Projects</h3>
          <button onClick={onAdd} className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 transition-colors text-sm">
            + Add Project
          </button>
        </div>
        
        <div className="space-y-4">
          {!items || items.length === 0 ? (
            <p className="text-sm text-slate-500">No projects or portfolios added yet.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="p-5 border border-slate-100 bg-slate-50 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                
                <div className="flex-grow">
                  
                  {/* Title and Item Type Badge */}
                  <h4 className="font-bold text-slate-900 text-lg flex items-center gap-3">
                    {item.title}
                    {item.item_type && (
                      <span className="text-[10px] uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                          {item.item_type.replace('_', ' ')}
                      </span>
                    )}
                  </h4>
                  
                  {item.link && (
                      <div className="mt-1">
                        <a href={item.link} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline font-medium">
                          {item.link}
                        </a>
                      </div>
                  )}
                  
                  {item.description && (
                      <p className="text-sm text-slate-600 mt-3 whitespace-pre-line bg-white p-3 rounded border shadow-sm">
                        {item.description}
                      </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 sm:ml-4 flex-shrink-0">
                  <button onClick={() => onEdit(item)} className="text-sm font-bold text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                  <button onClick={() => onDelete("portfolio", item.id)} className="text-sm font-bold text-red-600 hover:text-red-800">
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