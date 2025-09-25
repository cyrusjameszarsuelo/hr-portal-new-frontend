import React from "react";


export function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-40">
      <div className="mb-2">
        <svg className="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      </div>
      <span className="text-gray-600 text-lg font-medium">Loading...</span>
    </div>
  );
}

export function Error({ message }) {
  return (
    <div className="flex flex-col justify-center items-center h-40">
      <svg className="h-8 w-8 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth="2" className="text-red-200" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
      </svg>
      <span className="text-red-600 text-lg font-medium">{message || "An error occurred."}</span>
    </div>
  );
}
