export default function EmploymentSection({ items, onAdd, onEdit, onDelete }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">Employment History</h3>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 transition-colors text-sm"
        >
          + Add Employment
        </button>
      </div>

      <div className="space-y-4">
        {!items || items.length === 0 ? (
          <p className="text-sm text-slate-500">
            No employment records added yet.
          </p>
        ) : (
          items.map((emp) => (
            <div
              key={emp.id}
              className="p-5 border border-slate-100 bg-slate-50 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4"
            >
              <div className="flex-grow">
                <h4 className="font-bold text-slate-900 text-lg flex items-center gap-3">
                  {emp.designation}
                  {emp.employment_type && (
                    <span className="text-[10px] uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                      {emp.employment_type.replace("_", " ")}
                    </span>
                  )}
                </h4>

                <div className="text-sm text-slate-700 font-medium mt-1">
                  {emp.organization_name}
                  {emp.department && ` • ${emp.department}`}
                  {emp.organization_location &&
                    ` • ${emp.organization_location}`}
                </div>

                <div className="text-sm text-slate-500 mt-2 flex flex-wrap gap-x-5 gap-y-1">
                  {emp.organization_business && (
                    <span>
                      <strong>Industry:</strong> {emp.organization_business}
                    </span>
                  )}
                  <span>
                    <strong>Duration:</strong> {emp.start_date || "Unknown"} to{" "}
                    {emp.is_current ? "Present" : emp.end_date || "Unknown"}
                  </span>
                </div>

                {emp.responsibilities && (
                  <div className="text-sm text-slate-600 mt-3 whitespace-pre-line bg-white p-3 rounded border shadow-sm">
                    {emp.responsibilities}
                  </div>
                )}
              </div>

              <div className="flex space-x-3 sm:ml-4 flex-shrink-0">
                <button
                  onClick={() => onEdit(emp)}
                  className="text-sm font-bold text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete("employment", emp.id)}
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
