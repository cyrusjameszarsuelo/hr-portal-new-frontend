import React from "react";

export default function EducationSection({ values = [], options = [], onAdd, onUpdateField, onToggleCurrent, onRemove }) {
  return (
    <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4">
      <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
        <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
        Educational Background
      </h2>
      <div className="mt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Add your academic records</span>
          <button
            type="button"
            onClick={onAdd}
            className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md"
          >
            + Add Education
          </button>
        </div>
        {values?.length ? (
          <div className="space-y-3">
            {values.map((edu, eIdx) => (
              <div key={eIdx} className="border border-gray-200 rounded-md p-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Education Level</label>
                    <select
                      value={edu.education_level}
                      onChange={(e) => onUpdateField(eIdx, "education_level", e.target.value)}
                      className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                    >
                      <option value="">Select level...</option>
                      {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">School Attended</label>
                    <input
                      type="text"
                      value={edu.school_attended}
                      onChange={(e) => onUpdateField(eIdx, "school_attended", e.target.value)}
                      className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                      placeholder="e.g., XYZ University"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Degree / Program</label>
                    <input
                      type="text"
                      value={edu.degree_program_course}
                      onChange={(e) => onUpdateField(eIdx, "degree_program_course", e.target.value)}
                      className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                      placeholder="e.g., BS Civil Engineering"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-gray-700">Academic Achievements</label>
                    <textarea
                      rows={2}
                      value={edu.academic_achievements}
                      onChange={(e) => onUpdateField(eIdx, "academic_achievements", e.target.value)}
                      className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                      placeholder="e.g., Dean's Lister"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Year Started</label>
                    <input
                      type="text"
                      value={edu.year_started}
                      onChange={(e) => onUpdateField(eIdx, "year_started", e.target.value)}
                      className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                      placeholder="e.g., 2018"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Year Ended</label>
                    <input
                      type="text"
                      value={edu.year_ended}
                      onChange={(e) => onUpdateField(eIdx, "year_ended", e.target.value)}
                      disabled={!!edu.is_current}
                      className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
                      placeholder="e.g., 2022"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!edu.is_current}
                        onChange={(e) => onToggleCurrent(eIdx, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-[#ee3124] focus:ring-[#ee3124]"
                      />
                      <span className="text-xs font-medium text-gray-700">Currently Enrolled</span>
                    </label>
                  </div>
                </div>
                <div className="mt-3 text-right">
                  <button
                    type="button"
                    onClick={() => onRemove(eIdx)}
                    className="text-red-600 hover:text-red-800 text-xs font-medium"
                  >
                    Remove Education
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">No educational background yet.</div>
        )}
      </div>
    </div>
  );
}
