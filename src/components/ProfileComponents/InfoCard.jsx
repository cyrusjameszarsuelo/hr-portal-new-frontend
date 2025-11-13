import SectionTitle from "./SectionTitle";

export default function InfoCard({ title, children, className = "" }) {
    return (
        <div
            className={`bg-white border border-gray-200 shadow-xl rounded-lg p-4 ${className}`}
        >
            <SectionTitle>{title}</SectionTitle>
            <div className="mt-3">{children}</div>
        </div>
    );
}
