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
            icon: <HomeOutlined sx={{ fontSize: 25 }} />,
            link: "/",
        },
        {
            label: "Profile",
            icon: <DashboardOutlined sx={{ fontSize: 25 }} />,
            link: "/",
        },
        {
            label: "Pending Applications",
            icon: <HourglassBottomOutlined sx={{ fontSize: 25 }} />,
            link: "/applications",
        },
        {
            label: "Schedule",
            icon: <CalendarMonthOutlined sx={{ fontSize: 25 }} />,
            link: "/schedule",
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
        <nav className={`${showSideBar ? "w-60 fixed" : "w-14 sticky"}  top-0 items-center overflow-hidden shadow-md py-4 px-2 text-white bg-indigo-900 z-10 h-dvh flex flex-col justify-between duration-300`}>
            {showLogOutPopup && <ConfirmPopup onConfirm={logOut} onCancel={cancel} text="Logout" />}
            <section className="w-full mt-2">
                {/* Header */}
                <div className="flex">
                    {/* Logo */}
                    <NavLink 
                    to="/"
                        className={`${showSideBar ? "opacity-100" : "opacity-0 -translate-x-10"}`}>
                        <img
                            className="size-8"
                            src={logo}
                            alt="React Jobs"
                        />
                    </NavLink>
                    <div className={`${showSideBar && "rotate-180 translate-x-40"} cursor-pointer duration-500`}><MenuOpen onClick={toggleSideBar} sx={{ fontSize: 27 }} /></div>
                </div>
                <div className="text-md mt-10 flex flex-col gap-4">
                    {menuItems.map((item, index) => (
                        item.label === "Home" ?
                            <NavLink key={index} to={item.link} className="flex items-center text-nowrap gap-2 cursor-pointer">
                            <div>{item.icon}</div>
                            <p className={`${!showSideBar && "translate-x-12"} duration-300`}>{showSideBar && item.label}</p>
                            </NavLink>
                            : currentUser && userLoggedIn && <NavLink key={index} to={item.link} className="flex items-center text-nowrap gap-2 cursor-pointer">
                                <div>{item.icon}</div>
                                <p className={`${!showSideBar && "translate-x-12"} duration-300`}>{showSideBar && item.label}</p>
                            </NavLink>
                    ))}
                </div>
            </section>
            <div className="flex items-center w-full gap-2 cursor-pointer">
                <div><AccountCircle sx={{ fontSize: 30 }} /></div>
                <div className={`${!showSideBar && "translate-y-14"} w-40 duration-300 overflow-auto text-sm text-gray-400`}>
                    <p>{userLoggedIn && currentUser.displayName || "John Doe"}</p>
                    <p>{currentUser && currentUser.email}</p>
                </div>
                {<div className={`${!showSideBar && "translate-x-12"} duration-300 text-sm ms-auto`}>{userLoggedIn ? <Logout sx={{ fontSize: 28 }} onClick={toggleLogOutPopup} className="hover:text-red-500" /> : <NavLink to="/login" onClick={toggleSideBar}><Login sx={{ fontSize: 28 }} className="hover:text-green-500" /></NavLink>}</div>}
            </div>
        </nav>
    )
}

export default SideBar;