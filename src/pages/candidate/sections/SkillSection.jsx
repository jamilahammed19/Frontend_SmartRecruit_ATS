export default function SkillSection({ items, onAdd, onEdit, onDelete }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">Skills</h3>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 transition-colors text-sm"
        >
          + Add Skill
        </button>
      </div>

      <div className="space-y-4">
        {!items || items.length === 0 ? (
          <p className="text-sm text-slate-500">No skills added yet.</p>
        ) : (
          items.map((skill) => (
            <div
              key={skill.id}
              className="p-5 border border-slate-100 bg-slate-50 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4"
            >
              <div className="flex-grow">
                <div className="flex items-center gap-3">
                  <h4 className="font-bold text-slate-900 text-lg">
                    {skill.skill_name}
                  </h4>
                  {skill.years_of_experience && (
                    <span className="text-[10px] uppercase font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded">
                      {skill.years_of_experience} Yrs Exp
                    </span>
                  )}
                </div>

                {skill.description && (
                  <p className="text-sm text-slate-600 mt-2 whitespace-pre-line">
                    {skill.description}
                  </p>
                )}
              </div>

              <div className="flex space-x-3 sm:ml-4 flex-shrink-0">
                <button
                  onClick={() => onEdit(skill)}
                  className="text-sm font-bold text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete("skill", skill.id)}
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
