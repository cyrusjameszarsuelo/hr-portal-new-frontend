export function InfoField({ label, value }) {
    return (
        <div>
            <span className="font-semibold">{label}:</span> {value}
        </div>
    );
}

export function InfoGrid({ children, cols = 3 }) {
    const colsClass = {
        2: "md:grid-cols-2",
        3: "md:grid-cols-2 lg:grid-cols-3",
    };

    return (
        <div
            className={`grid grid-cols-1 ${colsClass[cols] || colsClass[3]} gap-4 text-sm`}
        >
            {children}
        </div>
    );
}
