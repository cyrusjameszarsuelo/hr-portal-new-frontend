export default function Title({ title }) {
    return (
        <div className="flex items-center ">
            <div className="relative flex">
                <span
                    className="block w-2 bg-red-600 rounded-l absolute left-0 top-0 bottom-0 h-full z-10"
                    style={{
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                    }}
                ></span>
                <h2
                    className="text-[100%] font-bold bg-black text-white px-6 py-2 rounded-r uppercase tracking-wide relative z-20 flex items-center"
                    style={{ marginLeft: "0.5rem" }}
                >
                    {title}
                </h2>
            </div>
        </div>
    );
}
