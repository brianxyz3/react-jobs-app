import { useState } from "react";
import { NavLink } from "react-router-dom";
import ConfirmPopup from "./ConfirmPopup";
import { doLogOut } from "../../controllers/auth";
import { toast } from "react-toastify";
import logo from "../assets/images/logo.png";
import { CalendarMonthOutlined, DashboardOutlined, HomeOutlined, HourglassBottomOutlined, MenuOpen, AccountCircle, Logout, Login } from "@mui/icons-material";
import { useAuth } from "../firebaseContext/authContext";


const SideBar = ({ showSideBar, toggleSideBar }) => {
    const [showLogOutPopup, setShowLogOutPopup] = useState(false);
    const { currentUser, userLoggedIn } = useAuth();


    const menuItems = [
        {
            label: "Home",
            icon: <HomeOutlined sx={{ fontSize: 30 }} />
        },
        {
            label: "Profile",
            icon: <DashboardOutlined sx={{ fontSize: 30 }} />
        },
        {
            label: "Pending Applications",
            icon: <HourglassBottomOutlined sx={{ fontSize: 30 }} />
        },
        {
            label: "Schedule",
            icon: <CalendarMonthOutlined sx={{ fontSize: 30 }} />
        },
    ];

    const toggleLogOutPopup = () => { setShowLogOutPopup(prevState => !prevState) };


    const logOut = async () => {
        doLogOut();
        await cookieStore.delete("userId");
        toggleLogOutPopup();
        toast.success("Logout Successful, Goodbye");
    }

    const cancel = () => {
        toggleLogOutPopup();
        toast.error("Cancelled Logout");

    };

    return (
        <nav className={`${showSideBar ? "max-w-60 fixed min-w-14" : "w-14 sticky"} top-0 items-center overflow-hidden shadow-md py-4 px-2 text-white bg-indigo-900 z-10 max-h-screen min-h-full flex flex-col justify-between duration-300`}>
            {showLogOutPopup && <ConfirmPopup onConfirm={logOut} onCancel={cancel} text="Logout" />}
            <section className="w-full mt-2">
                {/* Header */}
                <div className="flex justify-between">
                    {/* Logo */}
                    {showSideBar && <NavLink to="/">
                        <img
                            className="size-7"
                            src={logo}
                            alt="React Jobs"
                        />
                    </NavLink>}
                    <div><MenuOpen onClick={toggleSideBar} sx={{ fontSize: 30 }} className={`${showSideBar && "rotate-180"} cursor-pointer duration-300`} /></div>
                </div>
                <ul className="text-md mt-10 flex flex-col gap-3">
                    {menuItems.map((item, index) => (
                        <li key={index} className="flex items-center text-nowrap gap-2 cursor-pointer">
                            <div>{item.icon}</div>
                            <p className={`${!showSideBar && "translate-x-12"} duration-300`}>{showSideBar && item.label}</p>
                        </li>
                    ))}
                </ul>
            </section>
            <div className="flex items-center w-full gap-3 cursor-pointer">
                <div><AccountCircle sx={{ fontSize: 30 }} /></div>
                <div className={`${!showSideBar && "translate-y-14"} duration-300 text-sm text-gray-400`}>
                    <p>{userLoggedIn && currentUser.displayName || "John Doe"}</p>
                    <p>{currentUser && currentUser.email}</p>
                </div>
                {<div className={`${!showSideBar && "translate-x-12"} duration-300 text-sm ms-auto`}>{userLoggedIn ? <Logout sx={{ fontSize: 28 }} onClick={toggleLogOutPopup} /> : <NavLink to="/login"><Login sx={{ fontSize: 28 }} /></NavLink>}</div>}
            </div>
        </nav>
    )
}

export default SideBar;