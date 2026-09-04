export default function TrainingSection({ items, onAdd, onEdit, onDelete }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">
          Training & Certifications
        </h3>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 transition-colors text-sm"
        >
          + Add Training
        </button>
      </div>

      <div className="space-y-4">
        {!items || items.length === 0 ? (
          <p className="text-sm text-slate-500">
            No trainings or certifications added yet.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="p-5 border border-slate-100 bg-slate-50 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4"
            >
              <div className="flex-grow">
                <h4 className="font-bold text-slate-900 text-lg">
                  {item.training_title}
                </h4>

                <div className="text-sm text-slate-700 font-medium mt-1">
                  {item.institute || "No Institute Listed"}{" "}
                  {item.location && `• ${item.location}`}
                </div>

                <div className="text-sm text-slate-500 mt-2 flex flex-wrap gap-x-5 gap-y-1">
                  {(item.start_date || item.end_date) && (
                    <span>
                      <strong>Duration:</strong> {item.start_date || "Unknown"}{" "}
                      to {item.end_date || "Present"}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 sm:ml-4 flex-shrink-0">
                <button
                  onClick={() => onEdit(item)}
                  className="text-sm font-bold text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete("training", item.id)}
                  className="text-sm font-bold text-red-600 hover:text-red-800"
                >
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
