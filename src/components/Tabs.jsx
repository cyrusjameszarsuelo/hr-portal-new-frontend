import React from "react";

export default function Tabs({ tabs = [], tab = null, active, onChange, children, hideNav = false }) {
    const tabList = Array.isArray(tabs) && tabs.length ? tabs : tab ? [tab] : [];

    if (!tabList.length) return <div>{children}</div>;

    const current = active ?? tabList[0].id;

    return (
        <div className="w-full">
            {!hideNav && (
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex items-end gap-2 overflow-x-auto px-1 flex-nowrap snap-x snap-mandatory" aria-label="Tabs">
                        {tabList.map((t) => {
                            const isActive = t.id === active;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => onChange && onChange(t.id)}
                                    role="tab"
                                    aria-selected={isActive}
                                    aria-controls={`tab-panel-${t.id}`}
                                    id={`tab-${t.id}`}
                                    className={`snap-start flex-1 sm:flex-none inline-flex items-center justify-center min-w-0 text-left whitespace-nowrap py-1 sm:py-3 px-2 sm:px-4 font-medium text-sm rounded-t-lg focus:outline-none overflow-hidden ${
                                        isActive
                                            ? "text-red-700 bg-white border-t border-l border-r border-gray-200"
                                            : "text-gray-600 hover:text-gray-800 bg-gray-50"
                                    }`}
                                >
                                    <span className="truncate block max-w-none sm:max-w-none" title={t.label}>
                                        <span className="hidden sm:inline">{t.label}</span>
                                        <span className="inline sm:hidden">{t.mobileLabel ?? t.label}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            )}

            {/* Panels */}
            <div className="mt-4">
                {tabList.map((t) => (
                    <div
                        key={t.id}
                        id={`tab-panel-${t.id}`}
                        role="tabpanel"
                        aria-labelledby={`tab-${t.id}`}
                        hidden={t.id !== current}
                        className={t.id === current ? "block" : "hidden"}
                    >
                        <div className="p-4 bg-white rounded shadow-sm inset-0 bg-linear-to-r from-red-100/40 to-transparent">{t.content}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
