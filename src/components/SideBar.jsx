import { NavLink } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { CalendarMonthOutlined, DashboardOutlined, HomeOutlined, HourglassBottomOutlined, MenuOpen, AccountCircle, Logout } from "@mui/icons-material";


const SideBar = ({ showSideBar, toggleSideBar }) => {

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
    ]

    return (
        <nav className={`${showSideBar ? "w-60 fixed" : "w-14 sticky"} top-0 items-center overflow-hidden shadow-md py-4 px-2 text-white bg-indigo-900 z-10 h-screen flex flex-col justify-between duration-300`}>
            <section className="w-full mt-2">
                <div className="flex justify-between">
                    {showSideBar && <NavLink className="" to="/">
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
                <div className={`${!showSideBar && "translate-y-14"} duration-300 text-sm`}>
                    <p>Dave</p>
                    <p>dave@gmail.com</p>
                </div>
                <div className="ms-auto"><Logout sx={{ fontSize: 24 }} className={`${!showSideBar && "translate-x-12"} duration-300 text-sm`} /></div>
            </div>
        </nav>
    )
}

export default SideBar;