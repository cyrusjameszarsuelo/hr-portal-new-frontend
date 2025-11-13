const Checkbox = ({ value, name, onChange, checked = false, onOthersChange, othersValue = "" }) => {
    return (
        <>
            <div className="flex h-6 shrink-0 items-center">
                <div className="group grid size-4 grid-cols-">
                    <input
                        id={value}
                        name={name}
                        type="checkbox"
                        aria-describedby="comments-description"
                        value={value}
                        checked={checked}
                        onChange={onChange}
                        className="col-start-1 row-start-1 w-5 h-5 appearance-none rounded-sm border-2 border-black/30 bg-white/5 checked:border-[#ee3124] checked:bg-[#ee3124] indeterminate:border-[#ee3124] indeterminate:bg-[#ee3124] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ee3124] disabled:border-white/5 disabled:bg-white/10 disabled:checked:bg-white/10 forced-colors:appearance-auto"
                    />
                    <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-white/25"
                    >
                        <path
                            d="M3 8L6 11L11 3.5"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-checked:opacity-100"
                        />
                        <path
                            d="M3 7H11"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-indeterminate:opacity-100"
                        />
                    </svg>
                </div>
            </div>
            <div className="text-sm/6">
                <label
                    htmlFor={name}
                    className="block text-sm/6 font-medium text-gray-700"
                >
                    {value}
                </label>

                {value === "Others: " && checked && (
                    <div className="mt-1">
                        <input
                            type="text"
                            value={othersValue}
                            onChange={(e) => onOthersChange && onOthersChange(e.target.value)}
                            placeholder="Please specify, separate items by comma."
                            className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default Checkbox;
