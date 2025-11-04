import React from "react";

export default function FormActionBar({
  onPrev,
  onNext,
  onSave,
  prevDisabled = false,
  nextDisabled = false,
  saving = false,
  saveDisabled = false,
  saveLabel = "Save",
  rightContent = null,
}) {
  return (
    <div className="mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:items-center">
        <button
          type="button"
          onClick={onPrev}
          disabled={prevDisabled}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 w-full sm:w-auto"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 w-full sm:w-auto"
        >
          Next
        </button>
      </div>
      <div className="flex items-center gap-3">
        {rightContent}
        <button
          type="button"
          onClick={onSave}
          disabled={saving || saveDisabled}
          className="px-6 py-2 bg-[#ee3124] hover:bg-red-700 text-white text-sm font-medium rounded-md disabled:opacity-50"
        >
          {saving ? "Saving..." : saveLabel}
        </button>
      </div>
    </div>
  );
}
