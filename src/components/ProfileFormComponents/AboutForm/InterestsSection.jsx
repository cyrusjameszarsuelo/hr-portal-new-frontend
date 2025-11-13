import React from "react";

export default function InterestsSection({ values = [], onAdd, onUpdate, onRemove }) {
  return (
    <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4">
      <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
        <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
        Interests
      </h2>
      <div className="mt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Add your interests</span>
          <button
            type="button"
            onClick={onAdd}
            className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md"
          >
            + Add Interest
          </button>
        </div>
        {values?.length ? (
          <div className="space-y-2">
            {values.map((it, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={it.interest}
                  onChange={(e) => onUpdate(idx, e.target.value)}
                  className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                  placeholder="e.g., Photography"
                />
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="text-red-600 hover:text-red-800 text-xs font-medium whitespace-nowrap"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">No interests yet.</div>
        )}
      </div>
    </div>
  );
}
