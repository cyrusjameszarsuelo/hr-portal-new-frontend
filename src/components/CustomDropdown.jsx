export default function CustomDropdown({ label, children, ...props }) {
    return (
        <button
            className="flex-1 text-left focus:outline-none transition-colors duration-200 group bg-transparent flex items-center"
            onClick={() => props.setOpen((o) => !o)}
            aria-expanded={props.open}
            type="button"
        >
            <span
                className={
                    `flex-1 text-left ${
                        props.level > 0 ? "text-gray-600" : " font-bold "
                    }` + (props.open ? "text-[#ee3124]" : "")
                }
            >
                {label}
            </span>
            {children}
        </button>
    );
}
