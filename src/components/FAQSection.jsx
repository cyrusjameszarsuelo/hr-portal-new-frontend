import React, { useState } from "react";

const functional_structure = [
    {
        label: "What is Megawide's vision?",
        subfunction: [
            {
                label: "How does Megawide achieve its vision?",
                description: [
                    {
                        label: "By investing in technology, people, and sustainable practices.",
                    },
                    {
                        label: "This is a sample description.",
                    },
                ],
            },
        ],
    },
];

function FunctionalStructure({ data, level = 0 }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`mb-2 ${level === 0 ? "border-b" : ""}`}>
            <button
                className={`w-full flex justify-between items-center py-3 px-4 text-left focus:outline-none transition-colors duration-200`}
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
            >
                <span>{data.label}</span>
                <svg
                    className={`w-5 h-5 ml-2 transform transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${
                    open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
                style={{ paddingLeft: level * 20 }}
            >
                {data.description &&
                    data.description.map((desc, idx) => (
                        <div key={idx} className="px-4 pb-3 text-gray-700">
                            {desc.label}
                        </div>
                    ))}
                {data.subfunction && data.subfunction.length > 0 && (
                    <div className="pl-2">
                        {data.subfunction.map((sub, idx) => (
                            <FunctionalStructure
                                key={idx}
                                data={sub}
                                level={level + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function FAQSection() {
    return (
        <section className="w-auto mx-auto my-8 p-4 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-red-700">
                Functional Structure
            </h2>
            {functional_structure.map((data, idx) => (
                <FunctionalStructure key={idx} data={data} />
            ))}
        </section>
    );
}
