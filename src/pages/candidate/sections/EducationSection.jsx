export default function EducationSection({ items, onAdd, onEdit, onDelete }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">Education History</h3>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 transition-colors text-sm"
        >
          + Add Education
        </button>
      </div>

      <div className="space-y-4">
        {!items || items.length === 0 ? (
          <p className="text-sm text-slate-500">
            No education records added yet.
          </p>
        ) : (
          items.map((edu) => (
            <div
              key={edu.id}
              className="p-5 border border-slate-100 bg-slate-50 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4"
            >
              <div className="flex-grow">
                {/* Title and Badge */}
                <h4 className="font-bold text-slate-900 text-lg flex items-center gap-3">
                  {edu.degree_title}
                  {edu.degree_type && (
                    <span className="text-[10px] uppercase bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold">
                      {edu.degree_type}
                    </span>
                  )}
                </h4>

                {/* Institution and Board */}
                <div className="text-sm text-slate-700 font-medium mt-1">
                  {edu.institution}{" "}
                  {edu.board_university && `• ${edu.board_university}`}
                </div>

                {/* Dynamic Details Row (Only shows fields that actually exist) */}
                <div className="text-sm text-slate-500 mt-2 flex flex-wrap gap-x-5 gap-y-1">
                  {/* Properly formats the Stream (e.g. 'not_applicable' -> 'Not Applicable') */}
                  {edu.major_group_type &&
                    edu.major_group_type !== "not_applicable" && (
                      <span className="capitalize">
                        <strong>Stream:</strong>{" "}
                        {edu.major_group_type.replace("_", " ")}
                      </span>
                    )}

                  {edu.major_group && (
                    <span>
                      <strong>Major:</strong> {edu.major_group}
                    </span>
                  )}
                  {edu.dept && (
                    <span>
                      <strong>Dept:</strong> {edu.dept}
                    </span>
                  )}
                  {edu.duration && (
                    <span>
                      <strong>Duration:</strong> {edu.duration}
                    </span>
                  )}
                  {edu.passing_year && (
                    <span>
                      <strong>Passing Year:</strong> {edu.passing_year}
                    </span>
                  )}
                </div>

                {/* Result Box (Only show Scale if it's not "other") */}
                {(edu.result || edu.scale) && (
                  <div className="text-sm text-slate-700 mt-3 bg-white px-3 py-1.5 rounded border inline-block shadow-sm">
                    <strong>Result:</strong> {edu.result || "N/A"}
                    {edu.scale && edu.scale !== "other" && (
                      <span className="text-slate-500 text-xs ml-1">
                        (Out of {edu.scale})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 sm:ml-4 flex-shrink-0">
                <button
                  onClick={() => onEdit(edu)}
                  className="text-sm font-bold text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete("education", edu.id)}
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
