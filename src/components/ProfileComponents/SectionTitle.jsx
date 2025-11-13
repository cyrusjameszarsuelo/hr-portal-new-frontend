export default function SectionTitle({ children }) {
    return (
        <h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
            <span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
            {children}
        </h2>
    );
}
