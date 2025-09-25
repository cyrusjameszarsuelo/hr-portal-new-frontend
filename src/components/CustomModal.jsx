import React from "react";

export default function CustomModal({ isOpen, onClose, title, children }) {
	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
			<div className="bg-white rounded-lg shadow-lg max-w-md w-full relative animate-fadeIn">
				{/* Close button */}
				<button
					className="absolute top-2 right-2 text-gray-400 hover:text-red-500 focus:outline-none"
					onClick={onClose}
					aria-label="Close modal"
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
				{title && (
					<div className="px-6 pt-6 pb-2 border-b border-gray-200">
						<h3 className="text-lg font-semibold text-gray-800">{title}</h3>
					</div>
				)}
				<div className="px-6 py-4">{children}</div>
			</div>
		</div>
	);
}
