import React from "react";
import CustomModal from "../CustomModal";

export default function ConfirmDialog({
    open,
    title = "Confirm",
    message = "Are you sure?",
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    onCancel,
    onConfirm,
}) {
    return (
        <CustomModal isOpen={open} onClose={onCancel} title={title}>
            <div className="space-y-4">
                <p className="text-gray-700">{message}</p>
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-[#ee3124] text-white hover:bg-red-600"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </CustomModal>
    );
}
