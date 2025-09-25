export default function ButtonIcon({ children, ...props }) {
    return (
        <button
            type="button"
            className="ml-2 opacity-70 hover:opacity-100 focus:opacity-100 transition-opacity duration-200 bg-white border border-gray-300 rounded-full p-1 flex items-center justify-center shadow hover:bg-gray-100 focus:ring-2 focus:ring-red-400"
            tabIndex={0}
            title="Edit"
            onClick={() => {
                props.handleEdit(
                    props.data.id,
                    props.data.id ? "function" : "subfunction",
                );
            }}
        >
            {children}
            
        </button>
    );
}
