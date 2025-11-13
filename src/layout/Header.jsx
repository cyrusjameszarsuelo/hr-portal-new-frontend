import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} from "@headlessui/react";
import {
    ArrowPathIcon,
    Bars3Icon,
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    PowerIcon,
    SquaresPlusIcon,
    UserCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import {
    ChevronDownIcon,
    PhoneIcon,
    PlayCircleIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";
import logo from "../assets/images/megawide-logo.png";
import icon from "../assets/images/megawide-icon.png";
import { Link, NavLink, useNavigate } from "react-router";
import useUser from "../contexts/useUser";
import { logout } from "../database/auth";
// const callsToAction = [
//     { name: "Watch demo", href: "#", icon: PlayCircleIcon },
//     { name: "Contact sales", href: "#", icon: PhoneIcon },
// ];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user } = useUser();
    // const userName = user ? user.name : null;
    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        if (loggingOut) return;
        setLoggingOut(true);
        try {
            await logout(user?.id);
        } catch (e) {
            console.warn("logout failed", e);
        }
        try {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_id");
        } catch (e) {
            console.warn("failed clearing storage", e);
        }
        // navigate to auth (replace so back doesn't return)
        navigate("/auth", { replace: true });
    };

    // const handleMyProfile = () => {
    //     navigate("/my-profile");
    // };

    // const dropdownUser = [
    //     {
    //         name: "My Profile",
    //         onClick: handleMyProfile,
    //         icon: UserCircleIcon,
    //     },
    //     {
    //         name: "Logout",
    //         onClick: handleLogout,
    //         icon: PowerIcon,
    //     },
    //     // {
    //     //     name: "Security",
    //     //     description: "Your customers’ data will be safe and secure",
    //     //     href: "#",
    //     //     icon: FingerPrintIcon,
    //     // },
    //     // {
    //     //     name: "Integrations",
    //     //     description: "Connect with third-party tools",
    //     //     href: "#",
    //     //     icon: SquaresPlusIcon,
    //     // },
    //     // {
    //     //     name: "Automations",
    //     //     description: "Build strategic funnels that will convert",
    //     //     href: "#",
    //     //     icon: ArrowPathIcon,
    //     // },
    // ];
    return (
        <header className="bg-white">
            <nav
                aria-label="Global"
                className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
            >
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Megawide</span>
                        <img alt="" src={logo} className="h-18 w-auto" />
                    </a>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>
                <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `text-sm/6 font-semibold ${
                                isActive ? "text-red-700" : "text-gray-900"
                            }`
                        }
                    >
                        Functional Structure
                    </NavLink>

                    <NavLink
                        to="org-structure"
                        className={({ isActive }) =>
                            `text-sm/6 font-semibold ${
                                isActive ? "text-red-700" : "text-gray-900"
                            }`
                        }
                    >
                        Organizational Structure
                    </NavLink>
                    <NavLink
                        to="my-profile"
                        className={({ isActive }) =>
                            `text-sm/6 font-semibold ${
                                isActive ? "text-red-700" : "text-gray-900"
                            }`
                        }
                    >
                        My Profile
                    </NavLink>
                    <a
                        onClick={handleLogout}
                        className="text-sm/6 font-semibold text-gray-900 cursor-pointer"
                    >
                        Logout
                    </a>

                    {/* <Popover className="relative">
                        <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
                            {userName ? userName : null}
                            <ChevronDownIcon
                                aria-hidden="true"
                                className="size-5 flex-none text-gray-400"
                            />
                        </PopoverButton>

                        <PopoverPanel
                            transition
                            className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-3xl bg-white shadow-lg outline-1 outline-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                        >
                            <div className="p-4">
                                {dropdownUser.map((item) => (
                                    <PopoverButton
                                        as="div"
                                        key={item.name}
                                        className="group relative flex w-full items-center gap-x-6 rounded-lg p-4 text-sm hover:bg-gray-50"
                                        onClick={item.onClick}
                                    >
                                        <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                            <item.icon
                                                aria-hidden="true"
                                                className="size-6 text-gray-600 group-hover:text-red-700"
                                            />
                                        </div>
                                        <div className="flex-auto">
                                            <a
                                                onClick={item.onClick}
                                                className="block font-semibold text-gray-900"
                                            >
                                                {item.name}
                                                <span className="absolute inset-0" />
                                            </a>
                                            {item.name === "Logout" &&
                                                loggingOut && (
                                                    <div className="ml-3 flex items-center text-sm text-gray-600">
                                                        <svg
                                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            ></circle>
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                            ></path>
                                                        </svg>
                                                        <span>
                                                            Logging out...
                                                        </span>
                                                    </div>
                                                )}
                                        </div>
                                    </PopoverButton>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                                {callsToAction.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100"
                                    >
                                        <item.icon
                                            aria-hidden="true"
                                            className="size-5 flex-none text-gray-400"
                                        />
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </PopoverPanel>
                    </Popover> */}
                </PopoverGroup>
            </nav>
            <Dialog
                open={mobileMenuOpen}
                onClose={setMobileMenuOpen}
                className="lg:hidden"
            >
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Megawide</span>
                            <img alt="" src={icon} className="h-8 w-auto" />
                        </a>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {/* <Disclosure as="div" className="-mx-3">
                                    <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                                        Product
                                        <ChevronDownIcon
                                            aria-hidden="true"
                                            className="size-5 flex-none group-data-open:rotate-180"
                                        />
                                    </DisclosureButton>
                                    <DisclosurePanel className="mt-2 space-y-2">
                                        {[...products, ...callsToAction].map(
                                            (item) => (
                                                <DisclosureButton
                                                    key={item.name}
                                                    as="a"
                                                    href={item.href}
                                                    className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                                                >
                                                    {item.name}
                                                </DisclosureButton>
                                            ),
                                        )}
                                    </DisclosurePanel>
                                </Disclosure> */}
                                <Link
                                    to="/"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    Functional Structure
                                </Link>

                                <Link
                                    to="org-structure"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    Organizational Structure
                                </Link>
                                <Link
                                    to="my-profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    My Profile
                                </Link>
                                <a
                                    onClick={() => handleLogout}
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    Logout
                                </a>
                                {/* <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    Company
                                </a> */}
                            </div>
                            {/* <div className="py-6">
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    Log in
                                </a>
                            </div> */}
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    );
}
