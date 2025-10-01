import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

export default function RootLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="lg:px-8 lg:py-8 flex-1 bg-[#f2eeef]">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}
