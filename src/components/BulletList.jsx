export default function BulletList({ items }) {
    if (!items || items.length === 0) {
        return <div className="text-gray-500 text-sm">N/A</div>;
    }

    return (
        <div className="space-y-1 text-sm">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-gray-800 rounded-full mt-2" />
                    <div>{item}</div>
                </div>
            ))}
        </div>
    );
}
